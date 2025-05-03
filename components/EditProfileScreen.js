import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";

const EditProfileScreen = ({ navigation }) => {
  const { userToken, userProfile, setUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    gender: "",
    street: "",
    landmark: "",
    pincode: "",
    houseNumber: "",
    city: "",
    age: "",
  });

  useEffect(() => {
    if (userProfile) {
      setUpdatedData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        gender: userProfile.gender || "",
        street: userProfile.address?.[0]?.street || "",
        landmark: userProfile.address?.[0]?.landmark || "",
        pincode: userProfile.address?.[0]?.pincode || "",
        houseNumber: userProfile.address?.[0]?.houseNumber || "",
        city: userProfile.address?.[0]?.city || "",
        age: userProfile.age ? userProfile.age.toString() : "",
      });
    }
    setLoading(false);
  }, [userProfile]);

  const isChanged = () => {
    if (!userProfile) return false;
    return (
      updatedData.name !== (userProfile.name || "") ||
      updatedData.email !== (userProfile.email || "") ||
      updatedData.gender !== (userProfile.gender || "") ||
      updatedData.street !== (userProfile.address?.[0]?.street || "") ||
      updatedData.landmark !== (userProfile.address?.[0]?.landmark || "") ||
      updatedData.pincode !== (userProfile.address?.[0]?.pincode || "") ||
      updatedData.houseNumber !== (userProfile.address?.[0]?.houseNumber || "") ||
      updatedData.city !== (userProfile.address?.[0]?.city || "") ||
      updatedData.age !== (userProfile.age ? userProfile.age.toString() : "")
    );
  };

  const validate = () => {
    if (!updatedData.name) return "Name is required";
    if (!updatedData.email || !updatedData.email.includes("@")) return "Invalid email format";
    if (!["male", "female", "other"].includes(updatedData.gender)) return "Gender must be male, female, or other";
    if (!updatedData.street) return "Street is required";
    if (!updatedData.houseNumber) return "House number is required";
    if (!updatedData.city) return "City is required";
    if (!updatedData.pincode || !/^\d{6}$/.test(updatedData.pincode)) return "Pincode must be 6 digits";
    const ageNum = parseInt(updatedData.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) return "Age must be a number between 1 and 120";
    return null;
  };

  const handleSaveChanges = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert("Error", validationError);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: updatedData.name,
        email: updatedData.email,
        gender: updatedData.gender,
        address: [{
          street: updatedData.street,
          landmark: updatedData.landmark,
          pincode: updatedData.pincode,
          houseNumber: updatedData.houseNumber,
          city: updatedData.city,
        }],
        age: parseInt(updatedData.age),
      };
      console.log("Sending payload:", payload);
      const response = await axios.put(
        "http://192.168.1.6:7000/api/other/profile/edit",
        payload,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      Alert.alert("Success", response.data.message);
      setUserProfile(response.data.user);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      let errorMessage = "Failed to update profile. Server error occurred.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (errorMessage.includes("duplicate key error") && errorMessage.includes("email")) {
          errorMessage = "This email is already in use. Please use a different email.";
        }
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)
          .map(err => err.message)
          .join("\n");
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const saveScale = useSharedValue(1);
  const saveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const handlePressIn = () => {
    saveScale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
  };

  const handlePressOut = () => {
    saveScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

  if (loading) {
    return (
      <LinearGradient colors={["#FFE0B2", "#F5F5F5"]} style={styles.loadingContainer}>
        <Animated.View entering={FadeIn}>
          <ActivityIndicator size="large" color="#FF4500" />
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#FFE0B2", "#F5F5F5"]} style={styles.gradientContainer}>
      <StatusBar backgroundColor="#FFE0B2" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(200)}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FF4500" />
          </TouchableOpacity>

          <Text style={styles.header}>Edit Profile</Text>

          {/* Personal Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {["name", "email"].map((field) => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <Text style={styles.required}> *</Text>
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder={`Enter ${field}`}
                    placeholderTextColor="#999"
                    value={updatedData[field]}
                    onChangeText={(text) =>
                      setUpdatedData({ ...updatedData, [field]: text.trimStart() })
                    }
                    keyboardType={field === "email" ? "email-address" : "default"}
                  />
                  <Ionicons
                    name={field === "name" ? "person-outline" : "mail-outline"}
                    size={20}
                    color="#FF8C00"
                    style={styles.inputIcon}
                  />
                </View>
              </View>
            ))}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Gender<Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <Picker
                  selectedValue={updatedData.gender}
                  onValueChange={(value) =>
                    setUpdatedData({ ...updatedData, gender: value })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
                <Ionicons
                  name="transgender-outline"
                  size={20}
                  color="#FF8C00"
                  style={styles.inputIcon}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Age<Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter age"
                  placeholderTextColor="#999"
                  value={updatedData.age}
                  onChangeText={(text) =>
                    setUpdatedData({ ...updatedData, age: text.replace(/[^0-9]/g, "") })
                  }
                  keyboardType="numeric"
                />
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#FF8C00"
                  style={styles.inputIcon}
                />
              </View>
            </View>
          </View>

          {/* Address Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Information</Text>
            {["houseNumber", "street", "landmark", "city", "pincode"].map((field) => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {field === "houseNumber"
                    ? "House Number"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                  {field !== "landmark" && <Text style={styles.required}> *</Text>}
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder={`Enter ${field === "houseNumber" ? "house number" : field}`}
                    placeholderTextColor="#999"
                    value={updatedData[field]}
                    onChangeText={(text) =>
                      setUpdatedData({
                        ...updatedData,
                        [field]: field === "pincode" ? text.replace(/[^0-9]/g, "") : text.trimStart(),
                      })
                    }
                    keyboardType={field === "pincode" ? "numeric" : "default"}
                  />
                  <Ionicons
                    name={
                      field === "street"
                        ? "location-outline"
                        : field === "landmark"
                        ? "pin-outline"
                        : field === "pincode"
                        ? "keypad-outline"
                        : field === "houseNumber"
                        ? "home-outline"
                        : "business-outline"
                    }
                    size={20}
                    color="#FF8C00"
                    style={styles.inputIcon}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSaveChanges}
            activeOpacity={0.9}
            disabled={!isChanged() || saving}
          >
            <Animated.View
              style={[
                styles.saveButton,
                saveAnimatedStyle,
                isChanged() ? styles.enabledButton : styles.disabledButton,
              ]}
            >
              <LinearGradient
                colors={
                  isChanged() ? ["#FF8C00", "#FF6B00"] : ["#CCCCCC", "#999999"]
                }
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  backButton: {
    marginBottom: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#333",
    textAlign: "center",
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF8C00",
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE5CC",
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  required: {
    color: "red",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  picker: {
    flex: 1,
    height: 44,
    backgroundColor: "#F8F8F8",
  },
  inputIcon: {
    marginLeft: 10,
  },
  saveButton: {
    borderRadius: 12,
    marginTop: 20,
    overflow: "hidden",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 30,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  enabledButton: {
    opacity: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default EditProfileScreen;