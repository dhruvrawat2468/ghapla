import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient for background gradient

// Services Component - Displays service options with navigation
const Services = ({ navigation }) => {
    return (
        // Background gradient for a visually appealing UI
        <LinearGradient colors={['#fff3db', '#FFFFFF']} style={styles.gradientBackground}>
            <View style={styles.container}>
                {/* Title Section */}
                <Text style={styles.title}>Our Services</Text>
                <View style={styles.underline} /> {/* Underline decoration for title */}

                {/* Service Options */}
                <View style={styles.servicesContainer}>
                    {/* Home Repair Service */}
                    <TouchableOpacity 
                        style={styles.serviceButton} 
                        onPress={() => navigation.navigate('HomeRepair')} // Navigate to Home Repair Screen
                    >
                        <Image source={require('../assets/images/service1.png')} style={styles.image} />
                        <Text style={styles.buttonText}></Text>
                    </TouchableOpacity>

                    {/* Pickup & Repair Service */}
                    <TouchableOpacity 
                        style={styles.serviceButton} 
                        onPress={() => navigation.navigate('PickupRepair')} // Navigate to Pickup Repair Screen
                    >
                        <Image source={require('../assets/images/service2.png')} style={styles.image} />
                        <Text style={styles.buttonText}></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    // Gradient background covering the full screen
    gradientBackground: {
        flex: 1,
        marginTop: 2, 
        marginBottom: 0,
    },
    // Container for all content
    container: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    // Title styling
    title: {
        fontSize: 30, 
        fontWeight: 'bold',
        marginTop: 65,
        color: '#575757',
        fontFamily: 'ROBOTA', // Custom font (make sure it's available)
        letterSpacing: 1, 
        textShadowColor: 'rgba(0, 0, 0, 0.35)', 
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        textTransform: 'uppercase',
    },
    // Underline below the title
    underline: {
        width: 50,
        height: 4,
        backgroundColor: '#FFA500',
        marginTop: 10,
        borderRadius: 2,
        marginBottom: 8,
    },
    // Service buttons container
    servicesContainer: {
        flexDirection: 'row', // Arrange services horizontally
        justifyContent: 'space-evenly', // Space them evenly
        width: '100%',
    },
    // Service images
    image: {
        width: 170,
        height: 160,
        resizeMode: 'contain', // Ensure the image fits inside the box
    },
});

export default Services;

