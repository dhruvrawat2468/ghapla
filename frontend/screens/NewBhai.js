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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { Audio } from "expo-av";
import { useNavigation, useRoute } from "@react-navigation/native";

const FillOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productName, serviceType, searchQuery } = route.params || {}; // Updated to include serviceType
  const deviceName =
    searchQuery?.trim() || productName?.trim() || "Unknown Device";
  const [brandName, setBrandName] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null);
  const [sound, setSound] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Please grant permission to access the microphone.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedURI(uri);
      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  const playRecording = async () => {
    try {
      if (!recordedURI) return;
      const { sound } = await Audio.Sound.createAsync({ uri: recordedURI });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Failed to play audio", error);
    }
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const openImageModal = (img) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Product Details</Text>
          <Text style={styles.label}>Product: {deviceName}</Text>
          <Text style={styles.label}>
            Service Type: {serviceType || "Not specified"}
          </Text>

          <Text style={styles.label}>Brand Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter brand name"
            value={brandName}
            onChangeText={setBrandName}
          />

          <Text style={styles.label}>Description of Issue:</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe the issue"
            value={issueDescription}
            onChangeText={setIssueDescription}
            multiline
          />

          <Text style={styles.label}>Select Date:</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <Text style={styles.label}>Select Time Slot:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.timeSlotsContainer}
          >
            {["10 AM - 1 PM", "1 PM - 4 PM", "4 PM - 7 PM", "7 PM - 10 PM"].map(
              (slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlot,
                    selectedTimeSlot === slot && styles.selectedTimeSlot,
                  ]}
                  onPress={() => setSelectedTimeSlot(slot)}
                >
                  <Text style={styles.timeSlotText}>{slot}</Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          <Text style={styles.label}>Upload Images:</Text>
          <View style={styles.imageContainer}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <TouchableOpacity onPress={() => openImageModal(img)}>
                  <Image source={{ uri: img }} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#fd7e14" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 2 && (
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Ionicons name="add" size={40} color="#fd7e14" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Voice Recording:</Text>
          <View style={styles.audioControls}>
            <TouchableOpacity
              style={[styles.recordButton, recording && styles.recording]}
              onPress={recording ? stopRecording : startRecording}
            >
              <Ionicons
                name={recording ? "stop" : "mic"}
                size={24}
                color="#fff"
              />
              <Text style={styles.buttonText}>
                {recording ? "Stop" : "Record"}
              </Text>
            </TouchableOpacity>

            {recordedURI && (
              <TouchableOpacity
                style={styles.playButton}
                onPress={playRecording}
              >
                <Ionicons name="play" size={24} color="#fff" />
                <Text style={styles.buttonText}>Play</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() =>
              navigation.navigate("Carousel", {
                deviceName: deviceName,
                serviceType: serviceType, // Added serviceType to navigation params
              })
            }
          >
            <Text style={styles.submitText}>SUBMIT</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeImageModal}
      >
        <TouchableWithoutFeedback onPress={closeImageModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#ff9f43",
  },
  card: {
    marginTop: 50,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#565656",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#565656",
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#565656",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 5,
  },
  descriptionInput: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 5,
    minHeight: 120,
    textAlignVertical: "top",
  },
  datePicker: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  dateText: {
    fontSize: 16,
  },
  timeSlotsContainer: {
    marginTop: 10,
  },
  timeSlot: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    width: 120,
    alignItems: "center",
  },
  selectedTimeSlot: {
    backgroundColor: "#fd7e14",
  },
  audioControls: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
    gap: 10,
  },
  recordButton: {
    flexDirection: "row",
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recording: {
    backgroundColor: "#d9534f",
  },
  playButton: {
    flexDirection: "row",
    backgroundColor: "green",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#fd7e14",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
});

export default FillOrder;