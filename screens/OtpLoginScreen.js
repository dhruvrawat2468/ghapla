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
  Ionicons,
  FontAwesome,
  Entypo,
} from "@expo/vector-icons";
import API from "../utils/api";

export default function OtpLoginScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const navigation = useNavigation();

  const sendOTP = async () => {
    if (!mobileNumber) {
      Alert.alert("Error", "Please enter your mobile number.");
      return;
    }

    try {
      const response = await API.post("/api/send_otp", { mobileNumber });
      Alert.alert("Success", "OTP sent successfully!");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  };

  const verifyOTP = async () => {
    if (!mobileNumber || !otp) {
      Alert.alert("Error", "Please enter mobile number and OTP.");
      return;
    }

    try {
      const response = await API.post("/api/verify_otp", { mobileNumber, otp });
      Alert.alert("Success", "OTP Verified!");
      navigation.navigate("HomeScreen");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "OTP verification failed"
      );
    }
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

          {/* Verify OTP Button */}
          <TouchableOpacity style={styles.button} onPress={verifyOTP}>
            <MaterialIcons name="verified" size={18} color="#fff" />
            <Text style={styles.buttonText}> VERIFY OTP</Text>
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
  loginLinkContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  loginLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginLinkText: {
    color: "#fd7e14",
    fontWeight: "bold",
    fontSize: 14,
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
});
