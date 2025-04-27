// home repair
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
  const [status, setStatus] = useState("Arrived");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showCostEstimate, setShowCostEstimate] = useState(false); // NEW
  const [costAccepted, setCostAccepted] = useState(null); // NEW
  const statuses = ["Arrived", "verification", "repair", "payment"];
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
    const timer2 = setTimeout(() => {
      if (costAccepted) updateStatus("repair"); // Only move to repair if cost accepted
    }, 3000);
    const timer3 = setTimeout(() => {
      if (costAccepted) updateStatus("payment"); // Only move to payment if cost accepted
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [costAccepted]); // depends on costAccepted now

  const updateStatus = (newStatus) => {
    const newIndex = statuses.indexOf(newStatus);
    if (newIndex <= currentIndex.current) return;

    if (newStatus === "verification") {
      setShowCostEstimate(true); // show estimate card when verification starts
    }

    Animated.timing(animatedLines[newIndex - 1], {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      currentIndex.current = newIndex;
      setStatus(newStatus);
    });
  };

  const handleAcceptCost = () => {
    setShowCostEstimate(false);
    setCostAccepted(true);
  };

  const handleDeclineCost = () => {
    setShowCostEstimate(false);
    setCostAccepted(false);
  };

  return (
    <LinearGradient colors={["#FFf", "#fff"]} style={styles.gradientContainer}>
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
                      index <= statuses.indexOf(status) && styles.activeTitle,
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

        {/* COST ESTIMATE MODAL */}
        <Modal visible={showCostEstimate} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cost Estimate</Text>
              <View style={styles.divider} />

              <Text style={styles.modalText}>
                Issue Diagnosed: Water damage
              </Text>
              <Text style={styles.modalText}>
                Parts to be replaced: Charging port
              </Text>
              <Text style={styles.modalText}>Estimated Repair Cost: ₹2500</Text>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#28a745" }]}
                  onPress={handleAcceptCost}
                >
                  <Text style={styles.modalButtonText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#dc3545" }]}
                  onPress={handleDeclineCost}
                >
                  <Text style={styles.modalButtonText}>Decline</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TrackingStatusScreen;
