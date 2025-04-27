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

const TrackingStatusScreen = () => {
  const [status, setStatus] = useState("picked");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showCostEstimate, setShowCostEstimate] = useState(false); // << Added
  const statuses = ["picked", "verification", "repair", "delivered", "payment"];
  const currentIndex = useRef(0);

  const LINE_HEIGHT = SCREEN_HEIGHT * 0.12;
  const TOTAL_LINE_HEIGHT = LINE_HEIGHT * (statuses.length - 1);

  const animatedLines = useRef(
    Array(statuses.length - 1)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const timer1 = setTimeout(() => updateStatus("verification"), 1000);
    const timer2 = setTimeout(() => updateStatus("repair"), 3000);
    const timer3 = setTimeout(() => updateStatus("delivered"), 6000);
    const timer4 = setTimeout(() => updateStatus("payment"), 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const updateStatus = (newStatus) => {
    const newIndex = statuses.indexOf(newStatus);
    if (newIndex <= currentIndex.current) return;

    Animated.timing(animatedLines[newIndex - 1], {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      currentIndex.current = newIndex;
      setStatus(newStatus);

      if (newStatus === "verification") {
        setShowCostEstimate(true); // << Open Modal at verification step
      }
    });
  };

  const handleAcceptCost = () => {
    setShowCostEstimate(false);
    // maybe continue normal flow
  };

  const handleDeclineCost = () => {
    setShowCostEstimate(false);
    // Optionally handle what happens if user declines (like cancel repair?)
  };

  return (
    <LinearGradient colors={["#fff", "#fff"]} style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.cardContainer}>
          <Text style={styles.heading}>Tracking Status</Text>
          <View style={styles.divider} />

          <View style={styles.timeline}>
            <View
              style={[styles.backgroundLine, { height: TOTAL_LINE_HEIGHT }]}
            />
            <Animated.View
              style={[
                styles.foregroundLineContainer,
                { height: TOTAL_LINE_HEIGHT },
              ]}
            >
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

            {statuses.map((step, index) => (
              <View
                key={step}
                style={[styles.step, { minHeight: LINE_HEIGHT }]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    index <= statuses.indexOf(status) && styles.activeIcon,
                  ]}
                >
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
                      index <= statuses.indexOf(status) && styles.activeTitle,
                    ]}
                  >
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
            <Text style={styles.billAmount}>₹XXX</Text>
          </View>
          <View style={styles.billItemRow}>
            <Text style={styles.billItem}>Repair Cost:</Text>
            <Text style={styles.billAmount}>₹XXX</Text>
          </View>
          <View style={styles.billItemRow}>
            <Text style={styles.billItem}>Discount:</Text>
            <Text style={styles.discount}>-₹XXX</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.billItemRow}>
            <Text style={styles.grandTotal}>Grand Total:</Text>
            <Text style={styles.grandTotalAmount}>₹XXX</Text>
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
            disabled={!paymentMethod}
          >
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </Card>

        {/* Cost Estimate Modal */}
        <Modal visible={showCostEstimate} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Cost Estimate Verification</Text>
              <View style={styles.modalDivider} />

              <View style={styles.costDetailContainer}>
                <View style={styles.costDetailRow}>
                  <Text style={styles.costDetailLabel}>Issue Diagnosed:</Text>
                  <Text style={styles.costDetailValue}>Water damage</Text>
                </View>

                <View style={styles.costDetailRow}>
                  <Text style={styles.costDetailLabel}>Parts to replace:</Text>
                  <Text style={styles.costDetailValue}>Charging port</Text>
                </View>

                <View style={styles.costTotalRow}>
                  <Text style={styles.costTotalLabel}>
                    Total Estimated Cost:
                  </Text>
                  <Text style={styles.costTotalValue}>₹2500</Text>
                </View>
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.declineButton]}
                  onPress={handleDeclineCost}
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
    marginTop: 15,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#585858",
  },
  timeline: {
    marginLeft: 20,
    position: "relative",
    paddingBottom: 10,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0, // We control spacing with minHeight
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
    paddingBottom: 20, // Add some space between steps
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
    marginBottom: 40,
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
  // Modal Styles
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
