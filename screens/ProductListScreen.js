import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const ProductListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Temporary mock data instead of API
    const mockDevices = [
      { name: "AC", serviceMode: "Home Repair" },
      { name: "Fridge", serviceMode: "Pickup & Drop" },
      { name: "Laptop", serviceMode: "Home Repair" },
      { name: "Television", serviceMode: "Home Repair" },
      { name: "Microwave", serviceMode: "Pickup & Drop" },
      { name: "Washing Machine", serviceMode: "Home Repair" },
      { name: "Mobile Phone", serviceMode: "Pickup & Drop" },
      { name: "Geyser", serviceMode: "Home Repair" },
    ];

    const mappedProducts = mockDevices.reduce((acc, device) => {
      const appCategory = device.serviceMode;
      const existing = acc.find((d) => d.name === device.name);
      if (existing) {
        if (!existing.categories.includes(appCategory)) {
          existing.categories.push(appCategory);
        }
      } else {
        acc.push({
          name: device.name,
          categories: [appCategory],
          image: getImageForDevice(device.name),
        });
      }
      return acc;
    }, []);

    setProducts(mappedProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, fadeAnim]);

  const getImageForDevice = (name) => {
    const imageMap = {
      AC: require("../assets/images/1ac.png"),
      "Air Conditioner": require("../assets/images/1ac.png"),
      Fridge: require("../assets/images/fridge.png"),
      Geyser: require("../assets/images/1geyser.png"),
      "Washing Machine": require("../assets/images/1washing.png"),
      RO: require("../assets/images/RO.png"),
      "Water Purifier": require("../assets/images/RO.png"),
      "Mobile Phone": require("../assets/images/phone.png"),
      "Laptop/PC": require("../assets/images/laptop.png"),
      Laptop: require("../assets/images/laptop.png"),
      TV: require("../assets/images/1tv.png"),
      Television: require("../assets/images/1tv.png"),
      "Microwave/Oven": require("../assets/images/microwave.png"),
      Microwave: require("../assets/images/microwave.png"),
      Induction: require("../assets/images/induction.png"),
    };
    return imageMap[name] || require("../assets/images/user2.png");
  };

  const filteredProducts = products.filter((product) =>
    product.categories.includes(category)
  );

  const renderItem = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            productName: item.name,
            categories: item.categories,
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.productImage} />
          </View>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={20} color="#ED8F03" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={["#f8f9fa", "#e9ecef"]}
          style={styles.loadingContainer}
        >
          <Text style={styles.loadingText}>Loading devices...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#f8f9fa", "#e9ecef"]} style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{category || "Choose Your Product"}</Text>
          <Text style={styles.subHeader}>Select a device to repair</Text>
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#495057",
  },
  headerContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#212529",
    textAlign: "left",
    letterSpacing: 0.5,
  },
  subHeader: {
    fontSize: 16,
    color: "#6c757d",
    marginTop: 4,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 24,
    paddingHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginHorizontal: 4,
  },
  cardContent: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: CARD_WIDTH - 32,
    height: CARD_WIDTH - 32,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    textAlign: "center",
    marginBottom: 8,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(237, 143, 3, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductListScreen;
