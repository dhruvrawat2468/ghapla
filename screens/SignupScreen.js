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
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import API from "../utils/api";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [landmark, setLandmark] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");

  const navigation = useNavigation();

  const validate = () => {
    if (
      !name ||
      !mobile ||
      !houseNumber ||
      !landmark ||
      !street ||
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

  const handleSignup = async () => {
    if (!validate()) return;

    const payload = {
      name,
      email,
      phone: mobile,
      password,
      age: parseInt(age),
      gender,
      address: {
        houseNumber,
        landmark,
        street,
        city,
      },
    };

    try {
      const response = await API.post("/api/signup", payload);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
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
          showsVerticalScrollIndicator={false} // Removed scrollbar
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
              <TextInput
                style={styles.input}
                placeholder="Gender* (Male/Female/Other)"
                value={gender}
                onChangeText={setGender}
              />
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
                placeholder="Email (Optional)"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Account Security Section
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              <MaterialIcons name="security" size={18} color="#565656" />{" "}
              Account Security
            </Text>

            <View style={styles.inputContainer}>
              <Feather
                name="lock"
                size={20}
                color="#fd7e14"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password* (min 6 characters)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock-outline"
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
          </View> */}

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <MaterialIcons name="how-to-reg" size={20} color="#fff" />
            <Text style={styles.buttonText}> SIGN UP</Text>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("OtpLogin")}>
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
  // profileImage: {
  //   width: 120,
  //   height: 120,
  //   borderRadius: 60,
  //   alignSelf: "center",
  //   marginTop: 20,
  //   marginBottom: 10,
  //   borderWidth: 3,
  //   borderColor: "#fff",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
});
