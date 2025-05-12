import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// Dummy user
const user = {
  id: "tech123",
  name: "John Doe",
};

// Dummy complaints data
const dummyComplaints = [
  {
    id: 1,
    date: "2023-05-15",
    orderId: "ORD-78945",
    customer: "Sarah Johnson",
    issue: "Technician arrived late",
    status: "resolved",
  },
  {
    id: 2,
    date: "2023-05-18",
    orderId: "ORD-78962",
    customer: "Michael Brown",
    issue: "Service not completed properly",
    status: "pending",
  },
  {
    id: 3,
    date: "2023-05-20",
    orderId: "ORD-78988",
    customer: "Emily Davis",
    issue: "Rude behavior",
    status: "investigating",
  },
];

const Payouts = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const today = new Date();
  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(today.getDate() - 10);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);

  // Initialize dates to be within allowed ranges
  const [selectedDate, setSelectedDate] = useState(today);
  const [startDate, setStartDate] = useState(twoWeeksAgo);
  const [endDate, setEndDate] = useState(today);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [payoutData, setPayoutData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [dateType, setDateType] = useState("start");
  const [loading, setLoading] = useState(true);
  const [showComplaintsModal, setShowComplaintsModal] = useState(false);
  const [complaints, setComplaints] = useState(dummyComplaints);

  useEffect(() => {
    fetchPayoutData();
    fetchPerformanceData();
  }, [selectedDate, startDate, endDate, activeTab]);

  const fetchPayoutData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = {
        id: user.id,
        name: user.name,
        dailyEarnings: calculateDailyEarnings(selectedDate),
        weeklyEarnings: calculateWeeklyEarnings(startDate, endDate),
      };
      setPayoutData(data);
      setLoading(false);
    }, 300);
  };

  const fetchPerformanceData = () => {
    setTimeout(() => {
      const data = {
        activeHours: getActiveHours(),
        ordersCompleted: getOrdersCompleted(),
        complaints: getComplaints(),
        declinedOrders: getDeclinedOrders(),
      };
      setPerformanceData(data);
    }, 300);
  };

  const calculateDailyEarnings = () => Math.floor(Math.random() * 200) + 50;

  const calculateWeeklyEarnings = () => Math.floor(Math.random() * 1400) + 300;

  const getActiveHours = () =>
    activeTab === "daily"
      ? Math.floor(Math.random() * 4) + 6
      : Math.floor(Math.random() * 20) + 30;

  const getOrdersCompleted = () => Math.floor(Math.random() * 10) + 5;
  const getComplaints = () => Math.floor(Math.random() * 3);
  const getDeclinedOrders = () => Math.floor(Math.random() * 5);

  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (!selected) return;

    const now = new Date();
    const minDate = activeTab === "daily" ? tenDaysAgo : twoWeeksAgo;

    if (selected > now) {
      Alert.alert("Invalid Date", "You cannot select a future date");
      return;
    }

    if (selected < minDate) {
      Alert.alert(
        "Invalid Date",
        activeTab === "daily"
          ? "You can only view data from the last 10 days"
          : "You can only view data from the last two weeks"
      );
      return;
    }

    if (activeTab === "daily") {
      setSelectedDate(selected);
    } else {
      if (dateType === "start") {
        // Ensure start date is before end date
        if (selected > endDate) {
          Alert.alert(
            "Invalid Date Range",
            "Start date must be before end date"
          );
          return;
        }
        setStartDate(selected);
      } else {
        // Ensure end date is after start date
        if (selected < startDate) {
          Alert.alert(
            "Invalid Date Range",
            "End date must be after start date"
          );
          return;
        }
        setEndDate(selected);
      }
    }
  };

  const formatDateRange = () => {
    if (activeTab === "daily") {
      return selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } else {
      return `${startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} to ${endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "#4CAF50";
      case "pending":
        return "#FFC107";
      case "investigating":
        return "#2196F3";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Payouts</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {["daily", "weekly"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => {
                setActiveTab(tab);
                setShowDatePicker(false);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date selector */}
        <View style={styles.dateSelector}>
          {activeTab === "daily" ? (
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color="#fd7e14"
              />
              <Text style={styles.dateText}>{formatDateRange()}</Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color="#fd7e14"
              />
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  setDateType("start");
                  setShowDatePicker(true);
                }}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#fd7e14"
                />
                <Text style={styles.dateText}>
                  Start: {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  setDateType("end");
                  setShowDatePicker(true);
                }}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#fd7e14"
                />
                <Text style={styles.dateText}>
                  End: {endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={
              activeTab === "daily"
                ? selectedDate
                : dateType === "start"
                ? startDate
                : endDate
            }
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
            minimumDate={activeTab === "daily" ? tenDaysAgo : twoWeeksAgo}
          />
        )}

        {/* Technician Data */}
        {payoutData && (
          <View style={styles.technicianItem}>
            <Text style={styles.technicianName}>{payoutData.name}</Text>
            <Text style={styles.earningsText}>
              {activeTab === "daily"
                ? `Daily Earnings: $${payoutData.dailyEarnings}`
                : `Weekly Earnings: $${payoutData.weeklyEarnings}`}
            </Text>
          </View>
        )}
      </View>

      {/* Performance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Performance</Text>
        {performanceData && (
          <View style={styles.performanceItem}>
            <View style={styles.metricsContainer}>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons
                  name="clock"
                  size={24}
                  color="#fd7e14"
                />
                <Text style={styles.metricLabel}>Active Hours</Text>
                <Text style={styles.metricText}>
                  {performanceData.activeHours} hrs
                </Text>
              </View>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#4CAF50"
                />
                <Text style={styles.metricLabel}>Orders Completed</Text>
                <Text style={styles.metricText}>
                  {performanceData.ordersCompleted}
                </Text>
              </View>
            </View>
            <View style={styles.metricsContainer}>
              <TouchableOpacity
                style={styles.metricItem}
                onPress={() => setShowComplaintsModal(true)}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={24}
                  color="#FF5722"
                />
                <Text style={styles.metricLabel}>Complaints</Text>
                <Text style={styles.metricText}>
                  {performanceData.complaints}
                </Text>
              </TouchableOpacity>
              <View style={styles.metricItem}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={24}
                  color="#F44336"
                />
                <Text style={styles.metricLabel}>Declined/Missed Orders</Text>
                <Text style={styles.metricText}>
                  {performanceData.declinedOrders}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Complaints Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showComplaintsModal}
        onRequestClose={() => {
          setShowComplaintsModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complaint Details</Text>
              <Pressable
                onPress={() => setShowComplaintsModal(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </Pressable>
            </View>

            {complaints.length > 0 ? (
              <ScrollView style={styles.complaintsList}>
                {complaints.map((complaint) => (
                  <View key={complaint.id} style={styles.complaintItem}>
                    <View style={styles.complaintHeader}>
                      <Text style={styles.complaintOrderId}>
                        Order: {complaint.orderId}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(complaint.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {complaint.status.charAt(0).toUpperCase() +
                            complaint.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.complaintDate}>
                      Date: {complaint.date}
                    </Text>
                    <Text style={styles.complaintCustomer}>
                      Customer: {complaint.customer}
                    </Text>
                    <Text style={styles.complaintIssue}>
                      Issue: {complaint.issue}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noComplaints}>
                <MaterialCommunityIcons
                  name="emoticon-happy-outline"
                  size={40}
                  color="#fd7e14"
                />
                <Text style={styles.noComplaintsText}>
                  No complaints found for this period
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
  section: {
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: "center" },
  activeTab: { backgroundColor: "#fd7e14" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#666" },
  activeTabText: { color: "#fff" },
  dateSelector: { marginBottom: 15 },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 5,
  },
  dateText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  technicianItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
  },
  technicianName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  earningsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fd7e14",
  },
  performanceItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
  },
  metricText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  complaintsList: {
    maxHeight: "80%",
  },
  complaintItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  complaintHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  complaintOrderId: {
    fontWeight: "bold",
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  complaintDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 3,
  },
  complaintCustomer: {
    fontSize: 14,
    marginBottom: 3,
  },
  complaintIssue: {
    fontSize: 14,
    fontStyle: "italic",
  },
  noComplaints: {
    alignItems: "center",
    padding: 20,
  },
  noComplaintsText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default Payouts;
