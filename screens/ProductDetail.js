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
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";

const pricingData = {
  "Mobile Phone/Tablet": [
    { repairType: "Screen Replacement", price: "₹1,199" },
    { repairType: "Battery Replacement", price: "₹799" },
    { repairType: "Charging Port Repair", price: "₹499" },
    { repairType: "Speaker/Mic Repair", price: "₹399" },
    { repairType: "Back Panel Replacement", price: "₹699" },
    { repairType: "Camera Repair", price: "₹899" },
    { repairType: "Water Damage Diagnosis", price: "Free" },
    { repairType: "Software Issue/Firmware", price: "₹399" },
    { repairType: "Tempered Glass", price: "₹49" },
  ],
  Laptop: [
    { repairType: "Screen Replacement", price: "₹2,499" },
    { repairType: "Battery Replacement", price: "₹1,199" },
    { repairType: "Keyboard Replacement", price: "₹999" },
    { repairType: "SSD Upgrade", price: "₹1,499" },
    { repairType: "RAM Upgrade", price: "₹999" },
    { repairType: "OS Installation/Formatting", price: "₹499" },
    { repairType: "Hinge Repair", price: "₹799" },
    { repairType: "Motherboard Repair", price: "₹2,499" },
    { repairType: "Adapter/Charger Issue", price: "₹399" },
  ],
  "Washing Machine": [
    { repairType: "Drainage Issue", price: "₹499" },
    { repairType: "Door Lock Repair", price: "₹599" },
    { repairType: "Motor Repair/Replacement", price: "₹1,799" },
    { repairType: "PCB (Control Board) Repair", price: "₹1,199" },
    { repairType: "Water Inlet Valve Replacement", price: "₹499" },
    { repairType: "General Service & Checkup", price: "₹299" },
  ],
  Refrigerators: [
    { repairType: "Gas Refilling", price: "₹1,199" },
    { repairType: "Compressor Repair", price: "₹1,999" },
    { repairType: "Thermostat Replacement", price: "₹599" },
    { repairType: "Door Gasket Replacement", price: "₹399" },
    { repairType: "Light/Power Issues", price: "₹499" },
    { repairType: "Cooling Coil Cleaning", price: "₹499" },
  ],
  AC: [
    { repairType: "Gas Charging", price: "₹1,799" },
    { repairType: "PCB Repair", price: "₹1,199" },
    { repairType: "Capacitor Replacement", price: "₹499" },
    { repairType: "Fan/Motor Repair", price: "₹799" },
    { repairType: "General Service", price: "₹399" },
    { repairType: "Installation/Uninstallation", price: "₹699" },
  ],
  Television: [
    { repairType: "Display Panel Replacement", price: "₹2,999" },
    { repairType: "Power Supply Board Repair", price: "₹999" },
    { repairType: "HDMI/AV Port Issues", price: "₹599" },
    { repairType: "Sound Issue Repair", price: "₹799" },
    { repairType: "Remote Sensor Repair", price: "₹499" },
    { repairType: "Wall Mounting", price: "₹399" },
  ],
  Geyser: [
    { repairType: "Heating Element Replacement", price: "₹599" },
    { repairType: "Thermostat Replacement", price: "₹399" },
    { repairType: "Water Leakage Fix", price: "₹499" },
    { repairType: "Power/Indicator Issue", price: "₹299" },
  ],
  "Microwave Ovens": [
    { repairType: "Magnetron Replacement", price: "₹1,199" },
    { repairType: "PCB Board Repair", price: "₹799" },
    { repairType: "Touch Panel Repair", price: "₹999" },
    { repairType: "Door Lock Issue", price: "₹499" },
    { repairType: "Fuse/Light Repair", price: "₹299" },
  ],
  "Water Purifiers (RO/UV)": [
    { repairType: "RO Membrane Replacement", price: "₹599" },
    { repairType: "Filter Replacement (Full)", price: "₹799" },
    { repairType: "Motor Pump Issue", price: "₹499" },
    { repairType: "Leakage Fix", price: "₹399" },
    { repairType: "Annual Maintenance Kit", price: "₹1,199" },
  ],
};

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    productName,
    categories: passedCategories,
    searchQuery,
  } = route.params || {};
  const deviceName =
    searchQuery?.trim() || productName?.trim() || "Unknown Device";
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
  const [isPricingVisible, setIsPricingVisible] = useState(true);

  useEffect(() => {
    const fetchDeviceCategories = async () => {
      if (passedCategories) {
        setDeviceCategories([passedCategories].flat());
        setLoading(false);
      } else {
        try {
          const response = await fetch(
            "http://192.168.1.8:7000/api/devices/all"
          );
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
      alert("You can only upload up to two images.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "image",
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImages([...images, result.assets[0].uri]);
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

  const uploadImagesToBackend = async () => {
    try {
      const formData = new FormData();
      images.forEach((uri, index) => {
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("file", { uri, name: filename, type });
      });
      formData.append("deviceName", deviceName);
      formData.append("brandName", brandName);
      formData.append("issueDescription", issueDescription);
      formData.append("date", date.toISOString());
      formData.append("timeSlot", selectedTimeSlot || "");

      const response = await fetch("http://192.168.1.8:7000/api/image/upload", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.ok) throw new Error("Failed to upload images");
      const result = await response.json();
      console.log("Upload response:", result);

      navigation.navigate("Carousel", {
        deviceName,
        categories: deviceCategories,
        brandName,
        issueDescription,
        date: date.toISOString(),
        timeSlot: selectedTimeSlot,
        images: [result.image._id],
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  const getProductCategory = () => {
    const categories = Object.keys(pricingData);
    const matchedCategory = categories.find((category) =>
      deviceCategories.some((deviceCategory) =>
        category.toLowerCase().includes(deviceCategory.toLowerCase())
      )
    );
    return matchedCategory || deviceName;
  };

  const productCategory = getProductCategory();
  const prices = pricingData[productCategory] || [];

  const renderPriceItem = ({ item }) => (
    <View style={styles.priceRow}>
      <Text style={styles.repairType}>{item.repairType}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );

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

          {prices.length > 0 && (
            <View style={styles.card}>
              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.dropdownHeader}
                  onPress={() => setIsPricingVisible(!isPricingVisible)}
                  accessibilityLabel={
                    isPricingVisible
                      ? "Collapse pricing information"
                      : "Expand pricing information"
                  }
                >
                  <Text style={styles.sectionTitle}>Pricing Information</Text>
                  <Ionicons
                    name={isPricingVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#2d3436"
                  />
                </TouchableOpacity>
                {isPricingVisible && (
                  <View style={styles.pricingContainer}>
                    <View style={styles.priceRow}>
                      <Text style={styles.pricingHeader}>Services</Text>
                      <Text style={styles.startingFromRight}>
                        Starting from
                      </Text>
                    </View>
                    <FlatList
                      data={prices}
                      renderItem={renderPriceItem}
                      keyExtractor={(item, index) =>
                        `${item.repairType}-${index}`
                      }
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                    />
                  </View>
                )}
              </View>
            </View>
          )}

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
              onPress={uploadImagesToBackend}
            >
              <LinearGradient
                colors={["#fd7e14", "#ffa502"]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitText}>SUBMIT REQUEST</Text>
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
  pricingHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 8,
    paddingBottom: 4,
  },
  startingFromRight: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
    flex: 1,
    textAlign: "right",
    paddingRight: 8,
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
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  pricingContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    maxHeight: 200,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dfe6e9",
  },
  repairType: {
    fontSize: 14,
    color: "#2d3436",
    flex: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fd7e14",
    flex: 1,
    textAlign: "right",
  },
});
