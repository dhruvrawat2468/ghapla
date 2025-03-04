
import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, ScrollView, Platform, Image, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function LoginScreen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert("Error", "Please enter both mobile number and password");
      return;
    }

    try {
      const response = await axios.post("http://your-backend-ip:5000/login", {
        mobileNumber,
        password,
      });

      Alert.alert("Success", response.data.message);
      navigation.navigate("HomeScreen"); // Navigate to home screen after login
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
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
        >
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Welcome back to your trusted electric repair app!</Text>

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your mobile number" 
            keyboardType="phone-pad" 
            maxLength={10} 
            placeholderTextColor="#999" 
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your password" 
            secureTextEntry 
            placeholderTextColor="#999" 
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>SIGN IN</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          <TouchableOpacity 
            style={styles.otpButton} 
            onPress={() => navigation.navigate("OtpLoginScreen")}
          >
            <Text style={styles.otpButtonText}>LOGIN WITH OTP</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don't have an account? 
            <Text 
              style={styles.signupLink} 
              onPress={() => navigation.navigate("SignupScreen")}
            >
              {" "}SignUp
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Image 
        source={require("../assets/images/img3.jpeg")}  
        style={styles.bottomImage} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  innerContainer: { flex: 1, paddingHorizontal: 20 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingBottom: 100 },
  title: { fontSize: 32, fontWeight: "bold", color: "#000", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 50 },
  label: { alignSelf: "flex-start", fontSize: 14, fontWeight: "bold", color: "#444", marginBottom: 5 },
  input: { width: "100%", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  button: { width: "100%", backgroundColor: "#fd7e14", padding: 15, borderRadius: 25, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  otpButton: { width: "100%", backgroundColor: "#fd7e14", padding: 15, borderRadius: 25, alignItems: "center", marginTop: 10 },
  otpButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signupText: { marginTop: 15, color: "#666" },
  signupLink: { color: "#fd7e14", fontWeight: "bold" },
  bottomImage: { position: "absolute", bottom: 0, width: "100%", height: 100, resizeMode: "cover" },
  orText: { color: "#666" },
  profileImage: { width: 150, height: 150, borderRadius: 40, alignSelf: "center", marginTop: 100 },
});
