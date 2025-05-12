import React, { useContext, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TechnicianContext } from "../context/TechnicianContext";

const HeaderScreen = () => {
  const { technician, updateOnlineStatus } = useContext(TechnicianContext);

  // Use `useRef` to persist the animated value
  const animatedValue = useRef(
    new Animated.Value(technician.isOnline ? 1 : 0)
  ).current;

  const toggleStatus = () => {
    const newStatus = !technician.isOnline;
    updateOnlineStatus(newStatus);

    Animated.timing(animatedValue, {
      toValue: newStatus ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 55],
  });

  // Memoize the toggle button style to prevent unnecessary recalculations
  const toggleButtonStyle = useMemo(
    () => ({
      backgroundColor: technician.isOnline ? "#4CAF50" : "#f44336",
      opacity: technician.overallStatus === "verified" ? 1 : 0.5,
    }),
    [technician.isOnline, technician.overallStatus]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <Text style={styles.greeting}>
            Hi, {technician.name.split(" ")[0]}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.toggleButton, toggleButtonStyle]}
            onPress={toggleStatus}
            activeOpacity={0.8}
            disabled={technician.overallStatus !== "verified"}
          >
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.toggleText,
                  technician.isOnline ? styles.onlineText : styles.offlineText,
                ]}
              >
                {technician.isOnline ? "Online" : "Offline"}
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
