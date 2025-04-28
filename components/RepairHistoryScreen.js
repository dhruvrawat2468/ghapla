import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const { userToken, userProfile } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders and their OrderStatus
  useEffect(() => {
    const fetchOrdersAndStatuses = async () => {
      if (!userProfile?._id || !userToken) {
        setLoading(false);
        return;
      }

      try {
        // Fetch orders
        const ordersResponse = await axios.get(
          `http://192.168.1.8:7000/api/orders/user/${userProfile._id}`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        // Fetch OrderStatus for each order
        const statusPromises = ordersResponse.data.map((order) =>
          axios
            .get(
              `http://192.168.1.8:7000/api/orders/order-status/${order._id}`,
              {
                headers: { Authorization: `Bearer ${userToken}` },
              }
            )
            .catch((error) => {
              if (error.response?.status === 404) {
                console.warn(`OrderStatus not found for orderId: ${order._id}`);
                return { data: null };
              }
              throw error;
            })
        );

        const statusesResponses = await Promise.all(statusPromises);

        // Create a status map
        const statusMap = {};
        statusesResponses.forEach((response, index) => {
          const orderId = ordersResponse.data[index]._id;
          statusMap[orderId] = response.data?.status || "unknown";
        });

        // Map orders with their OrderStatus.status and serviceType
        const mappedOrders = ordersResponse.data.map((order) => ({
          id: order._id,
          name: order.applianceName,
          date: new Date(order.serviceDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }).replace(/\//g, "-"),
          status: statusMap[order._id],
          serviceType: order.serviceType,
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching orders or statuses:", {
          message: error.message,
          response: error.response?.data,
        });
        Alert.alert("Error", "Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndStatuses();
  }, [userProfile, userToken]);

  const handleTrackOrder = (item) => {
    navigation.navigate(
      item.serviceType === "Pickup Repair Drop" ? "PickupRepair" : "HomeRepair",
      { orderId: item.id }
    );
  };

  const handleReview = (item) => {
    navigation.navigate("ReviewScreen", { repairItem: item });
  };

  const handleComplaint = (item) => {
    navigation.navigate("ComplaintScreen", { repairItem: item });
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => handleTrackOrder(item)}
        activeOpacity={0.9}
      >
        <View style={styles.itemDetails}>
          <View style={styles.topRow}>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>

          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={14} color="#888" />
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>

          {item.status !== "completed" ? (
            <View style={styles.statusRow}>
              <View style={styles.statusPill}>
                <View style={[styles.statusDot, styles.ongoingDot]} />
                <Text style={styles.statusText}>In Progress</Text>
              </View>
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FD7E14" />
          <Text style={styles.loadingText}>Loading Orders...</Text>
        </View>
      </View>
    );
  }

  if (!userProfile || !userToken) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.noUserText}>
            Please log in to view your repair history.
          </Text>
        </View>
      </View>
    );
  }

  // Filter orders based on OrderStatus.status
  const currentOrders = orders.filter((order) => order.status !== "completed");
  const pastRepairs = orders.filter((order) => order.status === "completed");

  return (
    <View style={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pastRepairs.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{currentOrders.length}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
      </View>

      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.noOrderText}>No orders found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  noOrderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  noUserText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 20,
  },
});

export default OrderTrackingScreen;