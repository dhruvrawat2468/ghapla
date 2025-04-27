import React, { useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Sample data for search results
  const productData = [
    { id: "1", name: "iPhone 14 Pro" },
    { id: "2", name: "Samsung Galaxy S23" },
    { id: "3", name: "MacBook Air M2" },
    { id: "4", name: "Sony Headphones" },
    { id: "5", name: "Dell XPS Laptop" },
    { id: "6", name: "Apple Watch Ultra" },
    { id: "7", name: "Google Pixel 7" },
  ];

  // Function to filter data based on search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const results = productData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search for Products"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Search Results */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f76a06",
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop:35,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  icon: {
    marginRight: 8,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SearchScreen;
