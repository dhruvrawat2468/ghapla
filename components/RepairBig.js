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
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient"; // 🔥 Import LinearGradient

const { width } = Dimensions.get("window");

// Card data
const cards = [
  {
    id: "1",
    image: require("../assets/images/mobile.png"),
    label: "Up to 40% off",
    name: "Mobile Phone/Tablet",
    imgWidth: 400,
    imgHeight: 120,
  },
  {
    id: "2",
    image: require("../assets/images/water.png"),
    label: "Exclusive",
    name: "RO",
    imgWidth: 100,
    imgHeight: 100,
  },
  {
    id: "3",
    image: require("../assets/images/lap_right.png"),
    label: "Up to 30% off",
    name: "Laptop/PC",
    imgWidth: 110,
    imgHeight: 90,
  },
  {
    id: "4",
    image: require("../assets/images/1induction.png"),
    label: "Up to 50% off",
    name: "Induction",
    imgWidth: 80,
    imgHeight: 80,
  },
  {
    id: "5",
    image: require("../assets/images/tv.png"),
    label: "Up to 20% off",
    name: "Television",
    imgWidth: 120,
    imgHeight: 80,
  },
  {
    id: "6",
    image: require("../assets/images/washing.png"),
    label: "Up to 35% off",
    name: "Washing Machine",
    imgWidth: 100,
    imgHeight: 100,
  },
  {
    id: "7",
    image: require("../assets/images/image.png"),
    label: "Up to 35% off",
    name: "Microwave/Oven",
    imgWidth: 90,
    imgHeight: 90,
  },
];

const AnimatedCarousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const navigation = useNavigation();
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
    <LinearGradient
      colors={["#FFF7E6", "#FFE4B2"]} // 🌈 Set the background gradient here
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background} // 👈 Custom background style
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Repair Big, Save Bigger</Text>
          <View style={styles.underline} />
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
                onPress={() =>
                  navigation.navigate("ProductDetails", {
                    productName: item.name,
                  })
                }
                activeOpacity={0.7}
              >
                <Animated.View style={{ transform: [{ scale }] }}>
                  <LinearGradient
                    colors={["#FFFFFF", "#FFffff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                  >
                    <View
                      style={[
                        styles.imageContainer,
                        {
                          width: item.imgWidth || styles.imageContainer.width,
                          height:
                            item.imgHeight || styles.imageContainer.height,
                        },
                      ]}
                    >
                      <Image
                        source={item.image}
                        style={[
                          styles.image,
                          {
                            width: item.imgWidth || "100%",
                            height: item.imgHeight || "100%",
                          },
                        ]}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.productName}>{item.name}</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingVertical: 15,
    paddingBottom: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#575757",
    fontFamily: "Roboto",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: "#FF7600",
    borderRadius: 4,
    marginVertical: 12,
  },
  card: {
    width: width * 0.28,
    height: 160,
    borderRadius: 12,
    marginHorizontal: 5,
    marginBottom: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    padding: 8,
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
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
    overflow: "hidden",
  },
  productName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#575757",
    textAlign: "center",
    marginTop: 4,
  },
});

export default AnimatedCarousel;
