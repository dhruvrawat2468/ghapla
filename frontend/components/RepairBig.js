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

const { width } = Dimensions.get("window"); // Get device screen width

// Array of carousel items with images and labels
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
  const scrollX = useRef(new Animated.Value(0)).current; // Animated value for scroll tracking
  const flatListRef = useRef(null); // Reference for FlatList
  const [data] = React.useState([...cards, ...cards, ...cards]); // Duplicate data for infinite scrolling effect

  useEffect(() => {
    let offset = width * 0.28 * cards.length; // Start scrolling from the middle of the list
    flatListRef.current?.scrollToOffset({ offset, animated: false });

    // Function to auto-scroll carousel
    const autoScroll = () => {
      offset += width * 0.28; // Move by one card width
      if (offset >= width * 0.28 * cards.length * 2) {
        offset = width * 0.28 * cards.length; // Reset to the middle when reaching the end
        flatListRef.current?.scrollToOffset({ offset, animated: false });
      }
      flatListRef.current?.scrollToOffset({ offset, animated: true });
    };

    const interval = setInterval(autoScroll, 1500); // Auto-scroll every 1.5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <View style={styles.container}>
      {/* Carousel Heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Repair Big, Save Bigger</Text>
      </View>

      {/* Animated FlatList for Carousel */}
      <Animated.FlatList
        ref={flatListRef} // Attach reference to FlatList
        data={data} // Provide data array
        keyExtractor={(item, index) => `${item.id}-${index}`} // Unique key for each item
        horizontal // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false} // Hide scroll indicator
        pagingEnabled={false} // Disable snapping effect
        scrollEventThrottle={16} // Optimize scroll performance
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true } // Optimize performance
        )}
        renderItem={({ item, index }) => {
          // Create animation effect for scaling the cards
          const inputRange = [
            (index - 1) * width * 0.28,
            index * width * 0.28,
            (index + 1) * width * 0.28,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95], // Subtle scaling effect
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

// Styles for the component
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a2540", // Dark background for contrast
    paddingVertical: 15, // Adds spacing at the top and bottom
  },
  headingContainer: {
    backgroundColor: "#fff3e0", // Light background for title
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2b6cb0", // Blue border
    marginBottom: 10, // Fix marginBottom value
  },
  heading: {
    color: "#565656",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    width: width * 0.28, // Adjust width dynamically based on screen size
    height: 140, // Reduced height for compact layout
    backgroundColor: "#2b6cb0", // Blue background
    borderRadius: 12, // Rounded corners
    marginHorizontal: 5, // Space between cards
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3, // Android shadow effect
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: "contain", // Ensure the image fits inside the box
  },
  label: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "gold",
    color: "black",
    fontSize: 10, // Reduced font size for better fit
    paddingHorizontal: 4,
    borderRadius: 3,
    fontWeight: "bold",
  },
});

export default AnimatedCarousel;
