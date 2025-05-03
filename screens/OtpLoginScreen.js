import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/api";

export default function OtpLoginScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [errorLogs, setErrorLogs] = useState([]); // Store error logs
  const navigation = useNavigation();

  // Add error to logs
  const logError = (message, error) => {
    const log = {
      timestamp: new Date().toISOString(),
      message,
      error: error?.message || "Unknown error",
      stack: error?.stack || null,
    };
    setErrorLogs((prev) => [...prev, log]);
    console.error(`[${log.timestamp}] ${message}:`, error);
  };

  const sendOTP = async () => {
    // Validate mobile number
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      const errorMsg = "Please enter a valid 10-digit mobile number.";
      logError(errorMsg, new Error(errorMsg));
      Alert.alert("Error", errorMsg);
      return;
    }

    try {
      const response = await API.post("/api/send", { mobileNumber: mobileNumber });
      if (response.data.success) {
        Alert.alert("Success", response.data.message || "OTP sent successfully!");
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send OTP";
      logError("Send OTP failed", error);
      Alert.alert("Error", errorMsg);
    }
  };

  const loginWithOTP = async () => {
    // Validate inputs
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      const errorMsg = "Please enter a valid 10-digit mobile number.";
      logError(errorMsg, new Error(errorMsg));
      Alert.alert("Error", errorMsg);
      return;
    }
    if (!otp) {
      const errorMsg = "Please enter the OTP.";
      logError(errorMsg, new Error(errorMsg));
      Alert.alert("Error", errorMsg);
      return;
    }

    try {
      const response = await API.post("/auth/login", { mobileNumber, otp });
      if (response.data.message === "Login successful") {
        // Store JWT token
        await AsyncStorage.setItem("token", response.data.token);
        
        // Optionally store user data
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        Alert.alert("Success", response.data.message);
        // Navigate to HomeScreen, optionally passing user data
        navigation.navigate("HomeMain", { user: response.data.user });
      } else {
        throw new Error(response.data.error || "OTP login failed");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "OTP login failed";
      logError("Login with OTP failed", error);
      Alert.alert("Error", errorMsg);
    }
  };

  // Debug function to view error logs
  const viewErrorLogs = () => {
    console.log("Error Logs:", errorLogs);
    Alert.alert("Debug Logs", JSON.stringify(errorLogs, null, 2));
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image
        source={require("../assets/images/user2.png")}
        style={styles.profileImage}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title with Icon */}
          <View style={styles.titleContainer}>
            <MaterialIcons name="verified-user" size={32} color="#565656" />
            <Text style={styles.title}>OTP Login</Text>
          </View>

          <Text style={styles.subtitle}>
            Enter your mobile number to receive an OTP
          </Text>

          {/* Mobile Number Input with Send OTP Button */}
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="phone-android"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor="#999"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>
          <TouchableOpacity style={styles.sendOtpButton} onPress={sendOTP}>
            <FontAwesome name="send-o" size={16} color="#fff" />
            <Text style={styles.buttonText}> SEND OTP</Text>
          </TouchableOpacity>

          {/* OTP Input */}
          <Text style={styles.label}>OTP</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter 6-digit OTP"
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor="#999"
              value={otp}
              onChangeText={setOtp}
            />
          </View>

          {/* Login with OTP Button */}
          <TouchableOpacity style={styles.button} onPress={loginWithOTP}>
            <MaterialIcons name="verified" size={18} color="#fff" />
            <Text style={styles.buttonText}> LOGIN WITH OTP</Text>
          </TouchableOpacity>

          {/* Debug Button (Hidden, for developers) */}
          <TouchableOpacity
            style={styles.debugButton}
            onPress={viewErrorLogs}
            activeOpacity={0.1}
          >
            <Text style={styles.debugButtonText}>Debug Logs</Text>
          </TouchableOpacity>

          {/* Signup Link with Icon */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <View style={styles.signupLinkContainer}>
                <Text style={styles.signupLink}>Sign Up</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#fd7e14" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Image */}
      <Image
        source={require("../assets/images/img3.jpeg")}
        style={styles.bottomImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#565656",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "bold",
    color: "#565656",
    marginBottom: 5,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  sendOtpButton: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fd7e14",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fd7e14",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  signupText: {
    color: "#666",
  },
  signupLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  signupLink: {
    color: "#fd7e14",
    fontWeight: "bold",
  },
  bottomImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  debugButton: {
    marginTop: 10,
    padding: 5,
    opacity: 0.1, // Hidden but accessible for debugging
  },
  debugButtonText: {
    color: "#999",
    fontSize: 12,
  },
});