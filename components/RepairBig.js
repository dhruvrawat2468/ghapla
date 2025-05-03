import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

const { width } = Dimensions.get("window");

const cards = [
  { id: "1", image: require("../assets/images/phone.png"), label: "Up to 40% off", name: "Mobile Phone/Tablet" },
  { id: "2", image: require("../assets/images/RO.png"), label: "Exclusive", name: "RO" },
  { id: "3", image: require("../assets/images/lap.png"), label: "Up to 30% off", name: "Laptop/PC" },
  { id: "4", image: require("../assets/images/induction.png"), label: "Up to 50% off", name: "Induction" },
  { id: "5", image: require("../assets/images/tv.png"), label: "Up to 20% off", name: "Television" },
  { id: "6", image: require("../assets/images/washing.png"), label: "Up to 35% off", name: "Washing Machine" },
  { id: "7", image: require("../assets/images/microwave.png"), label: "Up to 35% off", name: "Microwave/Oven" },
];


const AnimatedCarousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const navigation = useNavigation(); // Initialize navigation
  const [data] = React.useState([...cards, ...cards, ...cards]);

  useEffect(() => {
    let offset = width * 0.28 * cards.length;
    flatListRef.current?.scrollToOffset({ offset, animated: false });

    const autoScroll = () => {
      offset += width * 0.28;
      if (offset >= width * 0.28 * cards.length * 2) {
        offset = width * 0.28 * cards.length;
        flatListRef.current?.scrollToOffset({ offset, animated: false });
      }
      flatListRef.current?.scrollToOffset({ offset, animated: true });
    };

    const interval = setInterval(autoScroll, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Repair Big, Save Bigger</Text>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width * 0.28,
            index * width * 0.28,
            (index + 1) * width * 0.28,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95],
            extrapolate: "clamp",
          });

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetails", { productName: item.name })}
            >
              <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                <View style={styles.goldFrame}>
                  <Image source={item.image} style={styles.image} />
                </View>
                <Text style={styles.label}>{item.label}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingBottom:50,
  },
  headingContainer: {
    backgroundColor: "#fff3e0",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f2962c",
    marginBottom: 10,
  },
  heading: {
    color: "#565656",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    width: width * 0.28,
    height: 140,
    backgroundColor: "#f5e6b5",
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  label: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "white",
    color: "black",
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 3,
    fontWeight: "bold",
  },
});

export default AnimatedCarousel;
