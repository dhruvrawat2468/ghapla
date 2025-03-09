import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, ScrollView, Platform, Image, Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();

  // Validation Function
  const validate = () => {
    if (!name || !mobile || !address || !password || !confirmPassword) {
      Alert.alert("Error", "All fields except email are required.");
      return false;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
      Alert.alert("Error", "Mobile number must be 10 digits.");
      return false;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Error", "Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }
    return true;
  };

  // Handle Signup Function
  const handleSignup = async () => {
    if (!validate()) return;

    try {
      const response = await fetch("https://your-api-endpoint.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, address, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please check your connection.");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.innerContainer}>
        <Image source={require("../assets/images/user2.png")} style={styles.profileImage} />
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {/* Title */}
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create an account to get started!</Text>

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your name" 
            placeholderTextColor="#999"
            value={name} 
            onChangeText={setName} 
          />

          {/* Mobile Number */}
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your mobile number" 
            keyboardType="phone-pad" 
            maxLength={10} 
            placeholderTextColor="#999"
            value={mobile} 
            onChangeText={setMobile} 
          />

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your address" 
            placeholderTextColor="#999"
            value={address} 
            onChangeText={setAddress} 
          />

          {/* Email (Optional) */}
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your email" 
            keyboardType="email-address" 
            placeholderTextColor="#999"
            value={email} 
            onChangeText={setEmail} 
          />
          
          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your password" 
            secureTextEntry 
            placeholderTextColor="#999" 
            value={password} 
            onChangeText={setPassword} 
          />

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Confirm your password" 
            secureTextEntry 
            placeholderTextColor="#999" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
          />

          {/* Signup Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>

          {/* Already have an account */}
          <Text style={styles.signupText}>
            Already have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate("LoginScreen")}>Sign In</Text>
          </Text>
          
          <Text style={styles.signupText}>
            Repair now screen? <Text style={styles.signupLink} onPress={() => navigation.navigate("RepairNowScreen")}>Click</Text>
          </Text>

          <Text style={styles.signupText}>
            Tracking screen? <Text style={styles.signupLink} onPress={() => navigation.navigate("TrackingScreen")}>Click</Text>
          </Text>

          <Text style={styles.signupText}>
            Product detail screen? <Text style={styles.signupLink} onPress={() => navigation.navigate("ProductDetails")}>Click</Text>
          </Text>


        </ScrollView>
      </KeyboardAvoidingView>

      {/* Curved Bottom Image */}
      <Image source={require("../assets/images/img3.jpeg")} style={styles.bottomImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  innerContainer: { flex: 1, paddingHorizontal: 20 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingBottom: 100 },
  title: { fontSize: 32, fontWeight: "bold", color: "#000", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 10 },
  label: { alignSelf: "flex-start", fontSize: 14, fontWeight: "bold", color: "#444", marginBottom: 5 },
  input: { width: "100%", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 5, borderWidth: 1, borderColor: "#ddd" },
  button: { width: "100%", backgroundColor: "#ff9b42", padding: 15, borderRadius: 25, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signupText: { marginTop: 15, color: "#666" },
  signupLink: { color: "#fd7e14", fontWeight: "bold" },
  bottomImage: { position: "absolute", bottom: 0, width: "100%", height: 100, resizeMode: "cover" },
  profileImage: { width: 150, height: 150, borderRadius: 40, alignSelf: "center", marginTop: 30 },
});
