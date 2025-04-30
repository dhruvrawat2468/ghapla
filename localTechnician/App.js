import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet, Alert, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Products from "./components/Product";
import OrderHistory from "./components/OrderHistory";
import Task from "./components/Task";
import HeaderScreen from "./screens/HeaderScreen";
import OrderDetailsScreen from "./screens/OrderDetailScreen";
import TaskDetailScreen from "./screens/TaskDetailsScreen";
import Profile from "./components/Profile";
import Payouts from "./screens/Payout";

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
  if (technician.overallStatus !== "Verified") {
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

// Main App with ProductProvider and TechnicianProvider
export default function App() {
  return (
    <ProductProvider>
      <TechnicianProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
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
          (technician.overallStatus !== "Verified" || !technician.isOnline)
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
