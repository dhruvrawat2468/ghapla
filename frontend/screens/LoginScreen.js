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
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { TechnicianContext } from "../context/TechnicianContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setTechnician } = useContext(TechnicianContext);

  const validateInputs = () => {
    if (!email && !password) {
      Alert.alert("Error", "Please enter your email/mobile and password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Determine if input is email or mobile
      const isEmail = email.includes('@');
      const loginData = isEmail
        ? { email, password }
        : { mobile: email, password };

      // Create a timeout promise
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );

      // Race the fetch against the timeout
      const response = await Promise.race([
        fetch("http://192.168.1.13:7000/auth/technician/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }),
        timeout
      ]);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token in AsyncStorage
      await AsyncStorage.setItem("technicianToken", data.token);

      // Update technician context with logged in user data
      setTechnician({
        id: data.technician._id,
        name: data.technician.name,
        email: data.technician.email,
        mobile: data.technician.mobile,
        address: data.technician.address,
        gender: data.technician.gender,
        age: data.technician.age,
        overallStatus: "Verified", // Default for now
        isOnline: false,
      });

      // The App.js will detect the technician context change and automatically
      // switch to the main app interface. No need to navigate manually.
    } catch (error) {
      console.error("Login error:", error);

      // More detailed error message
      let errorMessage = "Something went wrong. Please try again.";

      if (error.message) {
        errorMessage = error.message;

        // Add more context for network errors
        if (error.message.includes("Network request failed")) {
          errorMessage = "Network connection error. Please check your internet connection and make sure the backend server is running.";
        } else if (error.message.includes("timed out")) {
          errorMessage = "Request timed out. The server might be overloaded or unreachable.";
        }
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <Image
          source={require("../assets/images/user2.png")}
          style={styles.profileImage}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to your technician account
          </Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Email or Mobile</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="person"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email or mobile"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate("OtpLoginScreen")}
            >
              <Text style={styles.forgotPasswordText}>
                Login with OTP instead?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>LOGIN</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("SignupScreen")}
            >
              Sign Up
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom decorative image */}
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
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ff7f00",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#ff7f00",
    fontSize: 14,
  },
  button: {
    width: "100%",
    backgroundColor: "#ff7f00",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupText: {
    marginTop: 20,
    color: "#666",
    textAlign: "center",
  },
  signupLink: {
    color: "#ff7f00",
    fontWeight: "bold",
  },
  bottomImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    resizeMode: "cover",
    zIndex: 0,
  },
});
