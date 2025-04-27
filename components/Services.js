import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

// Services Component: Displays available repair services
const Services = ({navigation}) => {
  
  return (
    <LinearGradient colors={["#fff3db", "#FFFFFF"]} style={styles.gradientBackground}>
      <View style={styles.container}>
        <Text style={styles.title}>Our Services</Text>
        <View style={styles.underline} />
        <View style={styles.servicesContainer}>
          {/* Home Repair Service Button */}
          <TouchableOpacity
            style={styles.serviceButton}
            onPress={() => navigation.navigate("ProductDetails")}
          >
            <Image
              source={require("../assets/images/repairservices.png")}
              style={styles.image}
            />
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>

          {/* Pickup Repair Service Button */}
          <TouchableOpacity
            style={styles.serviceButton}
            onPress={() => navigation.navigate("ProductDetails")}
          >
            <Image
              source={require("../assets/images/pickupservices.png")}
              style={styles.image}
            />
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    marginTop: -70, // Overlaps slightly with content above
    marginBottom: 0,
  },
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#575656",
    textTransform: "uppercase",
    fontStyle: "italic",
    textAlign: "center",
  },
  underline: {
    width: 50,
    height: 4,
    backgroundColor: "#FFA500",
    marginVertical: 10,
    borderRadius: 2,
  },
  servicesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  serviceButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 170,
    height: 160,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
});

export default Services;