import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import { TechnicianContext } from "../context/TechnicianContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const TechnicianProfileScreen = () => {
  const { technician, setTechnician } = useContext(TechnicianContext);
  const [isAdmin] = React.useState(false);
  const [showOrdersSection] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (
      technician.overallStatus === "Verified" &&
      (!technician.aadhaarVerified ||
        !technician.bankVerified ||
        !technician.identityVerified ||
        !technician.panVerified)
    ) {
      setTechnician({
        ...technician,
        aadhaarVerified: true,
        bankVerified: true,
        identityVerified: true,
        panVerified: true,
      });
    }
  }, [technician.overallStatus]);

  const handleVerifyDocuments = () => {
    Alert.alert(
      "Verify Documents",
      "Are you sure all documents are valid and you want to verify this technician?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Verify",
          onPress: () => {
            setTechnician({
              ...technician,
              aadhaarVerified: true,
              bankVerified: true,
              identityVerified: true,
              panVerified: true,
              overallStatus: "Verified",
            });
            Alert.alert(
              "Success",
              "Technician has been verified and appointed!"
            );
          },
        },
      ]
    );
  };

  const renderVerificationBadge = (verified) => {
    // Use the actual verification status, don't override based on overallStatus
    const isVerified = verified;

    return (
      <View
        style={[
          styles.verificationBadge,
          { backgroundColor: isVerified ? "#4CAF50" : "#F44336" },
        ]}
      >
        <Text style={styles.verificationText}>
          {isVerified ? "Verified" : "Not Verified"}
        </Text>
        {isVerified ? (
          <MaterialIcons name="verified" size={16} color="white" />
        ) : (
          <Feather name="alert-circle" size={16} color="white" />
        )}
      </View>
    );
  };

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Create a timeout promise
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );

      // Call the logout API
      await Promise.race([
        fetch("http://192.168.1.13:7000/auth/technician/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        timeout
      ]);

      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem('technicianToken');

      // Use the handleLogout function from the context if available
      if (technician.handleLogout) {
        technician.handleLogout();
      }
    } catch (error) {
      console.error("Logout error:", error);

      // Even if the API call fails, still clear the token and trigger logout
      await AsyncStorage.removeItem('technicianToken');

      // Use the handleLogout function from the context if available
      if (technician.handleLogout) {
        technician.handleLogout();
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: technician.profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{technician.name}</Text>
        <Text style={styles.email}>{technician.email}</Text>
        <Text style={styles.status}>
          Status:
          <Text
            style={[
              styles.statusText,
              technician.overallStatus === "verified" && { color: "#4CAF50" },
              technician.overallStatus === "not verified" && {
                color: "#FF9800",
              },
              technician.overallStatus === "rejected" && { color: "#F44336" },
            ]}
          >
            {` ${technician.overallStatus === "verified" ? "Verified" :
                technician.overallStatus === "not verified" ? "Not Verified" :
                technician.overallStatus === "rejected" ? "Rejected" :
                technician.overallStatus}`}
          </Text>
        </Text>
      </View>
      {/* This section is now handled in the verification status section */}
      {/* Personal Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{technician.age} years</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{technician.gender}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Mobile:</Text>
          <Text style={styles.infoValue}>{technician.mobile}</Text>
        </View>
      </View>
      {/* Bank Account Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Account Details</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Account Number:</Text>
          <Text style={styles.infoValue}>{technician.accountNumber}</Text>
          {renderVerificationBadge(technician.bankVerified)}
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Bank Name:</Text>
          <Text style={styles.infoValue}>{technician.bankName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>IFSC Code:</Text>
          <Text style={styles.infoValue}>{technician.ifscCode}</Text>
        </View>
      </View>
      {/* Identity Verification Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identity Verification</Text>

        {/* Aadhaar Details */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Aadhaar Number:</Text>
          <Text style={styles.infoValue}>{technician.aadhaarNumber}</Text>
          {renderVerificationBadge(technician.aadhaarVerified)}
        </View>

        <TouchableOpacity
          style={styles.documentPreview}
          onPress={() => openImageModal(technician.aadhaarFrontImage)}
        >
          {technician.aadhaarFrontImage ? (
            <Image
              source={{ uri: technician.aadhaarFrontImage }}
              style={styles.documentImage}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome name="id-card" size={24} color="#555" />
          )}
          <Text style={styles.documentText}>Aadhaar Front</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.documentPreview}
          onPress={() => openImageModal(technician.aadhaarBackImage)}
        >
          {technician.aadhaarBackImage ? (
            <Image
              source={{ uri: technician.aadhaarBackImage }}
              style={styles.documentImage}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome name="id-card" size={24} color="#555" />
          )}
          <Text style={styles.documentText}>Aadhaar Back</Text>
        </TouchableOpacity>

        {/* PAN Card Details */}
        <View style={[styles.infoItem, { marginTop: 16 }]}>
          <Text style={styles.infoLabel}>PAN Number:</Text>
          <Text style={styles.infoValue}>{technician.panNumber}</Text>
          {renderVerificationBadge(technician.panVerified)}
        </View>

        <TouchableOpacity
          style={styles.documentPreview}
          onPress={() => openImageModal(technician.panCardImage)}
        >
          {technician.panCardImage ? (
            <Image
              source={{ uri: technician.panCardImage }}
              style={styles.documentImage}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome name="id-card" size={24} color="#555" />
          )}
          <Text style={styles.documentText}>PAN Card</Text>
        </TouchableOpacity>
      </View>
      {/* Only show verify button if isAdmin is true */}
      {isAdmin && technician.overallStatus !== "Verified" && (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyDocuments}
        >
          <Text style={styles.verifyButtonText}>
            Verify & Appoint Technician
          </Text>
        </TouchableOpacity>
      )}
      {technician.overallStatus === "verified" && (
        <View style={styles.successBox}>
          <MaterialIcons name="verified" size={24} color="#4CAF50" />
          <Text style={styles.successText}>
            {isAdmin
              ? "Technician is verified and appointed"
              : "Your profile has been verified"}
          </Text>
        </View>
      )}

      {technician.overallStatus === "not verified" && (
        <View style={styles.pendingVerificationBox}>
          <Feather name="alert-triangle" size={24} color="#FF9800" />
          <Text style={styles.pendingVerificationText}>
            Your profile is not verified yet. You won't be able to see or
            accept any orders until your profile is verified by our team.
          </Text>
          <Text style={styles.contactSupportText}>
            For any queries, please contact support.
          </Text>
        </View>
      )}
      {/* Conditionally render orders section only if verified */}
      {technician.overallStatus === "verified" && showOrdersSection && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Orders</Text>
          <Text>Orders will appear here once you're verified</Text>
        </View>
      )}

      {/* Update Profile Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => Alert.alert(
            "Update Profile",
            "This feature will allow you to update your profile details. Coming soon!",
            [{ text: "OK" }]
          )}
        >
          <MaterialIcons name="edit" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="logout" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </Pressable>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullSizeImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
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
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: "#666",
  },
  statusText: {
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#575757",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#565656",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#565656",
    flex: 1,
    textAlign: "right",
    marginRight: 8,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    color: "white",
    fontSize: 12,
    marginRight: 4,
  },
  documentPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  documentImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  documentText: {
    marginLeft: 12,
    color: "#555",
  },
  verifyButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
  },
  successText: {
    color: "#4CAF50",
    marginLeft: 12,
    fontWeight: "500",
  },
  pendingVerificationBox: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  pendingVerificationText: {
    color: "#E65100",
    marginTop: 10,
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  contactSupportText: {
    color: "#E65100",
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 14,
    fontStyle: "italic",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullSizeImage: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.7,
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: "#FF5252",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default TechnicianProfileScreen;
