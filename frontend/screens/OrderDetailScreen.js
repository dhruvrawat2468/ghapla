import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Mock data
const sampleImage1 = require("../assets/images/image.png");
const sampleImage2 = require("../assets/images/image.png");

const { width } = Dimensions.get("window");

const TaskDetailsScreen = ({ route }) => {
  const { task } = route.params;
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const images = [sampleImage1, sampleImage2];

  const handleAccept = () => {
    navigation.navigate("TaskDetailScreen", { task });
  };

  const handleDecline = () => {
    alert("Task Declined");
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Repair Details</Text>
            <View style={[styles.statusBadge, { backgroundColor: "#fff4e6" }]}>
              <Text style={[styles.statusText, { color: "#fd7e14" }]}>New</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#fd7e14" />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Customer: </Text>
              {task.customer}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="phone-portrait-outline" size={20} color="#fd7e14" />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Device: </Text>
              {task.device} ({task.brand})
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="alert-circle-outline" size={20} color="#fd7e14" />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Issue: </Text>
              {task.issue}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#fd7e14" />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Schedule: </Text>
              {task.date} | {task.timeSlot}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="images-outline" size={24} color="#fd7e14" />
            <Text style={styles.sectionTitle}>Uploaded Images</Text>
          </View>
          <FlatList
            data={images}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => openImageModal(item)}
                style={styles.imageContainer}
              >
                <Image source={item} style={styles.image} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="expand-outline" size={24} color="white" />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={handleDecline}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={handleAccept}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        onRequestClose={closeImageModal}
      >
        <TouchableWithoutFeedback onPress={closeImageModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image source={selectedImage} style={styles.fullImage} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeImageModal}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    marginTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  detailText: {
    fontSize: 15,
    marginLeft: 12,
    color: "#495057",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "600",
    color: "#212529",
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#212529",
    marginLeft: 10,
  },
  imageList: {
    paddingLeft: 0,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    alignItems: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f1f3f5",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#2b8a3e",
    marginLeft: 8,
  },
  declineButton: {
    backgroundColor: "#c92a2a",
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
});

export default TaskDetailsScreen;
