import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.43;
const ICON_SIZE = CARD_WIDTH * 0.4;

const Services = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const services = [
    {
      id: 1,
      title: "Home Repair",
      subtitle: "At your doorstep",
      icon: (
        <Image
          source={require("../assets/images/home_repair.png")} // Update path as needed
          style={{ width: 80, height: 60 }}
          resizeMode="contain"
        />
      ),
      category: "Home Repair",
      gradient: ["#FFF", "#FFf"],
    },
    {
      id: 2,
      title: "Pickup & Drop",
      subtitle: "Convenient service",
      icon: (
        <Image
          source={require("../assets/images/pickup.png")} // Update path as needed
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
          resizeMode="contain"
        />
      ),
      category: "Pickup & Drop",
      gradient: ["#FFF", "#FFf"],
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#FFF7E6", "#FFE4B2"]} //"#f8f9fa", "#ffffff"
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Our Services</Text>
            <View style={styles.underline} />
            <Text style={styles.subtitle}>
              Choose your preferred service type
            </Text>
          </View>

          <View style={styles.servicesContainer}>
            {services.map((service, index) => (
              <Animated.View
                key={service.id}
                style={[
                  { opacity: fadeAnim },
                  {
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50 * (index + 1), 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.serviceCard}
                  onPress={() =>
                    navigation.navigate("ProductList", {
                      category: service.category,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={service.gradient}
                    style={styles.cardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.iconContainer}>{service.icon}</View>
                    <View style={styles.textContainer}>
                      <Text style={styles.serviceTitle}>{service.title}</Text>
                      <Text style={styles.serviceSubtitle}>
                        {service.subtitle}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    paddingTop: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#575757",
    fontFamily: "Roboto",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#636e72",
    marginTop: 8,
    fontWeight: "500",
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: "#FF7600",
    borderRadius: 4,
    marginVertical: 12,
  },
  servicesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  serviceCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    marginBottom: 24,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardGradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: CARD_WIDTH * 1.2,
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    width: ICON_SIZE * 1.2,
    height: ICON_SIZE * 1.2,
    borderRadius: ICON_SIZE * 0.6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textContainer: {
    alignItems: "center",
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 4,
    textAlign: "center",
  },
  serviceSubtitle: {
    fontSize: 14,
    color: "#636e72",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Services;

// ... rest of your component remains the same ...
