import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import { useFonts } from 'expo-font'; // Import font hook (if you want to use custom fonts)

const { width } = Dimensions.get('window');

const services = [
  { id: '1', image: require('../assets/images/icon-modified.png'), name: 'Phone' },
  { id: '2', image: require('../assets/images/tv-icon.png'), name: 'TV' },
  { id: '3', image: require('../assets/images/ac-icon.png'), name: 'Air Conditioner' },
  { id: '4', image: require('../assets/images/microwave-icon-modified.png'), name: 'Microwave' },
  { id: '5', image: require('../assets/images/fridge.png'), name: 'Fridge' },
  { id: '6', image: require('../assets/images/laptop.png'), name: 'Laptop' },
];

const SolutionsComponent = () => {
  const [fontsLoaded] = useFonts({
    'custom-font': require('../assets/fonts/Roboto-Bold.ttf'), // Make sure you have a custom font available
  });

  // Animation Setup
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity is 0

  // Start the animation when the component is mounted
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to opacity 1
      duration: 1000, // Duration of 1 second
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, []);

  if (!fontsLoaded) {
    return null; // Wait for fonts to load before rendering
  }

  return (
    <LinearGradient
      colors={['#Fff3db', '#fff3db', '#FFFFFF']} // Soft pink to skyish gradient
      start={{ x: 0.8, y: 0 }} // Gradient starts at the right side
      end={{ x: 1, y: 1 }} // Gradient ends at the bottom-right corner
      style={styles.outerContainer}
    >
      <View style={styles.container}>
        {/* Animated Box for Title */}
       
         // Apply fade animation to the box
        
          <Text style={styles.title}>⏰Repair within Hours</Text>
          <View style={styles.underline} />
       

        <View style={styles.gridContainer}>
          <FlatList
            data={services}
            numColumns={3}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.circle}>
                  <Image source={item.image} style={styles.icon} />
                </View>
                {/* Add the service name under the icon */}
                <Text style={styles.serviceName}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  titleBox: {
    paddingVertical: 23,
    paddingHorizontal: 25,
    borderRadius: 15,
    shadowColor: '#000', // Shadow for the box
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 7, // Android shadow
    marginBottom: 24,
  },
  title: {
    fontSize: 30, 
    fontWeight: 'bold',
    marginTop: -5,
    color: '#575656',
    fontFamily: 'Poppins-BoldItalic', 
    letterSpacing: 1, 
    textShadowColor: 'rgba(0, 0, 0, 0.35)', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    textTransform: 'uppercase',
    // fontStyle:'italic', 
},
  gridContainer: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: width / 3.5,
    alignItems: 'center',
    marginVertical: 10,
  },
  circle: {
    width: 82,
    height: 82,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  serviceName: {
    fontSize: 14, // Set appropriate font size for the name
    fontWeight: 'bold', // Bold text for the name
    marginTop: 8, // Space between the icon and name
    color: '#595959', // Gray color for better readability
    textAlign: 'center', // Center the text under the icon
  },
  underline: {
    width: 50,
    height: 4,
    backgroundColor: '#FFA500',
    marginTop: 10,
    borderRadius: 2,
    marginBottom: 8,
},
});

export default SolutionsComponent;

