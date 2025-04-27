import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const UserProfileScreen = () => {
  const navigation = useNavigation();

  // Dummy user data
  const user = {
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Ravi Sharma",
    email: "ravi455@example.com",
    age: 28,
    gender: "Male",
    mobile: "9876543210",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
    },
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.emailContainer}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="account-details"
            size={20}
            color="#FD7E14"
          />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <MaterialIcons name="calendar-today" size={20} color="#FD7E14" />
            <Text style={styles.infoLabel}>Age</Text>
          </View>
          <Text style={styles.infoValue}>{user.age}</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons
              name="gender-male-female"
              size={20}
              color="#FD7E14"
            />
            <Text style={styles.infoLabel}>Gender</Text>
          </View>
          <Text style={styles.infoValue}>{user.gender}</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Feather name="phone" size={20} color="#FD7E14" />
            <Text style={styles.infoLabel}>Mobile</Text>
          </View>
          <Text style={styles.infoValue}>{user.mobile}</Text>
        </View>
      </View>

      {/* Address Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Entypo name="address" size={20} color="#FD7E14" />
          <Text style={styles.sectionTitle}>Address</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <MaterialIcons name="home" size={20} color="#FD7E14" />
            <Text style={styles.infoLabel}>Street</Text>
          </View>
          <Text style={styles.infoValue}>{user.address.street}</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <MaterialIcons name="location-city" size={20} color="#FD7E14" />
            <Text style={styles.infoLabel}>City</Text>
          </View>
          <Text style={styles.infoValue}>{user.address.city}</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <FontAwesome name="map" size={18} color="#FD7E14" />
            <Text style={styles.infoLabel}>State</Text>
          </View>
          <Text style={styles.infoValue}>{user.address.state}</Text>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <MaterialIcons
              name="markunread-mailbox"
              size={20}
              color="#FD7E14"
            />
            <Text style={styles.infoLabel}>Postal Code</Text>
          </View>
          <Text style={styles.infoValue}>{user.address.postalCode}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", { user })}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom padding */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
  },
  infoIcon: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: "#575757",
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "right",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FD7E14",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: "#FD7E14",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FD7E14",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    shadowColor: "#FD7E14",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default UserProfileScreen;
