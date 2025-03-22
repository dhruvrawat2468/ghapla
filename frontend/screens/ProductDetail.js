//details of the product like brand name,description of the issue, date,time slot,voice recording
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { Audio } from "expo-av";

const ProductDetailsScreen = () => {
  const [brandName, setBrandName] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null);
  const [sound, setSound] = useState(null);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // Start Recording
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
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  // Stop Recording
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

  // Play Recorded Audio
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

  // Cleanup Audio Resources
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Product Details</Text>

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
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
          )}

          <Text style={styles.label}>Select Time Slot:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotsContainer}>
            {["10 AM - 1 PM", "1 PM - 4 PM", "4 PM - 7 PM", "7 PM - 10 PM"].map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.timeSlot, selectedTimeSlot === slot && styles.selectedTimeSlot]}
                onPress={() => setSelectedTimeSlot(slot)}
              >
                <Text style={styles.timeSlotText}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Voice Recording:</Text>
          <View style={styles.audioControls}>
            <TouchableOpacity
              style={[styles.recordButton, recording && styles.recording]}
              onPress={recording ? stopRecording : startRecording}
            >
              <Ionicons name={recording ? "stop" : "mic"} size={24} color="#fff" />
              <Text style={styles.buttonText}>{recording ? "Stop" : "Record"}</Text>
            </TouchableOpacity>

            {recordedURI && (
              <TouchableOpacity style={styles.playButton} onPress={playRecording}>
                <Ionicons name="play" size={24} color="#fff" />
                <Text style={styles.buttonText}>Play</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>SUBMIT</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
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
    justifyContent: "space-around",
    marginTop: 10,
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
});

export default ProductDetailsScreen;
