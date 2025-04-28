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
} from "react-native";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";
import { TechnicianContext } from "../context/TechnicianContext";

const TechnicianProfileScreen = () => {
  const { technician, setTechnician } = useContext(TechnicianContext);
  const [isAdmin] = React.useState(false);
  const [showOrdersSection] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    const isVerified =
      technician.overallStatus === "Verified" ? true : verified;

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

  return (
    <ScrollView style={styles.container}>
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
              technician.overallStatus === "Verified" && { color: "#4CAF50" },
              technician.overallStatus === "Pending Verification" && {
                color: "#FF9800",
              },
              technician.overallStatus === "Rejected" && { color: "#F44336" },
            ]}
          >
            {` ${technician.overallStatus}`}
          </Text>
        </Text>
      </View>

      {/* Show pending verification message if status is pending */}
      {technician.overallStatus === "Pending Verification" && !isAdmin && (
        <View style={styles.pendingVerificationBox}>
          <Feather name="alert-triangle" size={24} color="#FF9800" />
          <Text style={styles.pendingVerificationText}>
            Your profile is under verification. You won't be able to see or
            accept any orders until your profile is verified by our team.
          </Text>
          <Text style={styles.contactSupportText}>
            For any queries, please contact support.
          </Text>
        </View>
      )}

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

      {technician.overallStatus === "Verified" && (
        <View style={styles.successBox}>
          <MaterialIcons name="verified" size={24} color="#4CAF50" />
          <Text style={styles.successText}>
            {isAdmin
              ? "Technician is verified and appointed"
              : "Your profile has been verified"}
          </Text>
        </View>
      )}

      {/* Conditionally render orders section only if verified */}
      {technician.overallStatus === "Verified" && showOrdersSection && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Orders</Text>
          <Text>Orders will appear here once you're verified</Text>
        </View>
      )}

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
    color: "#FF9800",
    marginTop: 8,
    marginBottom: 8,
  },
  contactSupportText: {
    color: "#FF9800",
    fontWeight: "bold",
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
});

export default TechnicianProfileScreen;
