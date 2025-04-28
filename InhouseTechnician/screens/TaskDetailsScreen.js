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
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Card } from "react-native-paper";

const TaskDetailScreen = ({ route }) => {
  const { task } = route.params;
  const [status, setStatus] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCostModalVisible, setCostModalVisible] = useState(false);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [repairCases, setRepairCases] = useState([
    {
      issueDiagnosed: "",
      partsReplaced: "",
      estimatedCost: "",
    },
  ]);

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      task.address
    )}`;
    Linking.openURL(url);
  };

  const callCustomer = () => {
    Linking.openURL(`tel:${task.phone}`);
  };

  // Determine status flow based on service type
  const statuses =
    task.serviceType === "Home Repair"
      ? ["Technician Arrived", "Cost Verification", "Repaired", "Payment Done"]
      : [
          "Product Picked",
          "Cost Verification",
          "Repair in Progress",
          "Ready to Deliver",
          "Payment Done",
        ];

  const handleStatusUpdate = (newStatus) => {
    setPendingStatus(newStatus);

    if (newStatus === "Cost Verification") {
      setCostModalVisible(true);
    } else {
      // Show confirmation dialog for all other status updates
      setConfirmationModalVisible(true);
    }
  };

  const confirmStatusUpdate = () => {
    setStatus(pendingStatus);
    setModalVisible(true);
    setConfirmationModalVisible(false);
  };

  const calculateFinalCost = (cost) => {
    const baseCost = parseFloat(cost);
    if (isNaN(baseCost)) return 0;

    let hikePercentage = 0;
    if (baseCost <= 2000) {
      hikePercentage = 50;
    } else if (baseCost <= 5000) {
      hikePercentage = 30;
    } else if (baseCost <= 10000) {
      hikePercentage = 20;
    } else {
      hikePercentage = 12;
    }

    return baseCost + (baseCost * hikePercentage) / 100;
  };

  const handleCostSubmit = () => {
    // Validate all repair cases
    for (const caseItem of repairCases) {
      if (!caseItem.issueDiagnosed) {
        Alert.alert("Required Field", "Please describe the diagnosed issue");
        return;
      }
      if (
        !caseItem.estimatedCost ||
        isNaN(parseFloat(caseItem.estimatedCost))
      ) {
        Alert.alert("Invalid Cost", "Please enter a valid cost amount");
        return;
      }
    }

    // Calculate total final cost
    const totalFinalCost = repairCases.reduce((total, caseItem) => {
      return total + calculateFinalCost(caseItem.estimatedCost);
    }, 0);

    // Here you would typically send this to your backend
    // to update the customer portal

    setStatus("Cost Verification");
    setModalVisible(true);
    setCostModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const addNewRepairCase = () => {
    setRepairCases([
      ...repairCases,
      {
        issueDiagnosed: "",
        partsReplaced: "",
        estimatedCost: "",
      },
    ]);
  };

  const updateRepairCase = (index, field, value) => {
    const newCases = [...repairCases];
    newCases[index][field] = value;
    setRepairCases(newCases);
  };

  const getTotalFinalCost = () => {
    return repairCases.reduce((total, caseItem) => {
      return total + calculateFinalCost(caseItem.estimatedCost);
    }, 0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Customer Info Card */}
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

      {/* Navigation Button */}
      <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
        <Text style={styles.buttonText}>📍 Navigate to Customer</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Image
        source={require("../assets/images/di-Photoroom.png")}
        style={styles.imageDivider}
      />

      {/* Status Update Section */}
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
              {step === "Cost Verification" && repairCases.length > 0 && (
                <Text style={styles.costText}>
                  {" "}
                  (₹{getTotalFinalCost().toFixed(2)})
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        </Card>
      ))}

      {/* Status Update Confirmation Modal */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Status Updated to: {status}</Text>
              {status === "Cost Verification" && repairCases.length > 0 && (
                <Text style={styles.costInfoText}>
                  Final cost sent to customer: ₹{getTotalFinalCost().toFixed(2)}
                </Text>
              )}
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Status Update Confirmation Dialog */}
      <Modal
        visible={isConfirmationModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setConfirmationModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Status Update</Text>
              <Text style={styles.confirmationText}>
                Are you sure you want to update status to "{pendingStatus}"?
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                  onPress={() => setConfirmationModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={confirmStatusUpdate}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Enhanced Cost Verification Modal */}
      <Modal
        visible={isCostModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setCostModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCostModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <View
              style={[styles.modalContainer, { width: "90%", padding: 20 }]}
            >
              <ScrollView style={{ width: "100%" }}>
                <Text style={styles.modalTitle}>Cost Verification Details</Text>

                {repairCases.map((caseItem, index) => (
                  <View key={index} style={styles.repairCaseContainer}>
                    {repairCases.length > 1 && (
                      <Text style={styles.caseNumberText}>
                        Repair Case #{index + 1}
                      </Text>
                    )}

                    <Text style={styles.modalLabel}>Issue Diagnosed*</Text>
                    <TextInput
                      style={[styles.input, { height: 80 }]}
                      multiline={true}
                      placeholder="Describe the issue you diagnosed"
                      value={caseItem.issueDiagnosed}
                      onChangeText={(text) =>
                        updateRepairCase(index, "issueDiagnosed", text)
                      }
                    />

                    <Text style={styles.modalLabel}>
                      Parts Replaced (if any)
                    </Text>
                    <TextInput
                      style={[styles.input, { height: 60 }]}
                      multiline={true}
                      placeholder="List any parts that were replaced"
                      value={caseItem.partsReplaced}
                      onChangeText={(text) =>
                        updateRepairCase(index, "partsReplaced", text)
                      }
                    />

                    <Text style={styles.modalLabel}>
                      Estimated Repair Cost (₹)*
                    </Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      placeholder="Enter estimated cost"
                      value={caseItem.estimatedCost}
                      onChangeText={(text) =>
                        updateRepairCase(index, "estimatedCost", text)
                      }
                    />

                    {caseItem.estimatedCost &&
                      !isNaN(parseFloat(caseItem.estimatedCost)) && (
                        <View style={styles.costBreakdown}>
                          <Text style={styles.breakdownText}>
                            Base Cost: ₹
                            {parseFloat(caseItem.estimatedCost).toFixed(2)}
                          </Text>
                          <Text style={styles.breakdownText}>
                            Service Charge: ₹
                            {(
                              calculateFinalCost(caseItem.estimatedCost) -
                              parseFloat(caseItem.estimatedCost)
                            ).toFixed(2)}
                          </Text>
                          <Text style={styles.finalCostText}>
                            Final Cost: ₹
                            {calculateFinalCost(caseItem.estimatedCost).toFixed(
                              2
                            )}
                          </Text>
                        </View>
                      )}
                  </View>
                ))}

                <TouchableOpacity
                  onPress={addNewRepairCase}
                  style={styles.addCaseButton}
                >
                  <MaterialIcons name="add-circle" size={24} color="#ff7f00" />
                  <Text style={styles.addCaseButtonText}>
                    Add Another Repair Case
                  </Text>
                </TouchableOpacity>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                    onPress={() => setCostModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleCostSubmit}
                  >
                    <Text style={styles.modalButtonText}>Submit All</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#ffffff" },
  card: {
    marginTop: 30,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
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
    padding: 14,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: "center",
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
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: { marginRight: 15 },
  activeCard: {
    backgroundColor: "#ff7f00",
    borderColor: "#e68a00",
    elevation: 5,
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
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  modalButton: { backgroundColor: "#ff7f00", padding: 12, borderRadius: 10 },
  modalButtonText: { color: "#fff", fontWeight: "700" },
  imageDivider: { width: "100%", height: 90, marginVertical: 20 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
    color: "#555",
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  costBreakdown: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  breakdownText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 5,
  },
  finalCostText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff7f00",
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  costText: {
    fontWeight: "700",
    color: "#ff7f00",
  },
  costInfoText: {
    fontSize: 16,
    color: "#ff7f00",
    fontWeight: "600",
    marginVertical: 10,
    textAlign: "center",
  },
  repairCaseContainer: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  caseNumberText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff7f00",
    marginBottom: 15,
  },
  addCaseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginBottom: 20,
  },
  addCaseButtonText: {
    color: "#ff7f00",
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default TaskDetailScreen;
