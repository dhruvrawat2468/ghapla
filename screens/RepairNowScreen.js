import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import CarouselImageComponent from "../components/CarouselImageComponent";
import OurServices from "../components/OurServices";
import SolutionsComponent from "../components/Solutions";
import RepairBig from "../components/RepairBig";
import Reviews from "../components/Reviews";
import { Ionicons } from "@expo/vector-icons";

const RepairNowScreen = () => {
  const [backendLocation, setBackendLocation] = useState(null);

  useEffect(() => {
    // Example: Simulate fetching location from backend after 1 second
    setTimeout(() => {
      setBackendLocation("");
    }, 1000);
  }, []);

  const address = backendLocation || "Location";

  return (
    <ScrollView style={styles.container}>
      {/* Header with location */}
      <View style={styles.header}>
        <Ionicons name="location-sharp" size={20} color="#FF7600" />
        <Text style={styles.headerText}>{address}</Text>
      </View>

      {/* Carousel Section */}
      <View style={styles.carouselWrapper}>
        <CarouselImageComponent />
      </View>

      {/* Our Services Section */}
      <View style={styles.servicesWrapper}>
        <OurServices />
      </View>

      {/* Repair at your fingertips */}
      <View style={styles.solutionWrapper}>
        <SolutionsComponent />
      </View>

      {/* Repair Big */}
      <View style={styles.solutionWrapper}>
        <RepairBig />
      </View>

      {/* Reviews */}
      <View style={styles.solutionWrapper}>
        <Reviews />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#575757",
    fontWeight: "600",
    flex: 1,
  },
  carouselWrapper: {
    height: 255,
    alignItems: "center",
  },
  servicesWrapper: {
    marginTop: 10,
  },
  solutionWrapper: {
    marginTop: -40,
  },
});

export default RepairNowScreen;
