import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const ReviewScreen = ({ route = {} }) => {
  const navigation = useNavigation();
  const repairItem = route?.params?.repairItem || {
    name: "Your Device",
    date: new Date().toLocaleDateString(),
  };

  const [productRating, setProductRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [appRating, setAppRating] = useState(0);
  const [productReview, setProductReview] = useState("");
  const [serviceReview, setServiceReview] = useState("");
  const [appReview, setAppReview] = useState("");

  const handleRating = (type, star) => {
    if (type === "product") setProductRating(star);
    else if (type === "service") setServiceRating(star);
    else if (type === "app") setAppRating(star);
  };

  const goToRepairHistory = () => {
    navigation.navigate("History");
  };

  const submitReview = () => {
    if (productRating === 0 || serviceRating === 0 || appRating === 0) {
      Alert.alert(
        "Incomplete Review",
        "Please rate all sections before submitting."
      );
      return;
    }

    const reviewData = {
      product: { rating: productRating, review: productReview },
      service: { rating: serviceRating, review: serviceReview },
      app: { rating: appRating, review: appReview },
      repairItem,
      timestamp: new Date().toISOString(),
    };

    console.log("Review Submitted:", reviewData);

    Alert.alert("Thank You!", "Your feedback helps us improve our service.", [
      {
        text: "Done",
        onPress: goToRepairHistory,
        style: "cancel",
      },
    ]);
  };

  const renderStarRating = (type, rating) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handleRating(type, star)}
          activeOpacity={0.7}
        >
          <FontAwesome
            name={star <= rating ? "star" : "star-o"}
            size={32}
            color={star <= rating ? "#FFD700" : "#C0C0C0"}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
      <Text style={styles.ratingText}>
        {rating > 0 ? `${rating}.0` : "Not rated"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={goToRepairHistory}
                    style={styles.backButton}
                  >
                    <MaterialIcons
                      name="arrow-back"
                      size={24}
                      color="#FF7B54"
                    />
                  </TouchableOpacity>
                  <Text style={styles.title}>Your Feedback</Text>
                </View>

                <View style={styles.repairInfo}>
                  <Text style={styles.repairItemName}>{repairItem.name}</Text>
                  <Text style={styles.repairItemDate}>
                    Repaired on: {repairItem.date}
                  </Text>
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons name="devices" size={20} color="#FF7B54" />
                    <Text style={styles.sectionTitle}>Product Condition</Text>
                  </View>
                  {renderStarRating("product", productRating)}
                  <TextInput
                    style={styles.input}
                    placeholder="How is your device working after repair?"
                    placeholderTextColor="#999"
                    multiline
                    value={productReview}
                    onChangeText={setProductReview}
                  />
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons
                      name="engineering"
                      size={20}
                      color="#FF7B54"
                    />
                    <Text style={styles.sectionTitle}>Service Experience</Text>
                  </View>
                  {renderStarRating("service", serviceRating)}
                  <TextInput
                    style={styles.input}
                    placeholder="Tell us about your experience with our technician..."
                    placeholderTextColor="#999"
                    multiline
                    value={serviceReview}
                    onChangeText={setServiceReview}
                  />
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons
                      name="phone-iphone"
                      size={20}
                      color="#FF7B54"
                    />
                    <Text style={styles.sectionTitle}>App Experience</Text>
                  </View>
                  {renderStarRating("app", appRating)}
                  <TextInput
                    style={styles.input}
                    placeholder="How was your experience using our app?"
                    placeholderTextColor="#999"
                    multiline
                    value={appReview}
                    onChangeText={setAppReview}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    (productRating === 0 ||
                      serviceRating === 0 ||
                      appRating === 0) &&
                      styles.buttonDisabled,
                  ]}
                  onPress={submitReview}
                  disabled={
                    productRating === 0 ||
                    serviceRating === 0 ||
                    appRating === 0
                  }
                >
                  <Text style={styles.buttonText}>Submit Review</Text>
                  <MaterialIcons
                    name="send"
                    size={20}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  repairInfo: {
    backgroundColor: "#FFF5E6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF7B54",
  },
  repairItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  repairItemDate: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginLeft: 8,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  star: {
    marginHorizontal: 6,
  },
  ratingText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  input: {
    minHeight: 100,
    borderColor: "#EEE",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#FAFAFA",
    color: "#333",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#FF7B54",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#FF7B54",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: "#CCC",
    shadowColor: "transparent",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  buttonIcon: {
    marginTop: 2,
  },
});

export default ReviewScreen;