import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  // Sample reviews data
  const reviews = [
    {
      id: "1",
      name: "Rahul Sharma",
      rating: 5,
      comment: "Excellent service! My fridge was fixed within 2 hours.",
      date: "2 days ago",
    },
    {
      id: "2",
      name: "Priya Patel",
      rating: 4,
      comment: "Technician was very professional and knowledgeable.",
      date: "1 week ago",
    },
    {
      id: "3",
      name: "Amit Singh",
      rating: 5,
      comment: "Saved me from buying a new fridge. Great repair service!",
      date: "3 days ago",
    },
    {
      id: "4",
      name: "Neha Gupta",
      rating: 5,
      comment: "Fast response and reasonable pricing. Highly recommended!",
      date: "5 days ago",
    },
    {
      id: "5",
      name: "Sanjay Verma",
      rating: 4,
      comment: "Quick and efficient service. Would use again.",
      date: "4 days ago",
    },
  ];

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, i) => (
              <MaterialIcons
                name={i < item.rating ? "star" : "star-border"}
                size={14}
                color="#FFD700"
                key={i}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      <Text style={styles.reviewComment} numberOfLines={2}>
        {item.comment}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#FFF7E6", "#FFE4B2"]}
      style={styles.gradientContainer}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Trust-Building Header Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trusted by 1,200+ Customers</Text>
          <View style={styles.divider} />

          {/* Review Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>4.9 Average Rating</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="verified" size={16} color="#4CAF50" />
              <Text style={styles.statText}>Verified Reviews</Text>
            </View>
          </View>

          {/* Guarantee Badge */}
          <View style={styles.guaranteeContainer}>
            <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.guaranteeText}>
              100% Satisfaction Guarantee
            </Text>
          </View>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsWrapper}>
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsContainer}
            snapToInterval={width * 0.8}
            decelerationRate="fast"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 25,
    paddingBottom: 50,
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#575757",
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#fd7e14",
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  statText: {
    fontSize: 14,
    color: "#575757",
    marginLeft: 5,
  },
  guaranteeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 5,
  },
  guaranteeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
    marginLeft: 5,
  },
  reviewsWrapper: {
    minHeight: 160,
  },
  reviewsContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
  },
  reviewCard: {
    width: width * 0.78,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fd7e14",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewInfo: {
    flex: 1,
    marginRight: 10,
  },
  reviewName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#575757",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 2,
  },
  reviewComment: {
    color: "#575757",
    fontSize: 13,
    lineHeight: 18,
  },
  reviewDate: {
    color: "#888",
    fontSize: 11,
  },
});

export default HomeScreen;
