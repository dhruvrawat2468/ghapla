import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const orders = [
  {
    id: "1",
    name: "Kettle Repair",
    date: "Today, 10:30 AM",
    price: "₹230",
    image: require("../assets/images/i3.png"),
    status: "ongoing",
    eta: "2 hours remaining",
  },
  {
    id: "2",
    name: "Phone Screen Replacement",
    date: "Yesterday, 2:15 PM",
    price: "₹400",
    image: require("../assets/images/i2.png"),
    status: "completed",
  },
  {
    id: "3",
    name: "Mixer Grinder Service",
    date: "Dec 23, 11:00 AM",
    price: "₹150",
    image: require("../assets/images/i1.png"),
    status: "completed",
  },
];

const OrderTrackingScreen = () => {
  const navigation = useNavigation();

  const handleTrackOrder = (item) => {
    navigation.navigate("CurrentOrder", { order: item });
  };

  const handleReview = (item) => {
    navigation.navigate("ReviewScreen", { order: item });
  };

  const handleComplaint = (item) => {
    navigation.navigate("ComplaintScreen", { order: item });
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => handleTrackOrder(item)}
        activeOpacity={0.9}
      >
        <View style={styles.itemImageContainer}>
          <Image source={item.image} style={styles.itemImage} />
          {item.status === "ongoing" && <View style={styles.liveBadge} />}
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.topRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>

          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={14} color="#888" />
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>

          {item.status === "ongoing" ? (
            <View style={styles.statusRow}>
              <View style={styles.statusPill}>
                <View style={[styles.statusDot, styles.ongoingDot]} />
                <Text style={styles.statusText}>In Progress</Text>
              </View>
              <Text style={styles.etaText}>{item.eta}</Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <View style={styles.statusPill}>
                <View style={[styles.statusDot, styles.completedDot]} />
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>
          )}
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#FD7E14"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {item.status === "completed" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => handleReview(item)}
          >
            <MaterialIcons name="rate-review" size={16} color="#4CAF50" />
            <Text style={styles.buttonText}>Rate Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.complaintButton}
            onPress={() => handleComplaint(item)}
          >
            <MaterialIcons name="report-problem" size={16} color="#F44336" />
            <Text style={styles.buttonText}>File Complaint</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor="#FD7E14" barStyle="light-content" /> */}

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {orders.filter((o) => o.status === "completed").length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {orders.filter((o) => o.status === "ongoing").length}
          </Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
      </View>
      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    height: 40, // Maintain header space without title
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FD7E14",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 30,
  },
  orderItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: "hidden",
  },
  itemContent: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  itemImageContainer: {
    position: "relative",
    marginRight: 15,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  liveBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  itemDetails: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FD7E14",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemDate: {
    fontSize: 13,
    color: "#888",
    marginLeft: 5,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  ongoingDot: {
    backgroundColor: "#FD7E14",
  },
  completedDot: {
    backgroundColor: "#4CAF50",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555",
  },
  etaText: {
    fontSize: 12,
    color: "#FD7E14",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 10,
  },
  reviewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 5,
  },
  complaintButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFEBEE",
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 13,
    marginLeft: 6,
    color: "#333",
    fontWeight: "500",
  },
  arrowIcon: {
    marginLeft: 10,
  },
});

export default OrderTrackingScreen;
