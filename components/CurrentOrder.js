import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const CurrentOrderScreen = ({ navigation }) => {
  const orderDetails = {
    orderId: "ORD123456",
    name: "Laptop Repair",
    price: "₹500",
    technician: "Amit Sharma",
    contact: "+91 98765 43210",
    address: "Sector 45, Noida, Uttar Pradesh - 201301",
    image: require("../assets/images/laptop.png"),
    status: "In Progress",
    eta: "Today by 4:30 PM",
    progress: 65,
    serviceType: "Pickup & Drop",
  };

  const handleTrackPress = () => {
    if (orderDetails.serviceType === "Home Repair") {
      navigation.navigate("Tracking");
    } else if (orderDetails.serviceType === "Pickup & Drop") {
      navigation.navigate("PickupRepair");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Tracking Header */}
      <View style={styles.trackingHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#FD7E14" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Tracking Card */}
        <TouchableOpacity
          style={styles.trackingCard}
          onPress={handleTrackPress}
        >
          <View style={styles.trackingContent}>
            <View style={styles.trackingIcon}>
              <Ionicons name="navigate" size={24} color="#FD7E14" />
            </View>
            <View style={styles.trackingTextContainer}>
              <Text style={styles.trackingTitle}>Track Your Order</Text>
              <Text style={styles.trackingSubtitle}>
                See real-time location and ETA
              </Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${orderDetails.progress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {orderDetails.progress}% completed • {orderDetails.eta}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Main Order Card */}
        <View style={styles.card}>
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image source={orderDetails.image} style={styles.image} />
          </View>

          {/* Title and Price */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{orderDetails.name}</Text>
            <Text style={styles.price}>{orderDetails.price}</Text>
          </View>

          {/* Status Pill */}
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{orderDetails.status}</Text>
          </View>

          {/* Consolidated Information Box */}
          <View style={styles.consolidatedInfoBox}>
            {/* Service Type */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons
                  name="home-repair-service"
                  size={20}
                  color="#FD7E14"
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>SERVICE TYPE</Text>
                <Text style={styles.infoValue}>{orderDetails.serviceType}</Text>
              </View>
            </View>

            {/* Order ID */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="receipt-outline" size={20} color="#FD7E14" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>ORDER ID</Text>
                <Text style={styles.infoValue}>{orderDetails.orderId}</Text>
              </View>
            </View>

            {/* Technician */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialIcons name="engineering" size={20} color="#FD7E14" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>TECHNICIAN</Text>
                <Text style={styles.infoValue}>{orderDetails.technician}</Text>
                <TouchableOpacity style={styles.contactButton}>
                  <Ionicons name="call-outline" size={16} color="#FD7E14" />
                  <Text style={styles.contactText}>{orderDetails.contact}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Address */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={20} color="#FD7E14" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>SERVICE ADDRESS</Text>
                <Text style={styles.infoValue}>{orderDetails.address}</Text>
                <TouchableOpacity style={styles.mapButton}>
                  <Ionicons name="map-outline" size={16} color="#FD7E14" />
                  <Text style={styles.mapText}>View on Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  trackingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: -5,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  trackingCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  trackingContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  trackingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  trackingTextContainer: {
    flex: 1,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  trackingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "#EEE",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FD7E14",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  imageContainer: {
    alignSelf: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    flex: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FD7E14",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FD7E14",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FD7E14",
  },
  consolidatedInfoBox: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  infoIcon: {
    width: 40,
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  contactText: {
    fontSize: 15,
    color: "#FD7E14",
    marginLeft: 6,
    fontWeight: "500",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  mapText: {
    fontSize: 15,
    color: "#FD7E14",
    marginLeft: 6,
    fontWeight: "500",
  },
});

export default CurrentOrderScreen;
