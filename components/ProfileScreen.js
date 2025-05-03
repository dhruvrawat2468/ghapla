import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const { userToken, logout, userProfile, setUserProfile } = useContext(AuthContext);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Animation values
  const cardOffsetY = useSharedValue(-50);
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardOffsetY.value }],
  }));

  const profileScale = useSharedValue(1);
  const profileAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: profileScale.value }],
  }));

  const editScale = useSharedValue(1);
  const logoutScale = useSharedValue(1);

  const editAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: editScale.value }],
  }));

  const logoutAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoutScale.value }],
  }));

  useEffect(() => {
    const fetchProfile = async () => {
      // If userProfile already exists, skip the API call
      if (userProfile) {
        setLoading(false);
        return;
      }

      // If no userToken, skip the API call
      if (!userToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://192.168.1.6:7000/api/other/profile", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    cardOffsetY.value = withSpring(0, { damping: 15, stiffness: 100, mass: 1 });
  }, [userToken, userProfile, setUserProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("OtpLogin");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const handleProfilePressIn = () => {
    profileScale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
    setIsOverlayVisible(true);
  };

  const handleProfilePressOut = () => {
    profileScale.value = withSpring(1, { damping: 10, stiffness: 100 });
    setTimeout(() => setIsOverlayVisible(false), 200);
  };

  const handleProfileTap = () => {
    console.log("Profile image tapped! Implement photo upload here.");
  };

  const handlePressIn = (scale) => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
  };

  const handlePressOut = (scale) => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

  // Use default image since profileImage is not in schema
  const profileImage = "https://randomuser.me/api/portraits/men/32.jpg";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FD7E14" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <Animated.View style={[styles.header, cardAnimatedStyle]}>
        <TouchableOpacity
          onPressIn={handleProfilePressIn}
          onPressOut={handleProfilePressOut}
          onPress={handleProfileTap}
          activeOpacity={1}
        >
          <Animated.View style={profileAnimatedStyle}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            {isOverlayVisible && (
              <Animated.View entering={FadeIn} style={styles.overlay}>
                <Ionicons name="camera" size={30} color="#fff" />
              </Animated.View>
            )}
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.name}>{userProfile.name || "User Name"}</Text>
        <View style={styles.emailContainer}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.email}>{userProfile.email || "No email provided"}</Text>
        </View>
      </Animated.View>

      {/* Personal Information Section */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="account-details"
            size={20}
            color="#FD7E14"
          />
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setIsInfoExpanded(!isInfoExpanded)}
          >
            <Ionicons
              name={isInfoExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#FD7E14"
            />
          </TouchableOpacity>
        </View>

        {isInfoExpanded && (
          <>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="calendar-today" size={20} color="#FD7E14" />
                <Text style={styles.infoLabel}>Age</Text>
              </View>
              <Text style={styles.infoValue}>{userProfile.age || "Not provided"}</Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="gender-male-female"
                  size={20}
                  color="#FD7E14"
                />
                <Text style={styles.infoLabel}>Gender</Text>
              </View>
              <Text style={styles.infoValue}>
                {userProfile.gender ? userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1) : "Not provided"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Feather name="phone" size={20} color="#FD7E14" />
                <Text style={styles.infoLabel}>Mobile</Text>
              </View>
              <Text style={styles.infoValue}>{userProfile.mobile || "Not provided"}</Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="work" size={20} color="#FD7E14" />
                <Text style={styles.infoLabel}>Role</Text>
              </View>
              <Text style={styles.infoValue}>
                {userProfile.role ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : "Not provided"}
              </Text>
            </View>
          </>
        )}
      </Animated.View>

      {/* Address Section */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Entypo name="address" size={20} color="#FD7E14" />
          <Text style={styles.sectionTitle}>Address</Text>
        </View>

        {userProfile.address && userProfile.address.length > 0 ? (
          <>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="home" size={20} color="#FD7E14" />
                <Text style={styles.infoLabel}>House Number</Text>
              </View>
              <Text style={styles.infoValue}>{userProfile.address[0].houseNumber || "Not provided"}</Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="map" size={20} color="#FD7E14" />
                <Text style={styles.infoLabel}>Street</Text>
              </View>
              <Text style={styles.infoValue}>{userProfile.address[0].street || "Not provided"}</Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="location-on" size={20} color="#FD7E14" />
                <Text style={styles.infoLabel}>Landmark</Text>
              </View>
              <Text style={styles.infoValue}>{userProfile.address[0].landmark || "Not provided"}</Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="location-city" size={20} color="#FD7E14" />
                <Text style={styles.infoLabel}>City</Text>
              </View>
              <Text style={styles.infoValue}>{userProfile.address[0].city || "Not provided"}</Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="markunread-mailbox" size={20} color="#FD7E14" />
                <Text style={styles.infoLabel}>Pincode</Text>
              </View>
              <Text style={styles.infoValue}>{userProfile.address[0].pincode || "Not provided"}</Text>
            </View>
          </>
        ) : (
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>No address provided</Text>
          </View>
        )}
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPressIn={() => handlePressIn(editScale)}
          onPressOut={() => handlePressOut(editScale)}
          onPress={() => navigation.navigate("EditProfile", { user: userProfile })}
        >
          <Animated.View style={[styles.buttonContent, editAnimatedStyle]}>
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPressIn={() => handlePressIn(logoutScale)}
          onPressOut={() => handlePressOut(logoutScale)}
          onPress={handleLogout}
        >
          <Animated.View style={[styles.buttonContent, logoutAnimatedStyle]}>
            <MaterialIcons name="logout" size={20} color="#fff" />
            <Text style={styles.buttonText}>Logout</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom padding */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  overlay: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  expandButton: {
    marginLeft: "auto",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
  },
  infoIcon: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: "#575757",
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "right",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#FD7E14",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: "#FD7E14",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#FD7E14",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    shadowColor: "#FD7E14",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProfileScreen;