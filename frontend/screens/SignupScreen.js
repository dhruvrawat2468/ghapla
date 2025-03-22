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
import { Picker } from "@react-native-picker/picker";
import API from "../utils/api";
export default function SignupScreen() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [address, setAddress] = useState(""); // Now required: street/city
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState(""); // Optional
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();

  // Validation Function
  const validate = () => {
    if (
      !name ||
      !mobile ||
      !houseNumber ||
      !landmark ||
      !address ||
      !age ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "All fields except email are required.");
      return false;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
      Alert.alert("Error", "Mobile number must be 10 digits.");
      return false;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Error", "Enter a valid email address if provided.");
      return false;
    }
    if (isNaN(age) || age < 1 || age > 120) {
      Alert.alert("Error", "Enter a valid age between 1 and 120.");
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

    const payload = {
      name,
      email,
      phone: mobile,  // ✅ Change `mobile` to `phone`
      password,
      age: parseInt(age),
      gender,
      address: [{ 
        houseNumber: houseNumber,
        landmark: landmark,
        street: address,
      }],
    };

    try {
      const response = await API.post("/api/signup", payload);

      console.log("🔹 Signup Response:", response.data); // ✅ Debugging response
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
      ]);
    } catch (error) {
      console.error("❌ Signup Error:", error.response?.data || error);
      Alert.alert("Error", error.response?.data?.message || "Signup failed");
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

          {/* House Number */}
          <Text style={styles.label}>House Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your house number"
            placeholderTextColor="#999"
            value={houseNumber}
            onChangeText={setHouseNumber}
          />

          {/* Landmark */}
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a nearby landmark"
            placeholderTextColor="#999"
            value={landmark}
            onChangeText={setLandmark}
          />

          {/* Address (Now Required) */}
          <Text style={styles.label}>Street/City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter street/city"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
          />

          {/* Age */}
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#999"
            value={age}
            onChangeText={setAge}
          />

      {/* Gender */}
<Text style={styles.label}>Gender</Text>
<TextInput
  style={styles.input}
  placeholder="Enter your gender (Male, Female, Other)"
  placeholderTextColor="#999"
  value={gender}
  onChangeText={setGender} // Now user can type directly
/>


          {/* Email (Optional) */}
          <Text style={styles.label}>Email (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email (optional)"
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

          {/* Navigation Links */}
          <Text style={styles.signupText}>
            Already have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("LoginScreen")}
            >
              Sign In
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
              onPress={() => navigation.navigate("TrackingScreen")}
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

      {/* Curved Bottom Image */}
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
  pickerContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    width: "100%",
    backgroundColor: "#ff9b42",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
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