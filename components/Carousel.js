import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useFonts,
  Oswald_700Bold,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

Geocoder.init("AIzaSyBzhTtWJn8_cjGyTd8FdI5M0d29_pD9yn8");

const { width, height } = Dimensions.get("window");
const timeSlotMapping = {
  "10 AM - 1 PM": { from: "10:00", to: "13:00" },
  "1 PM - 4 PM": { from: "13:00", to: "16:00" },
  "4 PM - 7 PM": { from: "16:00", to: "19:00" },
  "7 PM - 10 PM": { from: "19:00", to: "22:00" },
};

const CarouselScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile } = useContext(AuthContext);
  const { deviceName, categories = [], brandName, date, timeSlot, images } = route.params || {};
  const { from: serviceFromTime, to: serviceToTime } = timeSlotMapping[timeSlot] || { from: null, to: null };

  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [region, setRegion] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const [isFocused, setIsFocused] = useState({
    address: false,
    landmark: false,
    pincode: false,
  });

  const mapRef = useRef(null);
  const [fontsLoaded] = useFonts({
    Oswald_700Bold,
    Oswald_400Regular,
  });

  useEffect(() => {
    if (categories.length === 1) {
      setSelectedMode(categories[0]);
    }
  }, [categories]);

  const formOffsetY = useSharedValue(30);
  const buttonScale = useSharedValue(1);
  const gpsButtonScale = useSharedValue(1);

  const addressInputStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(isFocused.address ? "#FF6D00" : "#E0E0E0", { duration: 200 }),
    backgroundColor: withTiming(isFocused.address ? "#FFF8F0" : "#FAFAFA", { duration: 200 }),
  }));

  const landmarkInputStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(isFocused.landmark ? "#FF6D00" : "#E0E0E0", { duration: 200 }),
    backgroundColor: withTiming(isFocused.landmark ? "#FFF8F0" : "#FAFAFA", { duration: 200 }),
  }));

  const pincodeInputStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(isFocused.pincode ? "#FF6D00" : "#E0E0E0", { duration: 200 }),
    backgroundColor: withTiming(isFocused.pincode ? "#FFF8F0" : "#FAFAFA", { duration: 200 }),
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formOffsetY.value }],
    opacity: withSpring(1, { damping: 15, stiffness: 100 }),
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const gpsButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: gpsButtonScale.value }],
  }));

  useEffect(() => {
    if (fontsLoaded) {
      formOffsetY.value = withSpring(0, { damping: 15, stiffness: 100 });
    }
  }, [fontsLoaded, formOffsetY]);

  const handleGPSPress = async () => {
    setLoadingGPS(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoadingGPS(false);
        Alert.alert("Location permission denied.");
        return;
      }

      let position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = position.coords;

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }

      const response = await Geocoder.from(latitude, longitude);
      const result = response.results[0];
      const formattedAddress = result.formatted_address;
      const addressComponents = result.address_components;

      const postalCode =
        addressComponents.find((comp) => comp.types.includes("postal_code"))?.long_name || "";
      const locality =
        addressComponents.find((comp) => comp.types.includes("locality") || comp.types.includes("sublocality"))?.long_name || "";

      setAddress(formattedAddress);
      setLandmark(locality);
      setPincode(postalCode);
    } catch (error) {
      console.error("Location or Geocoding error:", error);
      Alert.alert("Failed to get location. Please try again or enter manually.");
    }
    setLoadingGPS(false);
  };

  const handlePressIn = (scale) => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = (scale) => {
    scale.value = withSpring(1);
  };

  const handlePincodeChange = (text) => {
    setPincode(text.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = async () => {
    if (!userProfile || !userProfile._id) {
      Alert.alert("Authentication Required", "Please log in to place an order.");
      navigation.navigate("Login");
      return;
    }

    if (!address || !pincode) {
      Alert.alert("Please enter your address and pincode");
      return;
    }
    if (categories.length > 1 && !selectedMode) {
      Alert.alert("Please select a service mode");
      return;
    }
    if (!timeSlot || !timeSlotMapping[timeSlot]) {
      Alert.alert("Please select a valid time slot");
      return;
    }

    // Normalize serviceDate to YYYY-MM-DD format
    const serviceDate = new Date(date).toISOString().split("T")[0];

    const orderData = {
      userId: userProfile._id,
      applianceName: deviceName,
      type: selectedMode || (categories.length === 1 ? categories[0] : null),
      brandName: brandName,
      serviceDate,
      serviceFromTime,
      serviceToTime,
      imageId: images && images.length > 0 ? images[0] : null,
      address: {
        street: address,
        landmark: landmark || "",
        pincode,
      },
    };

    console.log("Order Data:", orderData);

    const missingFields = [];
    if (!orderData.applianceName) missingFields.push("Appliance Name");
    if (!orderData.type) missingFields.push("Service Type");
    if (!orderData.brandName) missingFields.push("Brand Name");
    if (!orderData.serviceDate) missingFields.push("Service Date");
    if (!orderData.serviceFromTime) missingFields.push("Service From Time");
    if (!orderData.serviceToTime) missingFields.push("Service To Time");
    if (!orderData.address.street) missingFields.push("Address");
    if (!orderData.address.pincode) missingFields.push("Pincode");

    if (missingFields.length > 0) {
      Alert.alert(`Please provide: ${missingFields.join(", ")}`);
      return;
    }

    try {
      const response = await fetch("http://192.168.1.8:7000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Order placed successfully!");

        const serviceType = categories.length === 1 ? categories[0] : selectedMode;

        if (serviceType === "Pickup Repair Drop") {
          navigation.navigate("PickupRepair", { orderId: result.order._id, ...orderData });
        } else if (serviceType === "Home Repair") {
          navigation.navigate("HomeRepair", { orderId: result.order._id, ...orderData });
        } else {
          navigation.navigate("Tracking", { orderId: result.order._id, ...orderData });
        }
      } else {
        console.error("Error response:", result);
        Alert.alert(`Failed to place order: ${result.message}`);
      }
    } catch (error) {
      console.error("Order API Error:", error);
      Alert.alert("Something went wrong. Please try again later.");
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.delay(400)} style={[styles.formContainer, formAnimatedStyle]}>
          <View style={styles.serviceMode}>
            <MaterialIcons name="miscellaneous-services" size={20} color="#FF6D00" />
            {categories.length === 1 ? (
              <Text style={styles.serviceModeText}>{categories[0]}</Text>
            ) : (
              <View style={styles.categoryButtonsWrapper}>
                {categories.map((cat, index) => {
                  const isSelected = selectedMode === cat;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]}
                      onPress={() => setSelectedMode(cat)}
                    >
                      <Text
                        style={[styles.categoryButtonText, isSelected && styles.categoryButtonTextSelected]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <Text style={styles.sectionHeader}>Service Address</Text>

          <Animated.View entering={FadeInDown.delay(600)} style={[styles.inputContainer, addressInputStyle]}>
            <MaterialIcons name="location-on" size={20} color="#9E9E9E" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full address"
              placeholderTextColor="#9E9E9E"
              value={address}
              onChangeText={setAddress}
              onFocus={() => setIsFocused({ ...isFocused, address: true })}
              onBlur={() => setIsFocused({ ...isFocused, address: false })}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800)} style={[styles.inputContainer, landmarkInputStyle]}>
            <MaterialIcons name="place" size={20} color="#9E9E9E" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nearby landmark"
              placeholderTextColor="#9E9E9E"
              value={landmark}
              onChangeText={setLandmark}
              onFocus={() => setIsFocused({ ...isFocused, landmark: true })}
              onBlur={() => setIsFocused({ ...isFocused, landmark: false })}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1000)} style={[styles.inputContainer, pincodeInputStyle]}>
            <FontAwesome5 name="map-pin" size={16} color="#9E9E9E" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              placeholderTextColor="#9E9E9E"
              keyboardType="numeric"
              value={pincode}
              onChangeText={handlePincodeChange}
              maxLength={6}
              onFocus={() => setIsFocused({ ...isFocused, pincode: true })}
              onBlur={() => setIsFocused({ ...isFocused, pincode: false })}
            />
          </Animated.View>

          <TouchableOpacity
            onPressIn={() => handlePressIn(gpsButtonScale)}
            onPressOut={() => handlePressOut(gpsButtonScale)}
            onPress={handleGPSPress}
            activeOpacity={0.9}
            disabled={loadingGPS}
          >
            <Animated.View style={[styles.gpsButton, gpsButtonAnimatedStyle]}>
              <LinearGradient
                colors={["#FFFFFF", "#F5F5F5"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="gps-fixed" size={20} color="#FF6D00" />
                <Text style={styles.gpsButtonText}>
                  {loadingGPS ? "Detecting location..." : "Use current location"}
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.delay(1200)} style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: 20.5937,
                longitude: 78.9629,
                latitudeDelta: 15,
                longitudeDelta: 15,
              }}
              region={region}
              provider="google"
              mapType="standard"
              loadingEnabled={true}
              loadingIndicatorColor="#FF6D00"
              loadingBackgroundColor="#FAFAFA"
            >
              {region && (
                <Marker
                  coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                  title="Your Location"
                >
                  <View style={styles.marker}>
                    <View style={styles.markerPin} />
                    <View style={styles.markerPulse} />
                  </View>
                </Marker>
              )}
            </MapView>
          </Animated.View>

          <TouchableOpacity
            onPressIn={() => handlePressIn(buttonScale)}
            onPressOut={() => handlePressOut(buttonScale)}
            onPress={handleSubmit}
            activeOpacity={0.9}
          >
            <Animated.View style={[styles.submitButton, buttonAnimatedStyle]}>
              <LinearGradient
                colors={["#FF6D00", "#FF3D00"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Place Order</Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff9913",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  categoryButtonsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginLeft: 10,
    justifyContent: "center",
  },
  categoryButton: {
    backgroundColor: "#FFE0B2",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF6D00",
    width: (SCREEN_WIDTH - 64) / 2,
    alignItems: "center",
  },
  categoryButtonSelected: {
    backgroundColor: "#FF6D00",
  },
  categoryButtonText: {
    color: "#FF6D00",
    fontWeight: "700",
    fontSize: 13,
    fontFamily: "Oswald_400Regular",
    textAlign: "center",
    numberOfLines: 1,
    ellipsizeMode: "tail",
  },
  categoryButtonTextSelected: {
    color: "#FFFFFF",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceMode: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    justifyContent: "center",
  },
  serviceModeText: {
    fontSize: 14,
    color: "#FF6D00",
    fontWeight: "800",
    marginLeft: 8,
    fontFamily: "Sans-Serif",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 16,
    fontFamily: "Oswald_700Bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#424242",
    fontFamily: "Oswald_400Regular",
    height: "100%",
  },
  gpsButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  gpsButtonText: {
    color: "#424242",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: "Oswald_400Regular",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Oswald_700Bold",
    marginRight: 8,
  },
  mapContainer: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  marker: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF3D00",
    borderWidth: 2,
    borderColor: "white",
  },
  markerPulse: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 61, 0, 0.3)",
    zIndex: -1,
  },
});

export default CarouselScreen;