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
import { Picker } from "@react-native-picker/picker";
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const { setUserToken, setUserProfile, setIsLoggedOut } = authContext;

  // Debug context values
  console.log("AuthContext values:", {
    setUserToken: typeof setUserToken,
    setUserProfile: typeof setUserProfile,
    setIsLoggedOut: typeof setIsLoggedOut,
  });

  const sanitizeString = (str) => str.replace(/[^a-zA-Z0-9\s-,.]/g, "");

  const validate = () => {
    if (
      !name ||
      !mobile ||
      !houseNumber ||
      !landmark ||
      !street ||
      !city ||
      !pincode ||
      !age ||
      !gender ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "All fields are required.");
      return false;
    }
    const cleanedMobile = mobile.replace(/\D/g, '');
    if (cleanedMobile.length !== 10) {
      Alert.alert("Error", "Mobile number must be 10 digits.");
      return false;
    }
    const cleanedPincode = pincode.replace(/\D/g, '');
    if (cleanedPincode.length !== 6) {
      Alert.alert("Error", "Pincode must be 6 digits.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Error", "Enter a valid email address.");
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

  const handleSignup = async () => {
    if (!validate()) return;

    const cleanedMobile = mobile.replace(/\D/g, '');
    const cleanedPincode = pincode.replace(/\D/g, '');

    const payload = {
      name: sanitizeString(name),
      email,
      password: sanitizeString(password),
      mobile: cleanedMobile,
      age: parseInt(age),
      gender: gender.toLowerCase(),
      address: [{
        houseNumber: sanitizeString(houseNumber),
        landmark: sanitizeString(landmark),
        street: sanitizeString(street),
        city: sanitizeString(city),
        pincode: cleanedPincode,
      }],
    };

    setIsLoading(true);
    try {
      console.log("Sending signup request to:", API.defaults.baseURL + "/auth/signup");
      console.log("Payload:", JSON.stringify(payload, null, 2));
      if (typeof payload !== "object" || payload === null) {
        throw new Error("Payload is not an object");
      }
      const response = await API.post("/auth/signup", payload);
      const { token, user } = response.data;

      console.log("🔹 Signup Response:", response.data);

      // Validate context functions
      if (typeof setUserToken !== "function") {
        throw new Error("setUserToken is not a function");
      }
      if (typeof setUserProfile !== "function") {
        throw new Error("setUserProfile is not a function");
      }
      if (typeof setIsLoggedOut !== "function") {
        throw new Error("setIsLoggedOut is not a function");
      }

      // Store token and user profile
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userProfile", JSON.stringify(user));
      setUserToken(token);
      setUserProfile(user);
      setIsLoggedOut(false);

      Alert.alert("Success", "Account created and logged in successfully!", [
        { text: "OK", onPress: () => navigation.navigate("HomeMain") },
      ]);
    } catch (error) {
      console.error("❌ Signup Error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });
      let errorMessage = "Signup failed. Please try again.";
      if (error.response?.status === 400 && error.response.data.errors) {
        errorMessage = error.response.data.errors.map(err => err.msg).join("\n");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message; // Display backend message (e.g., "User with this email already exists")
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message.includes("setUserToken")) {
        errorMessage = "Authentication context error. Please restart the app.";
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
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create an account to get started!</Text>

          {/* Personal Information Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <MaterialIcons name="person-outline" size={18} color="#565656" />{" "}
              Personal Information
            </Text>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="person-outline"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name*"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather
                name="phone"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number*"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="calendar-today"
                size={18}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Age*"
                keyboardType="numeric"
                maxLength={3}
                value={age}
                onChangeText={setAge}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="gender-male-female"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <Picker
                selectedValue={gender}
                onValueChange={(value) => setGender(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select gender*" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="email"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email*"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Address Information Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <MaterialIcons name="location-on" size={18} color="#565656" />{" "}
              Address Information
            </Text>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="home"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="House Number*"
                value={houseNumber}
                onChangeText={setHouseNumber}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="location-city"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Landmark*"
                value={landmark}
                onChangeText={setLandmark}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="map"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Street*"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="location-city"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="City*"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="pin-drop"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Pincode*"
                keyboardType="numeric"
                maxLength={6}
                value={pincode}
                onChangeText={setPincode}
              />
            </View>
          </View>

          {/* Password Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <MaterialIcons name="lock-outline" size={18} color="#565656" />{" "}
              Password
            </Text>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password*"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password*"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <MaterialIcons name="how-to-reg" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {isLoading ? " SIGNING UP..." : " SIGN UP"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("LoginA")}>
              <View style={styles.loginLink}>
                <Ionicons name="log-in" size={16} color="#fd7e14" />
                <Text style={styles.loginLinkText}> Sign In</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#565656",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#575757",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionContainer: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#565656",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  picker: {
    flex: 1,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    width: "100%",
    backgroundColor: "#fd7e14",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ffb07d",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginLinkText: {
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
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
});