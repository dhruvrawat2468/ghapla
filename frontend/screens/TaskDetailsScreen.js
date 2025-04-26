import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const TaskDetailScreen = ({ route }) => {
  const { task } = route.params;
  const [status, setStatus] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [repairEntries, setRepairEntries] = useState([{ whatRepaired: "", cost: "" }]);
  const navigation = useNavigation(); // Initialize navigation

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      task.address
    )}`;
    Linking.openURL(url);
  };

  const callCustomer = () => {
    Linking.openURL(`tel:${task.phone}`);
  };

  const statuses =
    task.serviceType === "Repair at Home"
      ? ["Technician Arrived", "Cost Verification", "Repaired", "Payment Done"]
      : [
          "Product Picked",
          "Cost Verification",
          "Repair in Progress",
          "Ready to Deliver",
          "Payment Done",
        ];

  const handleStatusUpdate = (newStatus) => {
    if (
      !status ||
      statuses.indexOf(newStatus) === statuses.indexOf(status) + 1
    ) {
      setStatus(newStatus);
      if (newStatus === "Cost Verification") {
        setModalVisible(true);
      } else {
        setModalVisible(true);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const addRepairEntry = () => {
    setRepairEntries([...repairEntries, { whatRepaired: "", cost: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const newEntries = [...repairEntries];
    newEntries[index][field] = value;
    setRepairEntries(newEntries);
  };

  const saveToMongoDB = async () => {
    const totalCost = repairEntries.reduce((sum, entry) => sum + (parseFloat(entry.cost) || 0), 0);
    const payload = {
      orderId: task.orderId,
      cost: totalCost,
      status: "Cost Verification",
      repairDetails: repairEntries,
    };
    console.log("Sending payload to server:", payload);

    try {
      const response = await fetch('http://192.168.29.44:3001/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Server response:", result);
      if (response.ok) {
        console.log("Cost updated successfully:", result);
        closeModal();
      } else {
        console.error("Failed to update cost:", result.message);
      }
    } catch (error) {
      console.error("Error saving to MongoDB:", error.message);
    }
  };

  // Function to navigate to TrackingStatusScreen
  const navigateToTrackingStatus = () => {
    navigation.navigate('TrackingStatus', { orderId: task.orderId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Image
              source={require("../assets/images/user2.png")}
              style={styles.avatar}
            />
            <Text style={styles.title}>{task.customer}</Text>
            <TouchableOpacity onPress={callCustomer}>
              <FontAwesome name="phone" size={24} color="#fd7e14" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#ff7f00" />
            <Text style={styles.text}>{task.address}</Text>
          </View>
        </Card.Content>
      </Card>
      <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
        <Text style={styles.buttonText}>📍 Navigate to Customer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.trackingButton} onPress={navigateToTrackingStatus}>
        <Text style={styles.buttonText}>🚚 View Tracking Status</Text>
      </TouchableOpacity>
      <Image
        source={require("../assets/images/di-Photoroom.png")}
        style={styles.imageDivider}
      />
      <Text style={styles.statusTitle}>Update Status</Text>
      {statuses.map((step, index) => (
        <Card
          key={step}
          style={[styles.statusCard, status === step && styles.activeCard]}
        >
          {status === step && (
            <View style={styles.statusIcon}>
              <MaterialIcons name="check-circle" size={24} color="#fff" />
            </View>
          )}
          <TouchableOpacity
            onPress={() => handleStatusUpdate(step)}
            disabled={
              status && statuses.indexOf(step) <= statuses.indexOf(status)
            }
          >
            <Text
              style={[
                styles.cardText,
                status &&
                  statuses.indexOf(step) <= statuses.indexOf(status) &&
                  styles.disabledText,
              ]}
            >
              {step}
            </Text>
          </TouchableOpacity>
        </Card>
      ))}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.costModalContainer}>
              {status === "Cost Verification" ? (
                <>
                  <Text style={styles.modalTitle}>Cost Verification</Text>
                  {repairEntries.map((entry, index) => (
                    <View key={index} style={styles.entryContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="What got repaired?"
                        placeholderTextColor="#000"
                        value={entry.whatRepaired}
                        onChangeText={(text) => handleInputChange(index, "whatRepaired", text)}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Cost ($)"
                        placeholderTextColor="#000"
                        value={entry.cost}
                        onChangeText={(text) => handleInputChange(index, "cost", text)}
                        keyboardType="numeric"
                      />
                      {index < repairEntries.length - 1 && (
                        <View style={styles.separator} />
                      )}
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addButton} onPress={addRepairEntry}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={saveToMongoDB}>
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.modalContainer}>
                  <Text style={styles.modalText}>Status Updated to: {status}</Text>
                  <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                    <Text style={styles.modalButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff5e6" },
  card: {
    marginTop: 30,
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  title: { marginRight: 70, fontSize: 24, fontWeight: "700", color: "#565656" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  text: { fontSize: 18, marginLeft: 5, color: "#565656" },
  mapButton: {
    backgroundColor: "#ff7f00",
    padding: 15,
    borderRadius: 12,
    marginVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  trackingButton: {
    backgroundColor: "#2196F3", // Blue for tracking
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#565656",
  },
  statusCard: {
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: { marginRight: 15 },
  activeCard: {
    backgroundColor: "#ff7f00",
    borderColor: "#e68a00",
    elevation: 6,
  },
  cardText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#565656",
  },
  disabledText: { color: "#aaa" },
  buttonText: { color: "#fff", fontWeight: "700" },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  costModalContainer: {
    backgroundColor: "#fff5e6",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    width: "85%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderColor: "#ff7f00",
    borderWidth: 2,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  modalButton: {
    backgroundColor: "#ff7f00",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  entryContainer: { width: "100%", marginBottom: 15 },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff7f00",
    width: "100%",
    height: 60,
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addButton: {
    backgroundColor: "#ff7f00",
    padding: 12,
    borderRadius: 50,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  separator: {
    height: 1,
    backgroundColor: "#ff7f00",
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
  },
  imageDivider: { width: "100%", height: 90, marginVertical: 20 },
});

export default TaskDetailScreen;