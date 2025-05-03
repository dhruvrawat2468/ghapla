import React, { useState, useContext } from "react";
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
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const validate = () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Error", "Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      console.log("Sending login request to:", API.defaults.baseURL + "/auth/login");
      console.log("Login payload:", { email, password });

      const success = await login(email, password);
      if (!success) {
        throw new Error("Login failed");
      }

      Alert.alert("Success", "Logged in successfully!", [
        { text: "OK", onPress: () => navigation.navigate("HomeMain") }
      ]);
    } catch (error) {
      console.error("❌ Login Error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      let errorMessage = "Login failed. Please try again.";
      if (error.response?.status === 404) {
        errorMessage = "User not found.";
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
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
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Log in to your account</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
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

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("SignupScreen")}
            >
              Sign Up
            </Text>
          </Text>
          <Text style={styles.signupText}>
            Repair now screen?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("RepairNowScreen")}
            >
              Click
            </Text>
          </Text>
          <Text style={styles.signupText}>
            Tracking screen?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("Tracking")}
            >
              Click
            </Text>
          </Text>
          <Text style={styles.signupText}>
            Product detail screen?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("ProductDetails")}
            >
              Click
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#000", marginBottom: 10 },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
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
    backgroundColor: "#ff9b42",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ffb07d",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signupText: { marginTop: 15, color: "#666" },
  signupLink: { color: "#fd7e14", fontWeight: "bold" },
  bottomImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 40,
    alignSelf: "center",
    marginTop: 30,
  },
});