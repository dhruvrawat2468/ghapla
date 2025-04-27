import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const SearchBar = ({ onSearchSelect }) => {
  const [searchText, setSearchText] = useState("");
  const [devices, setDevices] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigation = useNavigation();

  // Animation for device name in placeholder
  const deviceNameAnim = useRef(new Animated.Value(0)).current;
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const deviceNames = [
    "Mobile Phone/Tablet",
    "Microwave/Oven",
    "Laptop",
    "Air Conditioner",
    "Television",
  ];

  // Animation for search suggestions
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("http://192.168.1.8:7000/api/devices/all");
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setDevices(data);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();

    // Start device name animation
    const interval = setInterval(() => {
      Animated.timing(deviceNameAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentDeviceIndex((prev) => (prev + 1) % deviceNames.length);
        Animated.timing(deviceNameAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (filteredSuggestions.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(-10);
    }
  }, [filteredSuggestions]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const filtered = devices.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Enter" && searchText.trim() !== "") {
      navigation.navigate("ProductDetails", { searchQuery: searchText });
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchText(item.name);
    setFilteredSuggestions([]);
    navigation.navigate("ProductDetails", { searchQuery: item.name });
  };

  return (
    <View style={styles.container}>
      {/* Search Bar Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={19}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder=""
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
          onKeyPress={handleKeyPress}
          returnKeyType="search"
        />
        {/* Static "Search for" with animated device name */}
        {!searchText && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.staticPlaceholderText}>Search for </Text>
            <Animated.Text
              style={[
                styles.animatedDeviceName,
                {
                  opacity: deviceNameAnim,
                  transform: [
                    {
                      translateY: deviceNameAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [5, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {"'" + deviceNames[currentDeviceIndex] + "'"}
            </Animated.Text>
          </View>
        )}
        <LinearGradient
          colors={["#FFA500", "#FF7600"]}
          style={styles.bottomBorder}
        />
      </View>

      {/* Suggestions List */}
      {filteredSuggestions.length > 0 && (
        <Animated.View
          style={[
            styles.suggestionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(item) => item._id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionClick(item)}
              >
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchContainer: {
    height: 40,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 2,
    width: "100%",
    position: "relative",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 5,
  },
  searchIcon: {
    marginRight: 6,
  },
  placeholderContainer: {
    position: "absolute",
    left: 35,
    flexDirection: "row",
    alignItems: "center",
  },
  staticPlaceholderText: {
    fontSize: 16,
    color: "#999",
  },
  animatedDeviceName: {
    fontSize: 16,
    color: "#999",
    fontWeight: "bold",
  },
  bottomBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 45,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 1,
    maxHeight: 300,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SearchBar;
