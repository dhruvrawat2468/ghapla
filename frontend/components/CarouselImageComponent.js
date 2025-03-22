import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';

// Get the width of the device screen
const { width } = Dimensions.get('window');

// Image data for the carousel
const images = [
  { id: 1, source: require('../assets/images/i1.png') },
  { id: 2, source: require('../assets/images/i2.png') },
  { id: 3, source: require('../assets/images/i3.png') },
];

const CarouselImageComponent = () => {
  return (
    <View style={styles.wrapper}>
      {/* Container for the Carousel with gradient background */}
      <View style={styles.carouselContainer}>
        <LinearGradient
          colors={['#FFF5E1', '#FFFFFF']} // Light gradient background
          style={styles.gradientBackground}
        >
          {/* Carousel component */}
          <Carousel
            data={images} // Array of images
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image source={item.source} style={styles.image} />
              </View>
            )}
            width={width * 1.1} // Width of the carousel items
            height={260} // Height of the carousel items
            loop // Enables infinite scrolling
            autoPlay // Enables automatic slide transitions
            mode="parallax" // Adds a parallax effect to slides
            modeConfig={{
              parallaxScrollingScale: 0.8, // Scale of non-active items
              parallaxScrollingOffset: 40, // Offset for the parallax effect
            }}
          />
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  carouselContainer: {
    height: 200,
  },
  slide: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 20, // Adds shadow for Android
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover', // Maintains aspect ratio
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 20, // Adds shadow for Android
  },
});

export default CarouselImageComponent;