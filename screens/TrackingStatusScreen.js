import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, RadioButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TrackingStatusScreen = ({ route }) => {
  const { orderId } = route.params || {};
  const [status, setStatus] = useState(null); // Null until user-facing status
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isCostModalVisible, setCostModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const backendStatuses = ["Arrived", "Cost Verification", "Repair in Progress", "Ready to Deliver"];
  const displayStatuses = ["Arrived", "verification", "repair", "payment"];
  const LINE_HEIGHT = SCREEN_HEIGHT * 0.12;
  const TOTAL_LINE_HEIGHT = LINE_HEIGHT * (displayStatuses.length - 1);
  const animatedLines = useRef(
    Array(displayStatuses.length - 1)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.6:7000/api/orders/order-status/${orderId}`, {
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
          if (backendStatuses.includes(currentStatus)) {
            const displayStatus = displayStatuses[backendStatuses.indexOf(currentStatus)];
            setStatus(displayStatus);
            const currentIndex = displayStatuses.indexOf(displayStatus);
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
      const response = await fetch(`http://192.168.1.6:7000/api/orders/order-status/accept-cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (response.ok) {
        const updatedStatus = await response.json();
        setOrderDetails(updatedStatus.orderStatus);
        setStatus("repair");
        setCostModalVisible(false);
        const currentIndex = displayStatuses.indexOf("verification");
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
      const response = await fetch(`http://192.168.1.6:7000/api/orders/order-status/reject-cost`, {
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
      const response = await fetch(`http://192.168.1.6:7000/api/orders/order-status/update`, {
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
        setStatus("payment");
        alert(`Payment method selected: ${paymentMethod}`);
        const currentIndex = displayStatuses.indexOf("repair");
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
      <LinearGradient colors={["#FFf", "#fff"]} style={styles.gradientContainer}>
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
    <LinearGradient colors={["#FFf", "#fff"]} style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.cardContainer}>
          <Text style={styles.heading}>Tracking Status</Text>
          <View style={styles.divider} />
          <View style={styles.timeline}>
            <View style={[styles.backgroundLine, { height: TOTAL_LINE_HEIGHT }]} />
            <Animated.View style={[styles.foregroundLineContainer, { height: TOTAL_LINE_HEIGHT }]}>
              {animatedLines.map((animValue, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.foregroundLineSegment,
                    {
                      height: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, LINE_HEIGHT],
                      }),
                    },
                  ]}
                />
              ))}
            </Animated.View>
            {displayStatuses.map((step, index) => (
              <View key={step} style={[styles.step, { tinglingHeight: LINE_HEIGHT }]}>
                <View
                  style={[
                    styles.iconContainer,
                    index <= displayStatuses.indexOf(status) && styles.activeIcon,
                  ]}
                >
                  <MaterialIcons
                    name={
                      step === "Arrived"
                        ? "directions-bike"
                        : step === "verification"
                        ? "attach-money"
                        : step === "repair"
                        ? "build"
                        : "currency-rupee"
                    }
                    size={24}
                    color="white"
                  />
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      index <= displayStatuses.indexOf(status) && styles.activeTitle,
                    ]}
                  >
                    {step === "Arrived"
                      ? "Technician Arrived"
                      : step === "verification"
                      ? "Cost Verification"
                      : step === "repair"
                      ? "Repair In Process"
                      : "Payment Done"}
                  </Text>
                  <Text style={styles.stepDescription}>
                    {step === "Arrived"
                      ? "Technician is at your doorstep, ready to assist you."
                      : step === "verification"
                      ? "Customer will verify the cost before repairing process."
                      : step === "repair"
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
            <Text style={styles.billItem}>Repair Cost:</Text>
            <Text style={styles.billAmount}>₹{orderDetails?.cost || 0}</Text>
          </View>
          <View style={styles.billItemRow}>
            <Text style={styles.billItem}>Discount:</Text>
            <Text style={styles.discount}>-₹{orderDetails?.discount || 0}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.billItemRow}>
            <Text style={styles.grandTotal}>Grand Total:</Text>
            <Text style={styles.grandTotalAmount}>
              ₹{(orderDetails?.serviceCharge || 0) + (orderDetails?.cost || 0) - (orderDetails?.discount || 0)}
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
        <Modal visible={isCostModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Cost Estimate Verification</Text>
              <View style={styles.modalDivider} />
              <View style={styles.costDetailContainer}>
                {orderDetails?.repairDetails?.length > 0 ? (
                  orderDetails.repairDetails.map((entry, index) => (
                    <View key={index} style={styles.costDetailRow}>
                      <Text style={styles.costDetailLabel}>
                        {entry.whatRepaired || "Parts to replace"}:
                      </Text>
                      <Text style={styles.costDetailValue}>₹{entry.cost}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.costDetailRow}>
                    <Text style={styles.costDetailLabel}>No repair details:</Text>
                    <Text style={styles.costDetailValue}>N/A</Text>
                  </View>
                )}
                <View style={styles.costDetailRow}>
                  <Text style={styles.costDetailLabel}>Service Charge:</Text>
                  <Text style={styles.costDetailValue}>₹{orderDetails?.serviceCharge || 0}</Text>
                </View>
                <View style={styles.costTotalRow}>
                  <Text style={styles.costTotalLabel}>Total Estimated Cost:</Text>
                  <Text style={styles.costTotalValue}>
                    ₹{(orderDetails?.serviceCharge || 0) + (orderDetails?.cost || 0)}
                  </Text>
                </View>
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.declineButton]}
                  onPress={handleRejectCost}
                >
                  <Text style={styles.modalButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.acceptButton]}
                  onPress={handleAcceptCost}
                >
                  <Text style={styles.modalButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  waitingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#555555",
    marginVertical: 20,
  },
  timeline: {
    marginLeft: 20,
    position: "relative",
    paddingBottom: 10,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    zIndex: 1,
  },
  activeIcon: {
    backgroundColor: "#fd7e14",
  },
  stepContent: {
    flex: 1,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#585858",
  },
  activeTitle: {
    color: "#fd7e14",
  },
  stepDescription: {
    fontSize: 14,
    color: "gray",
    marginRight: 10,
  },
  backgroundLine: {
    position: "absolute",
    left: 18,
    top: 20,
    width: 4,
    backgroundColor: "#ccc",
  },
  foregroundLineContainer: {
    position: "absolute",
    left: 18,
    top: 20,
    width: 4,
  },
  foregroundLineSegment: {
    width: 4,
    backgroundColor: "#fd7e14",
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
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
    color: "#fd7e14",
  },
  paymentCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#fff",
    marginBottom: 35,
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
    marginLeft: 8,
  },
  paymentButton: {
    marginTop: 20,
    backgroundColor: "#fd7e14",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fd7e14",
    textAlign: "center",
    marginBottom: 10,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  costDetailContainer: {
    marginVertical: 10,
  },
  costDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  costDetailLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  costDetailValue: {
    fontSize: 16,
    color: "#333",
  },
  costTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  costTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  costTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fd7e14",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  declineButton: {
    backgroundColor: "#dc3545",
  },
  acceptButton: {
    backgroundColor: "#28a745",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TrackingStatusScreen;