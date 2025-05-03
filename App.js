import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import "react-native-reanimated";

import ProfileScreen from "./components/ProfileScreen";
import EditProfileScreen from "./components/EditProfileScreen";
import TrackingStatusScreen from "./screens/TrackingStatusScreen";
import CurrentOrder from "./components/CurrentOrder";
import ProductListScreen from "./screens/ProductListScreen";
import TrackingStatusScreen1 from "./screens/TrackinStatusScreen1";
import SearchScreen from "./components/SearchScreen";
import RepairHistoryScreen from "./components/RepairHistoryScreen";
import CarouselComponent from "./components/Carousel";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import TrackingScreen from "./screens/TrackingScreen";
import MainLayout from "./components/MainLayout";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import OtpLoginScreen from "./screens/OtpLoginScreen";
import RepairNowScreen from "./screens/RepairNowScreen";
import ProductDetailsScreen from "./screens/ProductDetail";
import FrontPage from "./screens/FrontPage";
import OurServices from "./components/OurServices";
import ReviewScreen from "./screens/ReviewScreen";
import ComplaintScreen from "./screens/ComplaintScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Wrapper for MainLayout
const withMainLayout = (ScreenComponent) => {
  const WrappedComponent = (props) => (
    <MainLayout {...props}>
      <ScreenComponent {...props} />
    </MainLayout>
  );
  WrappedComponent.displayName = `withMainLayout(${ScreenComponent.name || "Anonymous"})`;
  return WrappedComponent;
};

// Combined Stack Navigator with conditional initial route
const HomeStack = () => {
  const { userToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state until auth data is resolved
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Assume auth data is loaded after a short delay
    }, 1000); // Adjust delay as needed based on your app's performance
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const initialRoute = userToken ? "HomeMain" : "Signup";

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signup" component={withMainLayout(SignupScreen)} />
      <Stack.Screen name="HomeMain" component={withMainLayout(RepairNowScreen)} />
      <Stack.Screen name="Search" component={withMainLayout(SearchScreen)} />
      <Stack.Screen name="Carousel" component={withMainLayout(CarouselComponent)} />
      <Stack.Screen name="History" component={withMainLayout(RepairHistoryScreen)} />
      <Stack.Screen name="LoginA" component={withMainLayout(LoginScreen)} />
      <Stack.Screen name="CurrentOrder" component={withMainLayout(CurrentOrder)} />
      <Stack.Screen name="OtpLogin" component={withMainLayout(OtpLoginScreen)} />
      <Stack.Screen name="RepairNow" component={withMainLayout(RepairNowScreen)} />
      <Stack.Screen name="ProductList" component={withMainLayout(ProductListScreen)} />
      <Stack.Screen name="PickupRepair" component={withMainLayout(TrackingStatusScreen1)} />
      <Stack.Screen name="HomeRepair" component={withMainLayout(TrackingStatusScreen)} />
      <Stack.Screen name="OurServices" component={withMainLayout(OurServices)} />
      <Stack.Screen name="ProductDetails" component={withMainLayout(ProductDetailsScreen)} />
      <Stack.Screen name="Profile" component={withMainLayout(ProfileScreen)} />
      <Stack.Screen name="EditProfile" component={withMainLayout(EditProfileScreen)} />
      <Stack.Screen name="FrontPage" component={withMainLayout(FrontPage)} />
      <Stack.Screen name="ReviewScreen" component={withMainLayout(ReviewScreen)} />
      <Stack.Screen name="ComplaintScreen" component={withMainLayout(ComplaintScreen)} />
    </Stack.Navigator>
  );
};

// Custom Drawer Content
const CustomDrawerContent = (props) => (
  <View style={styles.drawerContainer}>
    <View style={styles.drawerHeader}>
      <Image source={require("./assets/service-tools.png")} style={styles.logo} />
      <Text style={styles.drawerTitle}>FixDukaan</Text>
    </View>
    <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate("Home")}>
      <Ionicons name="information-circle-outline" size={22} color="grey" />
      <Text style={styles.drawerText}>About Us</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate("Contact")}>
      <Ionicons name="mail-outline" size={22} color="grey" />
      <Text style={styles.drawerText}>Contact Us</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.drawerItem} onPress={() => Linking.openURL("tel:+911234567890")}>
      <Ionicons name="call-outline" size={22} color="grey" />
      <Text style={styles.drawerText}>Call Us</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.drawerItem} onPress={() => Linking.openURL("https://fixdukaan.in/")}>
      <Ionicons name="globe-outline" size={22} color="grey" />
      <Text style={styles.drawerText}>Website</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.drawerItem} onPress={() => props.navigation.navigate("Help")}>
      <Ionicons name="help-circle-outline" size={22} color="grey" />
      <Text style={styles.drawerText}>Help</Text>
    </TouchableOpacity>
  </View>
);

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{ headerShown: false, drawerPosition: "right" }}
  >
    <Drawer.Screen name="Home" component={HomeStack} />
    <Drawer.Screen name="Profile" component={withMainLayout(ProfileScreen)} />
    <Drawer.Screen name="EditProfile" component={EditProfileScreen} />
    <Drawer.Screen name="RepairNow" component={RepairNowScreen} />
    <Drawer.Screen name="Tracking" component={TrackingScreen} />
    <Drawer.Screen name="HomeRepair" component={TrackingStatusScreen} />
    <Drawer.Screen name="OurServices" component={OurServices} />
  </Drawer.Navigator>
);

// Main App
export default function App() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

// Styles (unchanged)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upper: {
    height: 35,
    backgroundColor: "#f76a06",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "100%",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#f76a06",
  },
  frontPageContainer: {
    flex: 1,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  drawerHeader: {
    backgroundColor: "#f76a06",
    paddingTop: 40,
    paddingBottom: 15,
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 18,
    marginTop: 8,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  drawerText: {
    fontSize: 13,
    marginLeft: 15,
    color: "#444",
    fontWeight: "bold",
  },
});