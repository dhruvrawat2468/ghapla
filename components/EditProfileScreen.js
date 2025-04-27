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

const EditProfileScreen = ({ navigation }) => {
  const { userToken, userProfile, setUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    gender: "",
    address: "",
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
        address: userProfile.address?.[0]?.address || "",
        landmark: userProfile.address?.[0]?.landmark || "",
        pincode: userProfile.address?.[0]?.pincode || "",
        houseNumber: userProfile.address?.[0]?.houseNumber || "",
        city: userProfile.address?.[0]?.city || "",
        age: userProfile.age ? userProfile.age.toString() : "",
      });
    }
    setLoading(false);
  }, [userProfile]);

  const isFormValid = () => {
    return (
      updatedData.name.trim() !== "" &&
      updatedData.email.includes("@") &&
      updatedData.gender.trim() !== "" &&
      updatedData.address.trim() !== "" &&
      updatedData.houseNumber.trim() !== "" &&
      updatedData.city.trim() !== "" &&
      updatedData.pincode.trim().length === 6 &&
      !isNaN(updatedData.age) &&
      parseInt(updatedData.age) > 0
    );
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const payload = {
        name: updatedData.name,
        email: updatedData.email,
        gender: updatedData.gender,
        address: [
          {
            address: updatedData.address,
            landmark: updatedData.landmark,
            pincode: updatedData.pincode,
            houseNumber: updatedData.houseNumber,
            city: updatedData.city,
          },
        ],
        age: parseInt(updatedData.age),
      };

      const response = await axios.put(
        "http://192.168.1.8:7000/api/other/profile/edit",
        payload,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      Alert.alert("Success", "Profile updated successfully!");
      setUserProfile(response.data.user);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Animated.Text entering={FadeIn} style={styles.loadingText}>
          Loading Profile...
        </Animated.Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personal Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {["name", "email", "gender", "age"].map((field) => (
            <View key={field} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {["name", "email", "gender", "age"].includes(field) && (
                  <Text style={styles.required}> *</Text>
                )}
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter ${field}`}
                  placeholderTextColor="#999"
                  value={updatedData[field]}
                  onChangeText={(text) =>
                    setUpdatedData({
                      ...updatedData,
                      [field]:
                        field === "age" ? text.replace(/[^0-9]/g, "") : text,
                    })
                  }
                  keyboardType={
                    field === "email"
                      ? "email-address"
                      : field === "age"
                      ? "numeric"
                      : "default"
                  }
                />
                <Ionicons
                  name={
                    field === "name"
                      ? "person-outline"
                      : field === "email"
                      ? "mail-outline"
                      : field === "gender"
                      ? "transgender-outline"
                      : "calendar-outline"
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
          disabled={!isFormValid() || saving}
        >
          <Animated.View
            style={[
              styles.saveButton,
              saveAnimatedStyle,
              isFormValid() ? styles.enabledButton : styles.disabledButton,
            ]}
          >
            <LinearGradient
              colors={
                isFormValid() ? ["#FF8C00", "#FF6B00"] : ["#CCCCCC", "#999999"]
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
