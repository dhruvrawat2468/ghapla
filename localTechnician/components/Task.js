import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ProductContext } from "../context/ProductContext";
import { TechnicianContext } from "../context/TechnicianContext";

const dummyTasks = [
  {
    id: "1",
    customer: "John Doe",
    device: "Mobile Phone",
    brand: "Apple",
    issue: "Screen cracked",
    timeSlot: "10 AM - 1 PM",
    date: "08-03-2025",
    address: "123 Main St, New York, NY",
    status: "New",
    serviceType: "Home Repair",
  },
  {
    id: "2",
    customer: "Jane Smith",
    device: "T.V",
    brand: "Samsung",
    issue: "Green Screen",
    timeSlot: "1 PM - 4 PM",
    date: "09-03-2025",
    address: "456 Elm St, Los Angeles, CA",
    status: "New",
    serviceType: "Pickup & Drop",
  },
  {
    id: "3",
    customer: "Alex Green",
    device: "Pixel 7",
    brand: "Google",
    issue: "Speaker not working",
    timeSlot: "9 AM - 11 AM",
    date: "10-03-2025",
    address: "789 Oak St, Chicago, IL",
    status: "New",
    serviceType: "Home Repair",
  },
  {
    id: "4",
    customer: "Sarah Johnson",
    device: "Laptop",
    brand: "Dell",
    issue: "Keyboard not working",
    timeSlot: "2 PM - 5 PM",
    date: "11-03-2025",
    address: "321 Pine St, Houston, TX",
    status: "New",
    serviceType: "Pickup & Drop",
  },
];

const TaskScreen = () => {
  const navigation = useNavigation();
  const { selectedProducts } = useContext(ProductContext);
  const { technician } = useContext(TechnicianContext);

  // Check if technician is verified
  if (technician.overallStatus !== "Verified") {
    return (
      <View style={styles.container}>
        <View style={styles.pendingVerificationBox}>
          <MaterialCommunityIcons
            name="alert-outline"
            size={24}
            color="#FF9800"
          />
          <Text style={styles.pendingVerificationText}>
            Your profile is under verification. You cannot view tasks until your
            profile is verified by our team.
          </Text>
          <Text style={styles.contactSupportText}>
            For any queries, please contact support.
          </Text>
        </View>
      </View>
    );
  }

  const selectedProductNames = selectedProducts.map((p) =>
    p.name.toLowerCase()
  );

  const filteredTasks = dummyTasks.filter((task) =>
    selectedProductNames.some((product) =>
      task.device.toLowerCase().includes(product.split(" ")[0])
    )
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "urgent":
        return "#ff3b30";
      case "scheduled":
        return "#34c759";
      default:
        return "#fd7e14";
    }
  };

  const getServiceTypeColor = (serviceType) => {
    return serviceType === "Home Repair" ? "#fd7e14" : "#007bff";
  };

  const getPaymentStatusColor = (status) => {
    return status === "Paid" ? "#34c759" : "#ff9500";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Tasks</Text>
        <Text style={styles.subtitle}>
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}{" "}
          found
        </Text>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("OrderDetails", { task: item })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                <View
                  style={[
                    styles.serviceTypeBadge,
                    { borderColor: getServiceTypeColor(item.serviceType) },
                  ]}
                >
                  <Text
                    style={[
                      styles.serviceTypeText,
                      { color: getServiceTypeColor(item.serviceType) },
                    ]}
                  >
                    {item.serviceType}
                  </Text>
                </View>
              </View>
              <View style={styles.customerContainer}>
                <MaterialIcons name="person" size={20} color="#fd7e14" />
                <Text style={styles.customerName}>{item.customer}</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <MaterialIcons name="devices" size={18} color="#fd7e14" />
                <Text style={styles.infoText}>
                  {item.device} • {item.brand}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons name="error-outline" size={18} color="#fd7e14" />
                <Text style={styles.infoText}>{item.issue}</Text>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.timeContainer}>
                  <View style={styles.timeBadge}>
                    <MaterialIcons
                      name="calendar-today"
                      size={14}
                      color="#fd7e14"
                    />
                    <Text style={styles.timeText}>{item.date}</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <MaterialIcons
                      name="access-time"
                      size={14}
                      color="#fd7e14"
                    />
                    <Text style={styles.timeText}>{item.timeSlot}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment" size={50} color="#fd7e14" />
            <Text style={styles.emptyText}>No tasks available</Text>
            <Text style={styles.emptySubtext}>
              Select different products to see more tasks
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    backgroundColor: "#fff8f0",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ffe8cc",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  serviceTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  serviceTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  customerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  cardContent: {
    padding: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#444",
    marginLeft: 8,
    flexShrink: 1,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  timeContainer: {
    flexDirection: "row",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  timeText: {
    fontSize: 13,
    color: "#fd7e14",
    marginLeft: 4,
    fontWeight: "500",
  },
  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  paymentText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  pendingVerificationBox: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 10,
    margin: 16,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  pendingVerificationText: {
    color: "#FF9800",
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  contactSupportText: {
    color: "#FF9800",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default TaskScreen;
