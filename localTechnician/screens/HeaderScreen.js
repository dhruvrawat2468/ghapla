import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const HeaderScreen = ({ onStatusChange }) => {
  const [isOnline, setIsOnline] = useState(false);
  const animatedValue = useState(new Animated.Value(0))[0];

  const toggleStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    Animated.timing(animatedValue, {
      toValue: newStatus ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 55],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <Text style={styles.greeting}>Hi, BOSS</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: isOnline ? "#4CAF50" : "#f44336" },
            ]}
            onPress={toggleStatus}
            activeOpacity={0.8}
          >
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.toggleText,
                  isOnline ? styles.onlineText : styles.offlineText,
                ]}
              >
                {isOnline ? "Online" : "Offline"}
              </Text>
            </View>
            <Animated.View
              style={[
                styles.circle,
                {
                  transform: [{ translateX }],
                },
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons
              name="notifications-none"
              size={24}
              color="#fd7e14"
            />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoContainer: {
    marginTop: 10,
    flex: 1,
  },
  greeting: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fd7e14",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleButton: {
    marginTop: 20,
    width: 90,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
    overflow: "hidden",
  },
  textContainer: {
    marginTop: 20,
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
  },
  toggleText: {
    fontWeight: "bold",
    fontSize: 12,
    zIndex: 1,
  },
  onlineText: {
    color: "#fff",
    marginRight: 25,
  },
  offlineText: {
    color: "#fff",
    marginLeft: 25,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    position: "absolute",
    top: 4,
    left: 0,
  },
  notificationButton: {
    marginTop: 20,
    position: "relative",
    padding: 5,
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff5252",
  },
});

export default HeaderScreen;
