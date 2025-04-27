import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabNavigator from "./BottomTabNavigator";
//NOTE-THIS IS THE HAMBURGER MENU AND BOTTOM TAB NAVIGATOR THAT REMAINS ON EVERY PAGE

const MainLayout = ({ navigation, children }) => {
  return (
    <View style={{ flex: 1 }}>
      {/* Upper Navbar */}
      <View style={styles.upper}></View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FixDukaan</Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#f76a06" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Bottom Tab Navigator */}
      <BottomTabNavigator navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  upper: {
    height: 5,
    backgroundColor: "#ffffff",
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
    marginTop: 20,
  },
});

export default MainLayout;
