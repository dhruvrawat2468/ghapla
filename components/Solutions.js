import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Update these paths to match your actual image locations
const services = [
  {
    id: "1",
    icon: require("../assets/images/phone_icon.png"), // Update path
    name: "Mobile Phone/Tablet",
  },
  {
    id: "2",
    icon: require("../assets/images/television_icon.png"), // Update path
    name: "Television",
  },
  {
    id: "3",
    icon: require("../assets/images/air-conditioner.png"), // Update path
    name: "Air Conditioner",
  },
  {
    id: "4",
    icon: require("../assets/images/oven.png"), // Update path
    name: "Microwave/Oven",
  },
  {
    id: "5",
    icon: require("../assets/images/refrigerator.png"), // Update path
    name: "Fridge",
  },
  {
    id: "6",
    icon: require("../assets/images/laptop_icon.png"), // Update path
    name: "Laptop/PC",
  },
];

const SolutionsComponent = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#FFF7E6", "#FFE4B2"]} //"#Fff3db", "#fff3db"
      start={{ x: 0.8, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.outerContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>⏰Repair within Hours</Text>
        <View style={styles.underline} />

        <View style={styles.gridContainer}>
          <FlatList
            data={services}
            numColumns={3}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  navigation.navigate("ProductDetails", {
                    productName: item.name,
                  })
                }
              >
                <View style={styles.circle}>
                  <Image
                    source={item.icon}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.serviceName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: -5,
    color: "#575656",
    fontFamily: "Poppins-BoldItalic",
  },
  gridContainer: {
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    width: width / 3.5,
    alignItems: "center",
    marginVertical: 10,
  },
  circle: {
    width: 82,
    height: 82,
    borderRadius: 50,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  iconImage: {
    width: 50, // Same size as your original icons
    height: 50,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    color: "#595959",
    textAlign: "center",
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: "#Fd7e14",
    marginTop: 10,
    borderRadius: 2,
    marginBottom: 8,
  },
});

export default SolutionsComponent;
