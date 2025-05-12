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
  Animated,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [technicianType, setTechnicianType] = useState("inhouse"); // Default to inhouse

  // Additional form fields
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  const navigation = useNavigation();

  // Validation functions
  const validateInitial = () => {
    if (!name || !mobile || !address || !password) {
      Alert.alert("Error", "Name, mobile, address, and password are required.");
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
    return true;
  };

  const validateAdditional = () => {
    if (
      !gender ||
      !age ||
      !ifscCode ||
      !panNumber ||
      !aadhaarImage ||
      !panImage ||
      !userPhoto
    ) {
      Alert.alert("Error", "All additional fields are required.");
      return false;
    }
    if (isNaN(age) || age < 1 || age > 120) {
      Alert.alert("Error", "Enter a valid age between 1 and 120.");
      return false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      Alert.alert("Error", "Enter a valid IFSC code (e.g., SBIN0001234).");
      return false;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      Alert.alert("Error", "Enter a valid PAN number (e.g., ABCDE1234F).");
      return false;
    }
    return true;
  };

  // Animation functions
  const showPopupWithAnimation = () => {
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
      ]).start();
    }
  };

  const hidePopupWithAnimation = () => {
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
    ]).start(() => setShowPopup(false));
  };

  // Image upload functions
  const handleImageUpload = async (setImageFunction) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need gallery permissions to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFunction(result.assets[0]);
    }
  };

  // Final signup handler
  const handleFinalSignup = async () => {
    if (!validateAdditional()) return;

    setLoading(true);
    try {
      // First, upload images and get their IDs
      let aadhaarImageId = null;
      let userPhotoId = null;

      // Upload aadhaar image
      if (aadhaarImage) {
        const aadhaarFormData = new FormData();
        aadhaarFormData.append("file", {
          uri: aadhaarImage.uri,
          type: aadhaarImage.type || "image/jpeg",
          name: aadhaarImage.fileName || "aadhaar.jpg",
        });

        // Create a timeout promise
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 10000)
        );

        // Race the fetch against the timeout
        const aadhaarResponse = await Promise.race([
          fetch("http://192.168.1.13:7000/api/image/upload", {
            method: "POST",
            body: aadhaarFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }),
          timeout
        ]);

        if (!aadhaarResponse.ok) {
          throw new Error("Failed to upload Aadhaar image");
        }

        const aadhaarData = await aadhaarResponse.json();
        aadhaarImageId = aadhaarData.image._id;
      }

      // Upload user photo
      if (userPhoto) {
        const userPhotoFormData = new FormData();
        userPhotoFormData.append("file", {
          uri: userPhoto.uri,
          type: userPhoto.type || "image/jpeg",
          name: userPhoto.fileName || "profile.jpg",
        });

        // Create a timeout promise
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 10000)
        );

        // Race the fetch against the timeout
        const userPhotoResponse = await Promise.race([
          fetch("http://192.168.1.13:7000/api/image/upload", {
            method: "POST",
            body: userPhotoFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }),
          timeout
        ]);

        if (!userPhotoResponse.ok) {
          throw new Error("Failed to upload profile photo");
        }

        const userPhotoData = await userPhotoResponse.json();
        userPhotoId = userPhotoData.image._id;
      }

      // Now create the technician account
      const technicianData = {
        name,
        mobile,
        address,
        email,
        password,
        gender,
        age: parseInt(age),
        ifscCode,
        aadhaarImage: aadhaarImageId,
        userPhoto: userPhotoId,
        technicianType // Include the technician type
      };

      // Create a timeout promise
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );

      // Race the fetch against the timeout
      const response = await Promise.race([
        fetch("http://192.168.1.13:7000/auth/technician/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(technicianData),
        }),
        timeout
      ]);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            hidePopupWithAnimation();
            navigation.navigate("LoginScreen");
          },
        },
      ]);
    } catch (error) {
      console.error("Signup error:", error);

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

      Alert.alert("Error", errorMessage);
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
          {/* Basic Information Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="person-outline" size={24} color="#ff7f00" />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="person"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="phone"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor="#999"
                value={mobile}
                onChangeText={setMobile}
              />
            </View>

            <Text style={styles.label}>Address</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="location-on"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your complete address"
                placeholderTextColor="#999"
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>
          </View>

          {/* Account Information Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="email" size={24} color="#ff7f00" />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            <Text style={styles.label}>Email (Optional)</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="email"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
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
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Technician Type Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="work" size={24} color="#ff7f00" />
              <Text style={styles.sectionTitle}>Technician Type</Text>
            </View>

            <View style={styles.technicianTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.technicianTypeOption,
                  technicianType === 'local' && styles.technicianTypeSelected
                ]}
                onPress={() => setTechnicianType('local')}
              >
                <View style={[
                  styles.radioButton,
                  technicianType === 'local' && styles.radioButtonSelected
                ]}>
                  {technicianType === 'local' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.technicianTypeText}>Local Technician</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.technicianTypeOption,
                  technicianType === 'inhouse' && styles.technicianTypeSelected
                ]}
                onPress={() => setTechnicianType('inhouse')}
              >
                <View style={[
                  styles.radioButton,
                  technicianType === 'inhouse' && styles.radioButtonSelected
                ]}>
                  {technicianType === 'inhouse' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.technicianTypeText}>In-House Technician</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={showPopupWithAnimation}
          >
            <Text style={styles.buttonText}>CONTINUE TO VERIFICATION</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Already have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("LoginScreen")}
            >
              Sign In
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom decorative image */}
      <Image
        source={require("../assets/images/img3.jpeg")}
        style={styles.bottomImage}
      />

      {/* Verification Popup */}
      {showPopup && (
        <Animated.View
          style={[
            styles.popupContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.popup}>
            <ScrollView
              contentContainerStyle={styles.popupScrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.popupHeader}>
                <Text style={styles.popupTitle}>Verification Details</Text>
                <TouchableOpacity onPress={hidePopupWithAnimation}>
                  <Ionicons name="close" size={28} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Personal Details Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <FontAwesome name="user-circle-o" size={20} color="#ff7f00" />
                  <Text style={styles.sectionTitle}>Personal Details</Text>
                </View>

                <Text style={styles.label}>Gender</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="transgender"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Male/Female/Other"
                    placeholderTextColor="#999"
                    value={gender}
                    onChangeText={setGender}
                  />
                </View>

                <Text style={styles.label}>Age</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="birthday-cake"
                    size={18}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your age"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    value={age}
                    onChangeText={setAge}
                  />
                </View>
              </View>

              {/* Bank Details Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <FontAwesome name="bank" size={20} color="#ff7f00" />
                  <Text style={styles.sectionTitle}>Bank Details</Text>
                </View>

                <Text style={styles.label}>IFSC Code</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="payment"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Bank IFSC code (e.g. SBIN0001234)"
                    placeholderTextColor="#999"
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              {/* ID Verification Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons
                    name="verified-user"
                    size={24}
                    color="#ff7f00"
                  />
                  <Text style={styles.sectionTitle}>ID Verification</Text>
                </View>

                <Text style={styles.label}>PAN Number</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="credit-card"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="PAN number (e.g. ABCDE1234F)"
                    placeholderTextColor="#999"
                    value={panNumber}
                    onChangeText={setPanNumber}
                    autoCapitalize="characters"
                  />
                </View>

                <Text style={styles.label}>PAN Card Image</Text>
                <View style={styles.imageUploadContainer}>
                  {!panImage ? (
                    <TouchableOpacity
                      style={styles.imageUploadBox}
                      onPress={() => handleImageUpload(setPanImage)}
                    >
                      <MaterialIcons
                        name="add-a-photo"
                        size={28}
                        color="#ff7f00"
                      />
                      <Text style={styles.imageUploadText}>
                        Upload PAN Card
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.uploadedImageContainer}>
                      <Image
                        source={{ uri: panImage.uri }}
                        style={styles.uploadedImage}
                      />
                      <TouchableOpacity
                        style={styles.changeImageButton}
                        onPress={() => handleImageUpload(setPanImage)}
                      >
                        <Text style={styles.changeImageText}>Change</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <Text style={styles.label}>Aadhaar Card Image</Text>
                <View style={styles.imageUploadContainer}>
                  {!aadhaarImage ? (
                    <TouchableOpacity
                      style={styles.imageUploadBox}
                      onPress={() => handleImageUpload(setAadhaarImage)}
                    >
                      <MaterialIcons
                        name="add-a-photo"
                        size={28}
                        color="#ff7f00"
                      />
                      <Text style={styles.imageUploadText}>
                        Upload Aadhaar Card
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.uploadedImageContainer}>
                      <Image
                        source={{ uri: aadhaarImage.uri }}
                        style={styles.uploadedImage}
                      />
                      <TouchableOpacity
                        style={styles.changeImageButton}
                        onPress={() => handleImageUpload(setAadhaarImage)}
                      >
                        <Text style={styles.changeImageText}>Change</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <Text style={styles.label}>Your Photo</Text>
                <View style={styles.imageUploadContainer}>
                  {!userPhoto ? (
                    <TouchableOpacity
                      style={styles.imageUploadBox}
                      onPress={() => handleImageUpload(setUserPhoto)}
                    >
                      <MaterialIcons
                        name="add-a-photo"
                        size={28}
                        color="#ff7f00"
                      />
                      <Text style={styles.imageUploadText}>
                        Upload Your Photo
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.uploadedImageContainer}>
                      <Image
                        source={{ uri: userPhoto.uri }}
                        style={styles.uploadedImage}
                      />
                      <TouchableOpacity
                        style={styles.changeImageButton}
                        onPress={() => handleImageUpload(setUserPhoto)}
                      >
                        <Text style={styles.changeImageText}>Change</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleFinalSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>COMPLETE REGISTRATION</Text>
                )}
              </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  technicianTypeContainer: {
    marginTop: 10,
  },
  technicianTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  technicianTypeSelected: {
    borderColor: '#ff7f00',
    backgroundColor: '#FFF5E6',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: '#ff7f00',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff7f00',
  },
  technicianTypeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#ff7f00",
  },
  sectionContainer: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    marginTop: 5,
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
  button: {
    width: "100%",
    backgroundColor: "#ff7f00",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupText: {
    marginTop: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
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
  popupContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    zIndex: 10,
  },
  popup: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: "85%",
  },
  popupScrollContainer: {
    padding: 20,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  imageUploadContainer: {
    marginBottom: 20,
  },
  imageUploadBox: {
    height: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  imageUploadText: {
    marginTop: 8,
    color: "#ff7f00",
    fontWeight: "500",
  },
  uploadedImageContainer: {
    alignItems: "center",
  },
  uploadedImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
  },
  changeImageButton: {
    padding: 5,
  },
  changeImageText: {
    color: "#ff7f00",
    fontWeight: "500",
  },
});
