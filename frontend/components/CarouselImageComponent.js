import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from './SearchBar';

// Get the width of the device screen
const { width } = Dimensions.get('window');

// Image data for the carousel
const images = [
  { id: 1, source: require('../assets/images/i1.png') },
  { id: 2, source: require('../assets/images/i2.png') },
  { id: 3, source: require('../assets/images/i3.png') },
];


const CarouselImageComponent = () => {
  const [selectedSearch, setSelectedSearch] = useState('');
  
  return (
    <View style={styles.wrapper}>
      {/* Container for the Carousel with gradient background */}
      <View style={styles.carouselContainer}>
        <LinearGradient
          colors={['#FFF5E1', '#FFFFFF']}
          style={styles.gradientBackground}
        >
          {/* Carousel component */}
          <Carousel
            data={images}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image source={item.source} style={styles.image} />
              </View>
            )}
            width={width * 1.1}
            height={260}
            loop
            autoPlay
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.8,
              parallaxScrollingOffset: 40,
            }}
          />
        </LinearGradient>
      </View>
      {/* Move SearchBar here, outside the gradient but inside the wrapper */}
      <SearchBar onSearchSelect={setSelectedSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 70,
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