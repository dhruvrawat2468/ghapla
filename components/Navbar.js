import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importing icons from Expo

export default function Navbar() {
  return (
    <View>
      {/* Orange Header */}
      <View style={styles.topHeader} />

      {/* White Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.title}>Fixdukaan</Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#FF6F00" /> 
          {/* Orange Hamburger Icon */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    height: 30,
    backgroundColor: "white", // Orange header
  },
  navbar: {
    height: 60,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6F00", // Orange text for "Fixdukaan"
  },
});
