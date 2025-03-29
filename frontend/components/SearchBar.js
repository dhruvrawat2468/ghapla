import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Sample product suggestions for search
const suggestions = [
    { id: '1', name: 'Mobile phone', image: require('../assets/images/1phone.png') },
    { id: '2', name: 'Laptop', image: require('../assets/images/1laptop.png') },
    { id: '3', name: 'Air Conditioner', image: require('../assets/images/1ac.png') },
    { id: '4', name: 'Television', image: require('../assets/images/1tv.png') },
    { id: '5', name: 'Fridge', image: require('../assets/images/1fridge.png') },
    { id: '6', name: 'Microwave', image: require('../assets/images/1microwavee.png') },
    { id: '7', name: 'Geyser', image: require('../assets/images/1geyser.png') },
    { id: '8', name: 'Heater', image: require('../assets/images/1heater.png') },
    { id: '9', name: 'Washing Machine', image: require('../assets/images/1washing.png') },
    { id: '10', name: 'Water Purifier', image: require('../assets/images/1ro.png') },
    { id: '11', name: 'Induction', image: require('../assets/images/1induction.png') }
];

// SearchBar component
const SearchBar = ({ onSearchSelect }) => {
    const [searchText, setSearchText] = useState(''); // State to track user input
    const [filteredSuggestions, setFilteredSuggestions] = useState([]); // State to store filtered search results

    // Function to handle search input changes
    const handleSearch = (text) => {
        setSearchText(text);
        if (text.length > 0) {
            // Filter suggestions based on user input
            const filtered = suggestions.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]); // Clear suggestions if input is empty
        }
    };

    return (
        <View style={styles.container}>
            {/* Search Bar Input */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={19} color="#999" style={styles.searchIcon} />
                <TextInput
                    placeholder="Search products..."
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={handleSearch} // Handle text input changes
                />
                {/* Gradient Bottom Border */}
                <LinearGradient colors={['#FFA500', '#FF7600']} style={styles.bottomBorder} />
            </View>

            {/* Suggestions List - Display when filtered suggestions exist */}
            {filteredSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    {filteredSuggestions.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.suggestionItem}
                            onPress={() => {
                                setSearchText(item.name); // Set selected text in input
                                setFilteredSuggestions([]); // Clear suggestions after selection
                                onSearchSelect(item.name); // Trigger callback function
                            }}
                        >
                            <Image source={item.image} style={styles.suggestionImage} />
                            <Text style={styles.suggestionText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

// Styles for SearchBar component
const styles = StyleSheet.create({
    container: {
        position: 'absolute', // Keeps search bar positioned at a fixed location
        bottom: -40,
        left: 40,
        right: 40,
    },
    searchContainer: {
        height: 40,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        elevation: 2, // Adds a shadow effect on Android
        zIndex: 2, // Ensures search bar stays above suggestions
    },
    searchIcon: {
        marginRight: 6,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
        borderWidth: 0,
        paddingLeft: 5,
    },
    bottomBorder: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 5,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    },
    suggestionsContainer: {
        position: 'absolute', // Keeps suggestions below the search bar
        top: 45, // Position suggestions right below the input field
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        zIndex: 1, // Keeps it below the search bar
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    suggestionImage: {
        width: 30,
        height: 30,
        marginRight: 10,
        borderRadius: 5,
    },
    suggestionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default SearchBar;
