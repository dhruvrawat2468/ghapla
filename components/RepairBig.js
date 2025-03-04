import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const cards = [
  { id: "1", image: require("../assets/images/phone.png"), label: "Up to 40% off" },
  { id: "2", image: require("../assets/images/RO.png"), label: "Exclusive" },
  { id: "3", image: require("../assets/images/lap.png"), label: "Up to 30% off" },
  { id: "4", image: require("../assets/images/induction.png"), label: "Up to 50% off" },
  { id: "5", image: require("../assets/images/tv.png"), label: "Up to 20% off" },
  { id: "6", image: require("../assets/images/washing.png"), label: "Up to 35% off" },
  { id: "7", image: require("../assets/images/microwave.png"), label: "Up to 35% off" },
];

const AnimatedCarousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [data] = React.useState([...cards, ...cards, ...cards]);

  useEffect(() => {
    let offset = width * 0.28 * cards.length; // Start in the middle
    flatListRef.current?.scrollToOffset({ offset, animated: false });

    const autoScroll = () => {
      offset += width * 0.28; // Move by one card width
      if (offset >= width * 0.28 * cards.length * 2) {
        offset = width * 0.28 * cards.length;
        flatListRef.current?.scrollToOffset({ offset, animated: false });
      }
      flatListRef.current?.scrollToOffset({ offset, animated: true });
    };

    const interval = setInterval(autoScroll, 1500); // Adjust speed as needed
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
            outputRange: [0.95, 1, 0.95], // Subtle scale effect
            extrapolate: "clamp",
          });

          return (
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
              <View style={styles.goldFrame}>
                <Image source={item.image} style={styles.image} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a2540",
    paddingVertical: 15,
  },
  headingContainer: {
    backgroundColor: "#fff3e0",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2b6cb0",
    marginBottom: '10'
  },
  heading: {
    color: "#565656",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  
  },
  card: {
    width: width * 0.28,
    height: 140, // Reduced height
    backgroundColor: "#2b6cb0", // Added background color
    borderRadius: 12,
    marginHorizontal: 5, // Reduced margin for compact layout
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  // goldFrame: {
  //   width: "99%",
  //   height: "99%",
  //   borderRadius: 10,
  //   borderWidth: 3,
  //   borderColor: "#ffd700",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   padding: 5, // Adjusted padding
  //   backgroundColor: "#2b6cb0", // Added background color
  // },
  image: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  label: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "gold",
    color: "black",
    fontSize: 10, // Reduced font size
    paddingHorizontal: 4,
    borderRadius: 3,
    fontWeight: "bold",
  },
});

export default AnimatedCarousel;
