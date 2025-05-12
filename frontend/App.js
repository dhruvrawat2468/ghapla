import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet, Alert, Text, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Products from "./components/Product";
import OrderHistory from "./components/OrderHistory";
import Task from "./components/Task";
import HeaderScreen from "./screens/HeaderScreen";
import OrderDetailsScreen from "./screens/OrderDetailScreen";
import TaskDetailScreen from "./screens/TaskDetailsScreen";
import Profile from "./components/Profile";
import Payouts from "./screens/Payout";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import OtpLoginScreen from "./screens/OtpLoginScreen";

import { ProductProvider } from "./context/ProductContext";
import {
  TechnicianProvider,
  TechnicianContext,
} from "./context/TechnicianContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Task Stack Navigator
const TaskStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TaskMain"
      component={TaskScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="OrderDetails"
      component={OrderDetailsScreen}
      options={{
        title: "Order Details",
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#fd7e14",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />
    <Stack.Screen
      name="TaskDetailScreen"
      component={TaskDetailScreen}
      options={{
        title: "Task Detail",
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#fd7e14",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    />
  </Stack.Navigator>
);

// Each Screen with HeaderScreen
const TaskScreen = () => {
  const { technician } = useContext(TechnicianContext);

  // If technician is not verified, show a message instead of tasks
  if (technician.overallStatus !== "verified") {
    return (
      <View style={styles.container}>
        <HeaderScreen />
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

  return (
    <View style={styles.container}>
      <HeaderScreen />
      <Task />
    </View>
  );
};

const ProductsScreen = () => (
  <View style={styles.container}>
    <Products />
  </View>
);

const OrderHistoryScreen = () => (
  <View style={styles.container}>
    <HeaderScreen />
    <OrderHistory />
  </View>
);

const ProfileScreen = () => (
  <View style={styles.container}>
    <HeaderScreen />
    <Profile />
  </View>
);

const PayoutsScreen = () => (
  <View style={styles.container}>
    <HeaderScreen />
    <Payouts />
  </View>
);

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="SignupScreen" component={SignupScreen} />
    <Stack.Screen name="OtpLoginScreen" component={OtpLoginScreen} />
  </Stack.Navigator>
);

// Main Stack Navigator
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={TabNavigator} />
  </Stack.Navigator>
);

// Main App component
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { technician, setTechnician } = useContext(TechnicianContext);

  // Create a function to handle logout that can be passed to components
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Reset technician to default state
    setTechnician({
      id: "tech123",
      name: "Rajesh Kumar",
      age: 32,
      gender: "Male",
      email: "rajesh.kumar@example.com",
      mobile: "+91 9876543210",
      accountNumber: "123456789012",
      bankName: "State Bank of India",
      ifscCode: "SBIN0001234",
      aadhaarNumber: "1234 5678 9012",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
      aadhaarVerified: false,
      bankVerified: false,
      identityVerified: false,
      overallStatus: "not verified",
      technicianType: "inhouse",
      isOnline: false,
    });
  };

  // This effect will run whenever the technician context changes
  // If the technician has an ID, they are logged in
  useEffect(() => {
    if (technician && technician.id && technician.id !== "tech123") {
      setIsLoggedIn(true);
    }
  }, [technician]);

  // Make handleLogout available in the technician context
  useEffect(() => {
    if (setTechnician) {
      setTechnician(prev => ({
        ...prev,
        handleLogout
      }));
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('technicianToken');

        if (token) {
          // Fetch technician profile
          // Create a timeout promise
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), 10000)
          );

          // Race the fetch against the timeout
          const response = await Promise.race([
            fetch('http://192.168.1.13:7000/auth/technician/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }),
            timeout
          ]);

          if (response.ok) {
            const technicianData = await response.json();

            // Update technician context
            setTechnician({
              id: technicianData._id,
              name: technicianData.name,
              email: technicianData.email,
              mobile: technicianData.mobile,
              address: technicianData.address,
              gender: technicianData.gender,
              age: technicianData.age,
              overallStatus: technicianData.verification || "not verified", // Use verification status from backend
              isOnline: false,
              technicianType: technicianData.technicianType || "inhouse", // Use technician type from backend
              userPhoto: technicianData.userPhoto, // Include user photo ID
              profileImage: technicianData.userPhoto ?
                `http://192.168.1.13:7000/api/image/${technicianData.userPhoto}` :
                "https://randomuser.me/api/portraits/men/32.jpg", // Set profile image URL
              // Add verification flags
              bankVerified: technicianData.bankVerified || false,
              aadhaarVerified: technicianData.aadhaarVerified || false,
              panVerified: technicianData.panVerified || false,
              identityVerified: technicianData.identityVerified || false,
              // Add other fields that might be needed
              accountNumber: technicianData.accountNumber || "Not provided",
              bankName: technicianData.bankName || "Not provided",
              ifscCode: technicianData.ifscCode || "Not provided",
              aadhaarNumber: technicianData.aadhaarNumber || "Not provided",
              panNumber: technicianData.panNumber || "Not provided",
            });

            setIsLoggedIn(true);
          } else {
            // Token invalid, clear it
            await AsyncStorage.removeItem('technicianToken');
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);

        // Clear token if there was a network error or authentication error
        if (error.message && (
            error.message.includes('Network request failed') ||
            error.message.includes('timed out') ||
            error.message.includes('Unauthorized')
        )) {
          await AsyncStorage.removeItem('technicianToken');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ff7f00" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Main App with ProductProvider and TechnicianProvider
export default function App() {
  return (
    <ProductProvider>
      <TechnicianProvider>
        <AppContent />
      </TechnicianProvider>
    </ProductProvider>
  );
}

// Tab Navigator Component (Updated with Payouts visibility control)
const TabNavigator = () => {
  const { technician } = useContext(TechnicianContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Task") {
            iconName = focused ? "clipboard-text" : "clipboard-text-outline";
          } else if (route.name === "Products") {
            iconName = focused ? "package-variant" : "package-variant-closed";
          } else if (route.name === "Order History") {
            iconName = "history";
          } else if (route.name === "Profile") {
            iconName = focused ? "account" : "account-outline";
          } else if (route.name === "Payouts") {
            iconName = focused ? "cash-multiple" : "cash";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#fd7e14",
        tabBarInactiveTintColor: "#575757",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0.5,
          borderTopColor: "#ddd",
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
        // Disable Task tab if not verified
        // tabBarButton:
        //   route.name === "Task" && technician.overallStatus !== "Verified"
        //     ? () => {
        //         return (
        //           <View style={styles.disabledTab}>
        //             <MaterialCommunityIcons
        //               name="clipboard-text-outline"
        //               size={24}
        //               color="#ccc"
        //             />
        //             <Text style={styles.disabledTabText}>Task</Text>
        //           </View>
        //         );
        //       }
        //     : undefined,
        tabBarButton:
          route.name === "Task" &&
          (technician.overallStatus !== "verified" || !technician.isOnline)
            ? () => (
                <View style={styles.disabledTab}>
                  <MaterialCommunityIcons
                    name="clipboard-text-outline"
                    size={24}
                    color="#ccc"
                  />
                  <Text style={styles.disabledTabText}>Task</Text>
                </View>
              )
            : undefined,
      })}
    >
      <Tab.Screen name="Task" component={TaskStack} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Order History" component={OrderHistoryScreen} />
      {/* Show Payouts tab ONLY for local technicians */}
      {technician.technicianType === "local" && (
        <Tab.Screen name="Payouts" component={PayoutsScreen} />
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  screenContent: {
    paddingBottom: 20,
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
  disabledTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  disabledTabText: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 4,
  },
});
