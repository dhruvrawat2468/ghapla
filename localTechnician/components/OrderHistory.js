import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const dummyOrders = {
  completed: [
    {
      id: "1",
      customer: "John Doe",
      address: "123 Main St, New York",
      device: "iPhone 13",
      timeSlot: "10 AM - 1 PM",
      date: "08-03-2025",
      status: "completed",
    },
    {
      id: "2",
      customer: "Jane Smith",
      address: "456 Elm St, Los Angeles",
      device: "Samsung Galaxy S22",
      timeSlot: "1 PM - 4 PM",
      date: "09-03-2025",
      status: "completed",
    },
  ],
  ongoing: [
    {
      id: "3",
      customer: "Alex Johnson",
      address: "789 Oak St, Chicago",
      device: "MacBook Pro",
      timeSlot: "4 PM - 7 PM",
      date: "10-03-2025",
      status: "ongoing",
    },
  ],
  declined: [
    {
      id: "4",
      customer: "Emily Davis",
      address: "101 Pine St, Houston",
      device: "Dell XPS 15",
      timeSlot: "7 PM - 10 PM",
      date: "11-03-2025",
      status: "declined",
    },
  ],
};

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("ongoing");

  const renderOrderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        item.status === "completed" && styles.completedCard,
        item.status === "declined" && styles.declinedCard,
      ]}
    >
      <View
        style={[
          styles.cardHeader,
          item.status === "completed" && styles.completedHeader,
          item.status === "ongoing" && styles.ongoingHeader,
          item.status === "declined" && styles.declinedHeader,
        ]}
      >
        <MaterialIcons
          name={
            item.status === "completed"
              ? "check-circle"
              : item.status === "declined"
              ? "cancel"
              : "hourglass-empty"
          }
          size={20}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={18} color="#6c757d" />
          <Text style={styles.text}>{item.customer}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="place" size={18} color="#6c757d" />
          <Text style={styles.text}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="devices" size={18} color="#6c757d" />
          <Text style={styles.text}>{item.device}</Text>
        </View>

        <View style={styles.timeInfo}>
          <View style={styles.timeItem}>
            <MaterialIcons name="access-time" size={16} color="#6c757d" />
            <Text style={styles.smallText}>{item.timeSlot}</Text>
          </View>
          <View style={styles.timeItem}>
            <MaterialIcons name="date-range" size={16} color="#6c757d" />
            <Text style={styles.smallText}>{item.date}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Order History</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "ongoing" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("ongoing")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "ongoing" && styles.activeTabText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "completed" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "declined" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("declined")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "declined" && styles.activeTabText,
            ]}
          >
            Declined/Missed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyOrders[activeTab]}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={50} color="#e9ecef" />
            <Text style={styles.emptyText}>No {activeTab} orders</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#212529",
    marginVertical: 20,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#e9ecef",
    borderRadius: 10,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c757d",
  },
  activeTabText: {
    color: "#212529",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
  },
  declinedCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#6c757d",
  },
  completedHeader: {
    backgroundColor: "#28a745",
  },
  ongoingHeader: {
    backgroundColor: "#fd7e14",
  },
  declinedHeader: {
    backgroundColor: "#dc3545",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  cardBody: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#495057",
    marginLeft: 10,
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallText: {
    fontSize: 12,
    color: "#6c757d",
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#adb5bd",
    marginTop: 10,
  },
});

export default OrderHistory;
