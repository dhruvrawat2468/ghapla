import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const images = [
  { id: 1, source: require('../assets/images/i1.png') },
  { id: 2, source: require('../assets/images/i2.png') },
  { id: 3, source: require('../assets/images/i3.png') },
];

const CarouselImageComponent = () => {
  return (
    <View style={styles.wrapper}>
      
      <View style={styles.carouselContainer}>
      <LinearGradient
          colors={['#FFF5E1', '#FFFFFF']} // Example gradient colors (orange to yellow)
          style={styles.gradientBackground}
        >
        <Carousel
          data={images}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.source} style={styles.image} />
            </View>
          )}
          width={width * 1.1} // Full width of the screen
          height={260} // Height of the carousel item
          loop // Enable infinite looping
          autoPlay // Enable auto-play
          mode="parallax" // Add sliding effect
          modeConfig={{
            parallaxScrollingScale: 0.8, // Scale of the inactive items
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  carouselContainer: {
    height: 200,
    
  },
  slide: {
  
    overflow: 'hidden',
    shadowColor:'black',
    shadowOpacity: 0.5,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 5,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 20,
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 5,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 20,

  },
});

export default CarouselImageComponent;
