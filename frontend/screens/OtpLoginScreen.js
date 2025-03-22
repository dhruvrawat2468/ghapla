import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, ScrollView, Platform, Image, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import API from "../utils/api"; // Import API instance

export default function OtpLoginScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const navigation = useNavigation();

  // Function to send OTP
  const sendOTP = async () => {
    if (!mobileNumber) {
      Alert.alert("Error", "Please enter your mobile number.");
      return;
    }

    try {
      const response = await API.post("/api/send_otp", { mobileNumber });
      Alert.alert("Success", "OTP sent successfully!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Function to verify OTP
  const verifyOTP = async () => {
    if (!mobileNumber || !otp) {
      Alert.alert("Error", "Please enter mobile number and OTP.");
      return;
    }

    try {
      const response = await API.post("/api/verify_otp", { mobileNumber, otp });
      Alert.alert("Success", "OTP Verified!");
      navigation.navigate("HomeScreen"); // Redirect user on success
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/user2.png")} style={styles.profileImage} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.innerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>OTP Login</Text>
          <Text style={styles.subtitle}>Enter your mobile number to receive an OTP</Text>

          {/* Mobile Number Input with Send OTP Button */}
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.rowContainer}>
            <TextInput 
              style={[styles.input, { flex: 1 }]} 
              placeholder="Enter your mobile number" 
              keyboardType="phone-pad" 
              maxLength={10} 
              placeholderTextColor="#999" 
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
            <TouchableOpacity style={styles.sendOtpButton} onPress={sendOTP}>
              <Text style={styles.buttonText}>SEND OTP</Text>
            </TouchableOpacity>
          </View>

          {/* OTP Input */}
          <Text style={styles.label}>OTP</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter OTP" 
            keyboardType="number-pad" 
            maxLength={6} 
            placeholderTextColor="#999" 
            value={otp}
            onChangeText={setOtp}
          />

          {/* Verify OTP Button */}
          <TouchableOpacity style={styles.button} onPress={verifyOTP}>
            <Text style={styles.buttonText}>VERIFY OTP</Text>
          </TouchableOpacity>

          {/* Navigate back to Login Screen */}
          <Text style={styles.signupText}>
            Go back to
            <Text style={styles.signupLink} onPress={() => navigation.navigate("LoginScreen")}>
              {" "}Login
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Image source={require("../assets/images/img3.jpeg")} style={styles.bottomImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 40,
    alignSelf: "center",
    marginTop: 100,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 50,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    width: "100%",
    backgroundColor: "#ff9b42", // Lightened orange
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupText: {
    marginTop: 15,
    color: "#666",
    textDecorationLine: "underline",
  },
  bottomImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100, 
    resizeMode: "cover",
  },
});
