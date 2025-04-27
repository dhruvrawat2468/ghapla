import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const ComplaintScreen = () => {
  const [complaintType, setComplaintType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow microphone access to record audio"
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedAudio(uri);
      setRecording(null);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const playRecording = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordedAudio },
        { shouldPlay: true }
      );
      setSound(sound);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await sound.playAsync();
    } catch (err) {
      console.error("Failed to play recording", err);
    }
  };

  const stopPlaying = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setRecordedAudio(null);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
  };

  const handleSubmit = () => {
    if (!complaintType || !title || !description) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    console.log({
      complaintType,
      title,
      description,
      audio: recordedAudio || null,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Complaint Submitted",
        "Your complaint has been registered successfully. We'll get back to you soon.",
        [
          {
            text: "OK",
            onPress: () => {
              setComplaintType("");
              setTitle("");
              setDescription("");
              setRecordedAudio(null);
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Submit a Complaint</Text>
          <Text style={styles.subHeader}>
            We're here to help resolve your issues
          </Text>
        </View>

        {/* Complaint type selection */}
        <Text style={styles.label}>COMPLAINT TYPE*</Text>
        <View style={styles.radioGroup}>
          {[
            { id: "app", label: "App Issue", icon: "phone-portrait-outline" },
            { id: "technician", label: "Technician", icon: "person-outline" },
            { id: "service", label: "Service", icon: "construct-outline" },
          ].map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.radioButton,
                complaintType === type.id && styles.radioButtonSelected,
              ]}
              onPress={() => setComplaintType(type.id)}
            >
              <Ionicons
                name={type.icon}
                size={20}
                color={complaintType === type.id ? "#fd7e14" : "#666"}
              />
              <Text
                style={[
                  styles.radioText,
                  complaintType === type.id && styles.radioTextSelected,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Complaint title */}
        <Text style={styles.label}>TITLE*</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Brief summary of your complaint"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Complaint description */}
        <Text style={styles.label}>DESCRIPTION*</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Please describe your issue in detail..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
          />
        </View>

        {/* Voice recording section */}
        <Text style={styles.label}>VOICE NOTE (OPTIONAL)</Text>
        <View style={styles.recordingContainer}>
          {recordedAudio ? (
            <View style={styles.recordingControls}>
              <TouchableOpacity
                style={[styles.recordingButton, styles.playButton]}
                onPress={isPlaying ? stopPlaying : playRecording}
              >
                <Ionicons
                  name={isPlaying ? "stop-circle" : "play-circle"}
                  size={24}
                  color="#fff"
                />
                <Text style={styles.recordingButtonText}>
                  {isPlaying ? "Stop" : "Play"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.recordingButton, styles.deleteButton]}
                onPress={deleteRecording}
              >
                <Ionicons name="trash-bin" size={20} color="#fff" />
                <Text style={styles.recordingButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.recordingButton, styles.recordButton]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons
                name={isRecording ? "stop-circle" : "mic"}
                size={24}
                color="#fff"
              />
              <Text style={styles.recordingButtonText}>
                {isRecording ? "Stop Recording" : "Record Voice Note"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Processing...</Text>
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: "#fff",
  },
  headerContainer: {
    marginBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "600",
    color: "#555",
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  multilineInput: {
    height: 150,
    textAlignVertical: "top",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  radioButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  radioButtonSelected: {
    borderColor: "#fd7e14",
    backgroundColor: "#fff9f2",
  },
  radioText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#666",
    fontWeight: "500",
  },
  radioTextSelected: {
    color: "#fd7e14",
    fontWeight: "600",
  },
  recordingContainer: {
    marginBottom: 25,
  },
  recordingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordButton: {
    backgroundColor: "#fd7e14",
  },
  playButton: {
    backgroundColor: "#28a745",
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  recordingButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
  recordingControls: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#fd7e14",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
    shadowColor: "#fd7e14",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#ffb570",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
});

export default ComplaintScreen;