import React, { useState, useContext } from "react";
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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ComplaintScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userToken } = useContext(AuthContext);
  const [complaintType, setComplaintType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get repairItem from navigation params
  const repairItem = route.params?.repairItem;

  const handleSubmit = async () => {
    if (!complaintType || !title || !description) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (!repairItem?.id) {
      Alert.alert("Error", "No order selected for the complaint.");
      return;
    }

    if (!userToken) {
      Alert.alert("Error", "You must be logged in to submit a complaint.");
      return;
    }

    setIsSubmitting(true);

    try {
      const complaintData = {
        orderId: repairItem.id,
        complaintType,
        description,
        name: repairItem.name,
      };
      console.log("Submitting complaint:", complaintData);

      const response = await axios.post(
        "http://192.168.1.8:7000/api/complaints",
        complaintData,
        {
          headers: { Authorization: `Bearer ${userToken}`, "Content-Type": "application/json" },
        }
      );

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
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit complaint. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Order Details */}
        {repairItem ? (
          <View style={styles.orderContainer}>
            <Image source={repairItem.image} style={styles.itemImage} />
            <View style={styles.textContainer}>
              <Text style={styles.itemName}>{repairItem.name}</Text>
              <Text style={styles.itemDate}>📅 {repairItem.date}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noOrderText}>No order selected.</Text>
        )}

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
            textAlignVertical="top"
          />
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
  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  itemImage: {
    width: 55,
    height: 55,
    marginRight: 15,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 14,
    color: "#666",
  },
  noOrderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
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