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
  const { orderId } = route.params || {};
  const [status, setStatus] = useState(null); // Null until user-facing status
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isCostModalVisible, setCostModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const statuses = ["Arrived", "Cost Verification", "Repair in Progress", "Ready to Deliver"];
  const animatedLines = useRef(
    Array(statuses.length - 1)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://192.168.251.1:7000/api/orders/order-status/${orderId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Order status not found");
        }
        const data = await response.json();
        if (data) {
          setOrderDetails(data);
          const currentStatus = data.status;
          if (statuses.includes(currentStatus)) {
            setStatus(currentStatus);
            const currentIndex = statuses.indexOf(currentStatus);
            animatedLines.forEach((animValue, index) => {
              Animated.timing(animValue, {
                toValue: index < currentIndex ? 1 : 0,
                duration: 1000,
                useNativeDriver: false,
              }).start();
            });
            if (currentStatus === "Cost Verification" && data.cost > 0) {
              setCostModalVisible(true);
            }
          } else {
            setStatus(null);
          }
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
        setStatus(null);
      }
    };

    if (orderId) {
      fetchOrderDetails();
      const interval = setInterval(fetchOrderDetails, 5000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const handleAcceptCost = async () => {
    try {
      const response = await fetch(`http://192.168.251.1:7000/api/orders/order-status/accept-cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (response.ok) {
        const updatedStatus = await response.json();
        setOrderDetails(updatedStatus.orderStatus);
        setStatus("Repair in Progress");
        setCostModalVisible(false);
        const currentIndex = statuses.indexOf("Cost Verification");
        Animated.timing(animatedLines[currentIndex], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    } catch (error) {
      console.error("Error accepting cost:", error);
    }
  };

  const handleRejectCost = async () => {
    try {
      const response = await fetch(`http://192.168.251.1:7000/api/orders/order-status/reject-cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (response.ok) {
        const updatedStatus = await response.json();
        setOrderDetails(updatedStatus.orderStatus);
        setStatus("Arrived");
        setCostModalVisible(false);
      }
    } catch (error) {
      console.error("Error rejecting cost:", error);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) return;
    try {
      const response = await fetch(`http://192.168.251.1:7000/api/orders/order-status/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: "Ready to Deliver",
          paymentStatus: "completed",
        }),
      });
      if (response.ok) {
        const updatedStatus = await response.json();
        setOrderDetails(updatedStatus.orderStatus);
        setStatus("Ready to Deliver");
        alert(`Payment method selected: ${paymentMethod}`);
        const currentIndex = statuses.indexOf("Repair in Progress");
        Animated.timing(animatedLines[currentIndex], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  if (!status) {
    return (
      <LinearGradient colors={["#FFB75E", "#ED8F03"]} style={styles.gradientContainer}>
        <View style={styles.container}>
          <Card style={styles.cardContainer}>
            <Text style={styles.heading}>Tracking Status</Text>
            <View style={styles.divider} />
            <Text style={styles.waitingText}>Waiting for technician to arrive...</Text>
          </Card>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#FFB75E", "#ED8F03"]} style={styles.gradientContainer}>
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
            {statuses.map((step) => (
              <View key={step} style={styles.step}>
                <View style={styles.iconContainer}>
                  <MaterialIcons
                    name={
                      step === "Arrived"
                        ? "directions-bike"
                        : step === "Cost Verification"
                        ? "attach-money"
                        : step === "Repair in Progress"
                        ? "build"
                        : "payment"
                    }
                    size={24}
                    color="white"
                  />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>
                    {step === "Arrived"
                      ? "Technician Arrived"
                      : step === "Cost Verification"
                      ? "Cost Verification"
                      : step === "Repair in Progress"
                      ? "Repair In Process"
                      : "Payment Done"}
                  </Text>
                  <Text style={styles.stepDescription}>
                    {step === "Arrived"
                      ? "Technician is at your doorstep, ready to assist you."
                      : step === "Cost Verification"
                      ? "Please verify the repair cost before we proceed."
                      : step === "Repair in Progress"
                      ? "Your product is being repaired by experts. Sit back & chill!"
                      : "Payment has been successfully completed."}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
        <Card style={styles.billCard}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <View style={styles.divider} />
          <View style={styles.billItemRow}>
            <Text style={styles.billItem}>Service Charge:</Text>
            <Text style={styles.billAmount}>₹{orderDetails?.serviceCharge || 0}</Text>
          </View>
          <View style={styles.billItemRow}>
            <Text style={styles.billItem}>Repair Cost:</Text>
            <Text style={styles.billAmount}>₹{orderDetails?.cost || 0}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.billItemRow}>
            <Text style={styles.grandTotal}>Grand Total:</Text>
            <Text style={styles.grandTotalAmount}>
              ₹{(orderDetails?.serviceCharge || 0) + (orderDetails?.cost || 0)}
            </Text>
          </View>
        </Card>
        <Card style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Select Payment Method</Text>
          <View style={styles.divider} />
          <RadioButton.Group onValueChange={(value) => setPaymentMethod(value)} value={paymentMethod}>
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
              (!paymentMethod || orderDetails?.status !== "Repair in Progress" || orderDetails?.paymentStatus !== "pending") &&
                styles.disabledButton,
            ]}
            onPress={handlePayment}
            disabled={!paymentMethod || orderDetails?.status !== "Repair in Progress" || orderDetails?.paymentStatus !== "pending"}
          >
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </Card>
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
                <Text style={styles.modalText}>Service Charge: ₹{orderDetails?.serviceCharge || 0}</Text>
                <Text style={styles.modalText}>Repair Cost: ₹{orderDetails?.cost || 0}</Text>
                <Text style={styles.modalText}>
                  Grand Total: ₹{(orderDetails?.serviceCharge || 0) + (orderDetails?.cost || 0)}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.modalButton} onPress={handleAcceptCost}>
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
  gradientContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
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
  waitingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#555555",
    marginVertical: 20,
  },
  timeline: {
    marginLeft: 20,
    position: "relative",
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
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
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#585858",
  },
  stepDescription: {
    fontSize: 14,
    color: "gray",
  },
  backgroundLine: {
    position: "absolute",
    left: 18,
    top: 20,
    height: 250,
    width: 4,
    backgroundColor: "#ccc",
  },
  foregroundLineContainer: {
    position: "absolute",
    left: 18,
    top: 20,
  },
  foregroundLineSegment: {
    width: 4,
    backgroundColor: "orange",
    marginBottom: 20,
  },
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
  bill NeItemRow: {
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
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
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