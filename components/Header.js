import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "./SearchBar";

// Text carousel options for dynamic header message
const textCarousel = [
  "Payment After Repair",
  "Hassle-Free Doorstep Repair",
  "Fast and Affordable",
  "Verified Technicians",
];

// Image carousel corresponding to text messages
const imageCarousel = [
  require("../assets/images/1fridge.png"),
  require("../assets/images/1tv.png"),
  require("../assets/images/1phone.png"),
  require("../assets/images/1laptop.png"),
];

const Header = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSearch, setSelectedSearch] = useState("");
  const navigation = useNavigation();

  // Function to cycle through carousel images and text
  const updateCarousel = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % textCarousel.length);
  }, []);

  // Auto-update carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(updateCarousel, 3000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [updateCarousel]);

  const handleRepairNowPress = () => {
    navigation.navigate("RepairNow");
  };

  return (
    <LinearGradient colors={["#fae2b1", "#FFFFFF"]} style={styles.container}>
      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>Electronic Device</Text>
        <Text style={styles.mainText}>Repair</Text>
        <Text style={styles.subText}>{textCarousel[currentIndex]}</Text>
      </View>

      {/* Rotating Image */}
      <Image source={imageCarousel[currentIndex]} style={styles.image} />

      {/* Search Bar */}
      <SearchBar onSearchSelect={setSelectedSearch} />

      {/* Image Row with Button */}
      <View style={styles.imageRow}>
        <Image
          source={require("../assets/images/delivery.png")}
          style={styles.sideImage}
        />
        <TouchableOpacity style={styles.button} onPress={handleRepairNowPress}>
          <LinearGradient
            colors={["#FFA500", "#FF7600"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              REPAIR NOW
              <Text style={styles.arrow}> {">>"}</Text>
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Image
          source={require("../assets/images/customm.png")}
          style={styles.customImage} // Separate style for customm.png
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 430,
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "relative",
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },
  textContainer: {
    position: "absolute",
    top: 35,
    left: 20,
  },
  mainText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    fontFamily: "Fredoka",
    textShadowColor: "#FFA500",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subText: {
    fontSize: 18,
    color: "#555555",
    marginBottom: 5,
  },
  image: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  button: {
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 3,
    borderColor: "#FFA500",
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrow: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 20,
    bottom: 75,
    width: "100%", // Contain within parent width
  },
  sideImage: {
    width: 130, // Reduced from 130 to fit better
    height: 140, // Reduced proportionally from 135
    resizeMode: "contain",
  },
  customImage: {
    width: 130, // Reduced size for customm.png to fit
    height: 145,
    resizeMode: "contain",
  },
});

export default Header;
