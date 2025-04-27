import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const BottomTabNavigator = ({ navigation }) => {
  const route = useRoute(); // Get the current route

  // Determine the active screen based on the route name
  const isActive = (screen) => route.name === screen;

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeMain")}
        style={styles.tabButton}
      >
        <FontAwesome5
          name="home"
          size={24}
          color={isActive("HomeMain") ? "#fd7e14" : "#575757"}
        />
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.tabButton}
      >
        <FontAwesome5
          name="user-circle"
          size={24}
          color={isActive("Profile") ? "#fd7e14" : "#575757"}
        />
      </TouchableOpacity>

      {/* History Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("History")}
        style={styles.tabButton}
      >
        <Ionicons
          name="time-outline"
          size={26}
          color={isActive("History") ? "#fd7e14" : "#575757"}
        />
      </TouchableOpacity>

      {/* Login Button (assuming this was meant to be different from History) */}
      <TouchableOpacity
        onPress={() => navigation.navigate("OtpLogin")}
        style={styles.tabButton}
      >
        <Ionicons
          name="log-in-outline" // Changed icon to better represent login
          size={24}
          color={isActive("LoginA") ? "#fd7e14" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 2,
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5, // Add shadow for Android
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    alignItems: "center",
    padding: 8,
  },
});

export default BottomTabNavigator;
