import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const CurrentOrderScreen = ({navigation}) => {
  const orderDetails = {
    orderId: "ORD123456",
    name: "Laptop Repair",
    price: "₹500",
    technician: "Amit Sharma",
    address: "Sector 45, Noida, Uttar Pradesh",
    image: require("../assets/images/laptop.png"),
  };

  return (
    <LinearGradient colors={["#FF6600", "#FF8533"]} style={styles.container}>
      <View style={styles.card}>
        <Image source={orderDetails.image} style={styles.image} />
        <Text style={styles.title}>{orderDetails.name}</Text>
        <Text style={styles.price}>{orderDetails.price}</Text>

        <View style={styles.detailRow}>
          <Ionicons name="receipt-outline" size={22} color="#4A4A4A" />
          <Text style={styles.detailText}>Order ID: {orderDetails.orderId}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="engineering" size={22} color="#4A4A4A" />
          <Text style={styles.detailText}>Technician: {orderDetails.technician}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={22} color="#4A4A4A" />
          <Text style={styles.detailText}>{orderDetails.address}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.complaintButton} onPress={()=>{navigation.navigate("ComplaintScreen")}}>
        <Ionicons name="alert-circle-outline" size={22} color="#fff" />
        <Text style={styles.complaintText}>Raise a Complaint</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    paddingVertical: 40, // Increased vertical padding to expand card height
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700", // Bold for better prominence
    color: "#333",
    fontFamily: "Roboto", // Modern font
    letterSpacing: 1.2,
  },
  price: {
    fontSize: 20,
    fontWeight: "600", // Slightly bold for readability
    color: "#27AE60",
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8, // Slightly increased margin for better spacing
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
    fontFamily: "Roboto", // Uniform font family for all text
    lineHeight: 22, // Adding line height for better readability
  },
  complaintButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
  },
  complaintText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: "Roboto", // Uniform font family
  },
});

export default CurrentOrderScreen;
