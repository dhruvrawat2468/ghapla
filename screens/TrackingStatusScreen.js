import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, RadioButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const TrackingStatusScreen = ({navigation}) => {
  const [status, setStatus] = useState("picked");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const statuses = ["Arrived", "verification", "repair", "payment"];
  const indexRef = useRef(0);

  // Animated Values for each segment of the line (3 segments for 4 steps)
  const animatedLines = useRef(
    Array(statuses.length - 1)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const timer = setInterval(() => {
      if (indexRef.current < statuses.length - 1) {
        indexRef.current++;
        setStatus(statuses[indexRef.current]);

        Animated.timing(animatedLines[indexRef.current - 1], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      } else {
        clearInterval(timer);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

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
            {/* Background line (gray, stops at last icon) */}
            <View style={styles.backgroundLine} />
            {/* Animated foreground line */}
            <Animated.View style={styles.foregroundLineContainer}>
              {animatedLines.map((animValue, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.foregroundLineSegment,
                    {
                      height: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 60], // Matches step height + margin
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
                      step === "Arrived"
                        ? "directions-bike"
                        : step === "verification"
                        ? "attach-money"
                        : step === "repair"
                        ? "build"
                        : step === "payment"
                        ? "payment"
                        : "help-outline"
                    }
                    size={24}
                    color="white"
                  />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>
                    {step === "Arrived"
                      ? "Technician Arrived"
                      : step === "verification"
                      ? "Cost Verification"
                      : step === "repair"
                      ? "Repair In Process"
                      : step === "payment"
                      ? "Payment Done"
                      : "Unknown Status"}
                  </Text>
                  <Text style={styles.stepDescription}>
                    {step === "Arrived"
                      ? "Technician is at your doorstep, ready to assist you.      "
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
            onPress={handlePayment}
            disabled={!paymentMethod}
          >
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </Card>
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
  timeline: {
    marginLeft: 20,
    position: "relative",
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20, // Spacing between steps
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    zIndex: 1, // Ensure icons stay above the line
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
    left: 18, // Adjusted slightly to center with wider line
    top: 20, // Half the icon height to start from center
    height: 250, // 4 steps: (40 icon height + 20 margin) * 3 gaps + 40 for last icon
    width: 4, // Increased width for better visibility
    backgroundColor: "#ccc", // Gray for uncompleted segments
  },
  foregroundLineContainer: {
    position: "absolute",
    left: 18, // Adjusted slightly to center with wider line
    top: 20, // Start from center of first icon
  },
  foregroundLineSegment: {
    width: 4, // Increased width for better visibility
    backgroundColor: "orange",
    marginBottom: 20, // Match step margin
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
});

export default TrackingStatusScreen;