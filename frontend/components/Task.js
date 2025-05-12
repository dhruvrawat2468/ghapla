import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ProductContext } from "../context/ProductContext";
import { TechnicianContext } from "../context/TechnicianContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskScreen = () => {
  const navigation = useNavigation();
  const { selectedProducts } = useContext(ProductContext);
  const { technician } = useContext(TechnicianContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the auth token
        const token = await AsyncStorage.getItem('technicianToken');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        // Fetch orders for the technician
        const response = await fetch(`http://192.168.1.13:7000/api/orders/technician/${technician.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.status}`);
        }

        const data = await response.json();

        // Transform the data to match the expected format
        const formattedTasks = data.map(order => ({
          id: order._id,
          customer: order.userId?.name || 'Customer',
          device: order.applianceName,
          brand: order.brandName,
          issue: order.issue || 'Not specified',
          timeSlot: `${order.serviceFromTime} - ${order.serviceToTime}`,
          date: new Date(order.serviceDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          address: order.address?.street || 'Address not available',
          status: order.status || 'New',
          serviceType: order.type === 'Home Repair' ? 'Home Repair' : 'Pickup & Drop',
          phone: order.userId?.mobile || '',
          orderId: order._id
        }));

        setTasks(formattedTasks);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (technician.id && technician.isOnline && technician.overallStatus === "verified") {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [technician.id, technician.isOnline, technician.overallStatus]);

  // Check if technician is verified
  if (technician.overallStatus !== "verified") {
    return (
      <View style={styles.container}>
        <View style={styles.statusMessageBox}>
          <MaterialCommunityIcons
            name="alert-outline"
            size={32}
            color="#FF9800"
          />
          <Text style={styles.statusMessageTitle}>
            Profile Under Verification
          </Text>
          <Text style={styles.statusMessageText}>
            You cannot view tasks until your profile is verified by our team.
          </Text>
          <Text style={styles.contactSupportText}>
            Contact support if you have questions
          </Text>
        </View>
      </View>
    );
  }

  // Check if technician is online
  if (!technician.isOnline) {
    return (
      <View style={styles.container}>
        <View style={styles.statusMessageBox}>
          <MaterialCommunityIcons name="wifi-off" size={32} color="#FF9800" />
          <Text style={styles.statusMessageTitle}>You're Offline</Text>
          <Text style={styles.statusMessageText}>
            Switch to online mode to view and accept tasks
          </Text>
          <Text style={styles.contactSupportText}>
            Use the toggle in the header to go online
          </Text>
        </View>
      </View>
    );
  }

  // Show loading indicator
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#fd7e14" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  // Show error message
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.statusMessageBox}>
          <MaterialCommunityIcons name="alert-circle" size={32} color="#FF9800" />
          <Text style={styles.statusMessageTitle}>Error Loading Tasks</Text>
          <Text style={styles.statusMessageText}>{error}</Text>
          <Text style={styles.contactSupportText}>
            Please try again later or contact support
          </Text>
        </View>
      </View>
    );
  }

  const selectedProductNames = selectedProducts.map((p) =>
    p.name.toLowerCase()
  );

  // Filter tasks based on selected products
  const filteredTasks = selectedProducts.length > 0
    ? tasks.filter((task) =>
        selectedProductNames.some((product) =>
          task.device.toLowerCase().includes(product.split(" ")[0])
        )
      )
    : tasks;

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Tasks</Text>
        <Text style={styles.subtitle}>
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
          {selectedProducts.length > 0 &&
            ` for ${selectedProducts.length} selected product${
              selectedProducts.length !== 1 ? "s" : ""
            }`}
        </Text>
      </View>

      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("OrderDetails", { task: item })
              }
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
                  <MaterialIcons
                    name="error-outline"
                    size={18}
                    color="#fd7e14"
                  />
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
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="tools" size={50} color="#fd7e14" />
          <Text style={styles.emptyText}>
            {selectedProducts.length > 0
              ? "No matching tasks found"
              : "No tasks available"}
          </Text>
          <Text style={styles.emptySubtext}>
            {selectedProducts.length > 0
              ? "Try selecting different products"
              : "Select products you can service to see tasks"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
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
    padding: 16,
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
  statusMessageBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF3E0",
    margin: 20,
    borderRadius: 10,
  },
  statusMessageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9800",
    marginTop: 16,
    marginBottom: 8,
  },
  statusMessageText: {
    fontSize: 16,
    color: "#FF9800",
    textAlign: "center",
    marginBottom: 8,
  },
  contactSupportText: {
    fontSize: 14,
    color: "#FF9800",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
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
  refreshButton: {
    backgroundColor: "#fd7e14",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default TaskScreen;
