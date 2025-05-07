import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, ScrollView, Platform, Image, Alert, Animated 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  const navigation = useNavigation();

  // Log platform for debugging
  console.log("Device Platform:", Platform.OS);

  // Validation Function for initial form
  const validateInitial = () => {
    console.log("Validating initial form:", { name, mobile, address, email, password, confirmPassword });
    if (!name || !mobile || !address || !password || !confirmPassword) {
      Alert.alert("Error", "All fields except email are required.");
      console.log("Validation failed: Missing required fields");
      return false;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
      Alert.alert("Error", "Mobile number must be 10 digits.");
      console.log("Validation failed: Invalid mobile number");
      return false;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Error", "Enter a valid email address.");
      console.log("Validation failed: Invalid email");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      console.log("Validation failed: Password too short");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      console.log("Validation failed: Passwords do not match");
      return false;
    }
    console.log("Initial form validation passed");
    return true;
  };

  // Validation Function for additional form
  const validateAdditional = () => {
    console.log("Validating additional form:", { gender, age, ifscCode, aadhaarImage, userPhoto });
    if (!gender || !age || !ifscCode) {
      Alert.alert("Error", "Gender, age, and IFSC code are required.");
      console.log("Validation failed: Missing required additional fields");
      return false;
    }
    if (!["Male", "Female", "Other"].includes(gender)) {
      Alert.alert("Error", "Gender must be Male, Female, or Other.");
      console.log("Validation failed: Invalid gender");
      return false;
    }
    if (isNaN(age) || age < 1 || age > 120) {
      Alert.alert("Error", "Enter a valid age between 1 and 120.");
      console.log("Validation failed: Invalid age");
      return false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      Alert.alert("Error", "Enter a valid IFSC code (e.g., SBIN0001234).");
      console.log("Validation failed: Invalid IFSC code");
      return false;
    }
    console.log("Additional form validation passed");
    return true;
  };

  // Show popup with animation
  const showPopupWithAnimation = () => {
    console.log("Attempting to show popup");
    if (validateInitial()) {
      setShowPopup(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start(() => console.log("Popup animation completed"));
    } else {
      console.log("Popup not shown due to validation failure");
    }
  };

  // Hide popup with animation
  const hidePopupWithAnimation = () => {
    console.log("Hiding popup");
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPopup(false);
      console.log("Popup hidden");
    });
  };

  // Handle Aadhaar image upload
  const handleAadhaarImageUpload = async () => {
    console.log("Requesting media library permissions for Aadhaar image");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need gallery permissions to upload your Aadhaar image.");
      console.log("Aadhaar image upload failed: Permission denied");
      return;
    }

    console.log("Launching image picker for Aadhaar image");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      console.log("Aadhaar image selected:", result.assets[0]);
      setAadhaarImage(result.assets[0]);
    } else {
      console.log("Aadhaar image picker canceled");
    }
  };

  // Handle user photo upload
  const handleUserPhotoUpload = async () => {
    console.log("Requesting media library permissions for user photo");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need gallery permissions to upload your photo.");
      console.log("User photo upload failed: Permission denied");
      return;
    }

    console.log("Launching image picker for user photo");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      console.log("User photo selected:", result.assets[0]);
      setUserPhoto(result.assets[0]);
    } else {
      console.log("User photo picker canceled");
    }
  };

  // Handle final signup with additional details and optional images
  const handleFinalSignup = async () => {
    console.log("Starting final signup");
    if (!validateAdditional()) {
      console.log("Final signup aborted: Validation failed");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("address", address);
      if (email) formData.append("email", email);
      formData.append("password", password);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("ifscCode", ifscCode);
      
      if (aadhaarImage) {
        console.log("Adding aadhaarImage to FormData:", {
          uri: aadhaarImage.uri,
          type: aadhaarImage.mimeType || "image/jpeg",
          name: aadhaarImage.fileName || `aadhaar_${Date.now()}.jpg`,
        });
        formData.append("aadhaarImage", {
          uri: aadhaarImage.uri,
          type: aadhaarImage.mimeType || "image/jpeg",
          name: aadhaarImage.fileName || `aadhaar_${Date.now()}.jpg`,
        });
      }
      if (userPhoto) {
        console.log("Adding userPhoto to FormData:", {
          uri: userPhoto.uri,
          type: userPhoto.mimeType || "image/jpeg",
          name: userPhoto.fileName || `photo_${Date.now()}.jpg`,
        });
        formData.append("userPhoto", {
          uri: userPhoto.uri,
          type: userPhoto.mimeType || "image/jpeg",
          name: userPhoto.fileName || `photo_${Date.now()}.jpg`,
        });
      }

      // Log FormData entries for debugging
      const formDataEntries = [];
      for (let [key, value] of formData.entries()) {
        formDataEntries.push({ key, value });
      }
      console.log("FormData Entries:", JSON.stringify(formDataEntries, null, 2));

      // Log request details
      const requestUrl = "http://192.168.1.8:8000/auth/signup";
      console.log("Sending request to:", requestUrl);
      console.log("Request Method: POST");

      const response = await fetch(requestUrl, {
        method: "POST",
        body: formData,
      });

      console.log("Response Status:", response.status);
      console.log("Response Headers:", JSON.stringify([...response.headers], null, 2));

      const data = await response.json();
      console.log("Response Data:", JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log("Signup successful");
        Alert.alert("Success", "Account created successfully!", [
          { 
            text: "OK", 
            onPress: () => {
              console.log("Navigating to LoginScreen");
              hidePopupWithAnimation();
              navigation.navigate("LoginScreen");
            }
          },
        ]);
      } else {
        console.log("Server Error Response:", data);
        if (data.errors) {
          const errorMessages = data.errors.map(err => err.msg).join("\n");
          Alert.alert("Validation Error", errorMessages);
        } else {
          Alert.alert("Error", data.error || "Something went wrong.");
        }
      }
    } catch (error) {
      console.error("Network Error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      Alert.alert("Error", `Network error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.innerContainer}
      >
        <Image source={require("../assets/images/user2.png")} style={styles.profileImage} />
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create an account to get started!</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your name" 
            placeholderTextColor="#999"
            value={name} 
            onChangeText={setName} 
          />

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

          <Text style={styles.label}>Address</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your address" 
            placeholderTextColor="#999"
            value={address} 
            onChangeText={setAddress} 
          />

          <Text style={styles.label}>Email (Optional)</Text>
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

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Confirm your password" 
            secureTextEntry 
            placeholderTextColor="#999" 
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
          />

          <TouchableOpacity style={styles.button} onPress={showPopupWithAnimation}>
            <Text style={styles.buttonText}>NEXT</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Already have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate("LoginScreen")}>Sign In</Text>
          </Text>
          <Text style={styles.signupText}>
            Header screen? <Text style={styles.signupLink} onPress={() => navigation.navigate("HeaderScreen")}>Click</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Image source={require("../assets/images/img3.jpeg")} style={styles.bottomImage} />

      {showPopup && (
        <Animated.View 
          style={[
            styles.popupContainer, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.popup}>
            <ScrollView 
              contentContainerStyle={styles.popupScrollContainer} 
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>Additional Details</Text>
              <Text style={styles.subtitle}>Please provide these details</Text>

              <Text style={styles.label}>Gender</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Male, Female, or Other" 
                placeholderTextColor="#999"
                value={gender} 
                onChangeText={setGender} 
              />

              <Text style={styles.label}>Age</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your age" 
                keyboardType="numeric" 
                placeholderTextColor="#999"
                value={age} 
                onChangeText={setAge} 
              />

              <Text style={styles.label}>IFSC Code</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your bank IFSC code" 
                placeholderTextColor="#999"
                value={ifscCode} 
                onChangeText={setIfscCode} 
              />

              <Text style={styles.label}>Aadhaar Card Image (Optional)</Text>
              {!aadhaarImage ? (
                <TouchableOpacity style={styles.imageBox} onPress={handleAadhaarImageUpload}>
                  <Text style={styles.plusSign}>+</Text>
                </TouchableOpacity>
              ) : (
                <Image 
                  source={{ uri: aadhaarImage.uri }} 
                  style={styles.uploadedImage} 
                />
              )}

              <Text style={styles.label}>Your Photo (Optional)</Text>
              {!userPhoto ? (
                <TouchableOpacity style={styles.imageBox} onPress={handleUserPhotoUpload}>
                  <Text style={styles.plusSign}>+</Text>
                </TouchableOpacity>
              ) : (
                <Image 
                  source={{ uri: userPhoto.uri }} 
                  style={styles.uploadedImage} 
                />
              )}

              <TouchableOpacity style={styles.button} onPress={handleFinalSignup}>
                <Text style={styles.buttonText}>SIGN UP</Text>
              </TouchableOpacity>

              <Text style={styles.signupText}>
                <Text style={styles.signupLink} onPress={hidePopupWithAnimation}>Close</Text>
              </Text>
              <Text style={styles.signupText}>
                Already have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate("LoginScreen")}>Sign In</Text>
              </Text>
            </ScrollView>
          </View>
        </Animated.View>
      )}
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
  signupText: { marginTop: 15, color: "#666", textAlign: "center" },
  signupLink: { color: "#fd7e14", fontWeight: "bold" },
  bottomImage: { 
    position: "absolute", 
    bottom: 0, 
    width: "100%", 
    height: 100, 
    resizeMode: "cover", 
    zIndex: 0 
  },
  profileImage: { width: 150, height: 150, borderRadius: 40, alignSelf: "center", marginTop: 30 },
  popupContainer: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "flex-end",
    zIndex: 10 
  },
  popup: { 
    backgroundColor: "#fff", 
    paddingHorizontal: 20, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    alignItems: "center", 
    minHeight: "50%", 
    maxHeight: "70%", 
  },
  popupScrollContainer: { 
    paddingVertical: 20, 
    alignItems: "center", 
    flexGrow: 1 
  },
  imageBox: { 
    width: 100, 
    height: 100, 
    backgroundColor: "#ddd", 
    borderRadius: 10, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 10 
  },
  plusSign: { 
    fontSize: 40, 
    color: "#444", 
    fontWeight: "bold" 
  },
  uploadedImage: { 
    width: 150, 
    height: 100, 
    borderRadius: 10, 
    marginBottom: 10 
  },
});