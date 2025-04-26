import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, RadioButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const TrackingStatusScreen = ({ route }) => {
  const { orderId } = route.params || {}; // Get orderId from navigation params
  const [status, setStatus] = useState("picked");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isCostModalVisible, setCostModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const statuses = ["picked", "verification", "repair", "delivered", "payment"];
  const indexRef = useRef(0);

  const animatedLines = useRef(
    Array(statuses.length - 1)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Fetch order details from the backend
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://192.168.29.44:3001/api/2001`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.order) {
          setOrderDetails(data.order);
          if (data.order.status === "Cost Verification") {
            setStatus("verification");
            setCostModalVisible(true);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }

    const timer = setInterval(() => {
      if (
        indexRef.current < statuses.length - 1 &&
        status !== "verification"
      ) {
        Animated.timing(animatedLines[indexRef.current], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start();

        indexRef.current++;
        setStatus(statuses[indexRef.current]);
      } else if (
        status === "verification" &&
        orderDetails?.paymentStatus === "pending"
      ) {
        Animated.timing(animatedLines[indexRef.current], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start();

        indexRef.current++;
        setStatus(statuses[indexRef.current]);
      } else {
        clearInterval(timer);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [orderId, orderDetails?.paymentStatus, status]);

  const handleAcceptCost = async () => {
    try {
      const response = await fetch(`http://your-api-endpoint/api/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentStatus: "pending",
          status: "Repair in Progress", // Move to next status
        }),
      });

      if (response.ok) {
        setOrderDetails({
          ...orderDetails,
          paymentStatus: "pending",
          status: "Repair in Progress",
        });
        setCostModalVisible(false);
      } else {
        console.error("Failed to accept cost");
      }
    } catch (error) {
      console.error("Error accepting cost:", error);
    }
  };

  const handleRejectCost = async () => {
    try {
      const response = await fetch(`http://your-api-endpoint/api/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentStatus: "incomplete",
          status: "Closed",
        }),
      });

      if (response.ok) {
        setCostModalVisible(false);
        setStatus("payment"); // Or handle order closure differently
      } else {
        console.error("Failed to reject cost");
      }
    } catch (error) {
      console.error("Error rejecting cost:", error);
    }
  };

  const handlePayment = () => {
    alert(`Payment method selected: ${paymentMethod}`);
  };

  return (
    <LinearGradient
      colors={["#FFB75E", "#ED8F03"]}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.cardContainer}>
          <Text style={styles.heading}>Tracking Status</Text>
          <View style={styles.divider} />

          <View style={styles.timeline}>
            <View style={styles.backgroundLine} />
            <Animated.View style={styles.foregroundLineContainer}>
              {animatedLines.map((animValue, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.foregroundLineSegment,
                    {
                      height: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 60],
                      }),
                    },
                  ]}
                />
              ))}
            </Animated.View>

            {statuses.map((step, index) => (
              <View key={step} style={styles.step}>
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name={
                      step === "picked"
                        ? "directions-bike"
                        : step === "verification"
                        ? "attach-money"
                        : step === "repair"
                        ? "build"
                        : step === "delivered"
                        ? "local-shipping"
                        : "payment"
                    }
                    size={24}
                    color="white"
                  />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>
                    {step === "picked"
                      ? "Product Picked"
                      : step === "verification"
                      ? "Cost Verification"
                      : step === "repair"
                      ? "Repair In Process"
                      : step === "delivered"
                      ? "Delivered"
                      : "Payment Done"}
                  </Text>
                  <Text style={styles.stepDescription}>
                    {step === "picked"
                      ? "Product has been picked and is carried to the assigned shop."
                      : step === "verification"
                      ? "Customer will verify the cost before repairing process."
                      : step === "repair"
                      ? "Your product is being repaired by experts. Sit back & chill!"
                      : step === "delivered"
                      ? "Your product has been delivered to you."
                      : "Payment has been successfully completed."}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Bill Details */}
        <Card style={styles.billCard}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <View style={styles.divider} />
          <View style={styles.billItemRow}>
            <Text style={styles.billItem}>Service Charge:</Text>
            <Text style={styles.billAmount}>
              ₹{orderDetails?.serviceCharge || "XXX"}
            </Text>
          </View>
          <View style={styles.billItemRow}>
            <Text style={styles.billItem}>Repair Cost:</Text>
            <Text style={styles.billAmount}>
              ₹{orderDetails?.cost || "XXX"}
            </Text>
          </View>
          <View style={styles.billItemRow}>
            <Text style={styles.billItem}>Discount:</Text>
            <Text style={styles.discount}>-₹{orderDetails?.discount || "XXX"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.billItemRow}>
            <Text style={styles.grandTotal}>Grand Total:</Text>
            <Text style={styles.grandTotalAmount}>
              ₹{orderDetails?.cost || "XXX"}
            </Text>
          </View>
        </Card>

        {/* Payment Method */}
        <Card style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Select Payment Method</Text>
          <View style={styles.divider} />
          <RadioButton.Group
            onValueChange={(value) => setPaymentMethod(value)}
            value={paymentMethod}
          >
            <View style={styles.radioOption}>
              <RadioButton value="COD" />
              <Text style={styles.radioText}>Cash on Delivery (COD)</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="UPI" />
              <Text style={styles.radioText}>UPI Payment</Text>
            </View>
          </RadioButton.Group>

          <TouchableOpacity
            style={[
              styles.paymentButton,
              !paymentMethod && styles.disabledButton,
            ]}
            onPress={handlePayment}
            disabled={!paymentMethod}
          >
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </Card>

        {/* Cost Verification Modal */}
        <Modal
          visible={isCostModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setCostModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setCostModalVisible(false)}>
            <View style={styles.modalBackdrop}>
              <View style={styles.costModalContainer}>
                <Text style={styles.modalTitle}>Cost Verification</Text>
                {orderDetails?.repairDetails?.length > 0 ? (
                  orderDetails.repairDetails.map((entry, index) => (
                    <View key={index} style={styles.entryContainer}>
                      <Text style={styles.modalText}>
                        {entry.whatRepaired}: ₹{entry.cost}
                      </Text>
                      {index < orderDetails.repairDetails.length - 1 && (
                        <View style={styles.separator} />
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.modalText}>No repair details available</Text>
                )}
                <Text style={styles.modalText}>
                  Total Cost: ₹{orderDetails?.cost || 0}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleAcceptCost}
                  >
                    <Text style={styles.modalButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.rejectButton]}
                    onPress={handleRejectCost}
                  >
                    <Text style={styles.modalButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flexGrow: 1, padding: 16 },
  cardContainer: {
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#585858",
  },
  timeline: { marginLeft: 20, position: "relative" },
  step: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    zIndex: 1,
  },
  stepContent: { flex: 1 },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#585858",
  },
  stepDescription: { fontSize: 14, color: "gray" },
  backgroundLine: {
    position: "absolute",
    left: 18,
    top: 20,
    height: 300,
    width: 4,
    backgroundColor: "#ccc",
  },
  foregroundLineContainer: { position: "absolute", left: 18, top: 20 },
  foregroundLineSegment: {
    width: 4,
    backgroundColor: "orange",
    marginBottom: 20,
  },
  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 10 },
  billCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#fff",
  },
  billTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#575757",
  },
  billItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billItem: {
    fontSize: 20,
    color: "#555555",
  },
  billAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#565656",
  },
  discount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#565656",
  },
  grandTotalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "orange",
  },
  paymentCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#fff",
  },
  paymentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#575757",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioText: {
    fontSize: 16,
    color: "#555555",
  },
  paymentButton: {
    marginTop: 20,
    backgroundColor: "orange",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  // Modal Styles (inspired by TaskDetailScreen)
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
  entryContainer: {
    width: "100%",
    marginBottom: 15,
  },
  separator: {
    height: 1,
    backgroundColor: "#ff7f00",
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  modalButton: {
    backgroundColor: "#ff7f00",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  rejectButton: {
    backgroundColor: "#d9534f",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default TrackingStatusScreen;