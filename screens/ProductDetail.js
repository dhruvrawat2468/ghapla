import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productName, categories: passedCategories, searchQuery } = route.params || {};
  const deviceName = searchQuery?.trim() || productName?.trim() || "Unknown Device";
  const [brandName, setBrandName] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceCategories, setDeviceCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceCategories = async () => {
      if (passedCategories) {
        setDeviceCategories([passedCategories].flat());
        setLoading(false);
      } else {
        try {
          const response = await fetch("http://192.168.1.6:7000/api/devices/all");
          if (!response.ok) throw new Error("Failed to fetch devices");
          const devices = await response.json();
          const matchingDevices = devices.filter(
            (device) => device.name.toLowerCase() === deviceName.toLowerCase()
          );
          const uniqueCategories = [
            ...new Set(matchingDevices.map((device) => device.serviceMode)),
          ];
          setDeviceCategories(uniqueCategories);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching device categories:", error);
          setDeviceCategories([]);
          setLoading(false);
        }
      }
    };
    fetchDeviceCategories();
  }, [deviceName, passedCategories]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const pickImage = async () => {
    if (images.length >= 2) {
      Alert.alert("Limit Reached", "You can only upload up to two images.");
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need gallery permissions to select images. Please enable them in your device settings."
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const openImageModal = (img) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const uploadImagesToBackend = async (
    image,
    deviceName,
    deviceCategories,
    brandName,
    issueDescription,
    date,
    selectedTimeSlot,
    navigation
  ) => {
    try {
      let imageId = null;

      if (image && typeof image === "string") {
        const formData = new FormData();
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("file", { uri: image, name: filename, type });

        const response = await fetch("http://192.168.1.6:7000/api/image/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to upload image");
        }

        imageId = result.image ? result.image._id : null;
        console.log("Upload response:", result);
      }

      return imageId;
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Upload Failed", error.message || "Failed to process request. Please try again.");
      throw error;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={["#fff9f2", "#ffe8cc"]} style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Service Request</Text>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{deviceName}</Text>
            </View>
            {deviceCategories.length > 0 && (
              <View style={styles.serviceTypeContainer}>
                {deviceCategories.map((category, index) => (
                  <View key={index} style={styles.serviceTypeBadge}>
                    <Text style={styles.serviceTypeText}>{category}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Product Information</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Brand Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter brand name"
                  value={brandName}
                  onChangeText={setBrandName}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Issue Description</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Describe the issue you're facing"
                  value={issueDescription}
                  onChangeText={setIssueDescription}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Schedule Appointment</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity
                  style={styles.datePicker}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar" size={20} color="#fd7e14" />
                  <Text style={styles.dateText}>
                    {date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Time Slot</Text>
                <View style={styles.timeSlotsContainer}>
                  {[
                    "10 AM - 1 PM",
                    "1 PM - 4 PM",
                    "4 PM - 7 PM",
                    "7 PM - 10 PM",
                  ].map((slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.timeSlot,
                        selectedTimeSlot === slot && styles.selectedTimeSlot,
                      ]}
                      onPress={() => setSelectedTimeSlot(slot)}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTimeSlot === slot &&
                            styles.selectedTimeSlotText,
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attachments</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Upload Images (Max 2)</Text>
                <View style={styles.imageContainer}>
                  {images.map((img, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <TouchableOpacity onPress={() => openImageModal(img)}>
                        <Image source={{ uri: img }} style={styles.image} />
                        <View style={styles.imageOverlay}>
                          <Ionicons name="expand" size={20} color="white" />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeIcon}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#ff4757"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {images.length < 2 && (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={pickImage}
                    >
                      <View style={styles.uploadButtonInner}>
                        <Ionicons
                          name="cloud-upload"
                          size={28}
                          color="#fd7e14"
                        />
                        <Text style={styles.uploadButtonText}>Add Image</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={async () => {
                try {
                  const imageIds = [];
                  for (const image of images) {
                    const imageId = await uploadImagesToBackend(
                      image,
                      deviceName,
                      deviceCategories,
                      brandName,
                      issueDescription,
                      date,
                      selectedTimeSlot,
                      navigation
                    );
                    if (imageId) {
                      imageIds.push(imageId);
                    }
                  }
                  navigation.navigate("Carousel", {
                    deviceName,
                    categories: deviceCategories,
                    brandName,
                    issueDescription,
                    date: date.toISOString(),
                    timeSlot: selectedTimeSlot || "",
                    images: imageIds,
                  });
                } catch (error) {
                  console.error("Failed to upload images:", error);
                }
              }}
            >
              <LinearGradient
                colors={["#fd7e14", "#ffa502"]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitText}>NEXT</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#fff"
                  style={styles.submitIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={modalVisible}
          transparent
          onRequestClose={closeImageModal}
        >
          <TouchableWithoutFeedback onPress={closeImageModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.fullImage}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  header: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 8,
  },
  deviceInfo: {
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#636e72",
  },
  serviceTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 2,
  },
  serviceTypeBadge: {
    backgroundColor: "#fd7e14",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 20,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 16,
  },
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636e72",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: "#2d3436",
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  dateText: {
    fontSize: 16,
    color: "#2d3436",
    marginLeft: 10,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 4,
  },
  timeSlot: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  selectedTimeSlot: {
    backgroundColor: "#fd7e14",
    borderColor: "#fd7e14",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#636e72",
  },
  selectedTimeSlotText: { color: "#fff" },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageWrapper: {
    position: "relative",
    marginRight: 12,
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  uploadButtonInner: {
    alignItems: "center",
  },
  uploadButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: "#fd7e14",
    fontWeight: "500",
  },
  submitButton: {
    margin: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  submitIcon: { marginLeft: 10 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalContent: {
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff9f2",
  },
  loadingText: {
    fontSize: 18,
    color: "#565656",
  },
});