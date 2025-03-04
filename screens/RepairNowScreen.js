
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CarouselImageComponent from '../components/CarouselImageComponent';
import OurServices from '../components/OurServices';
import SolutionsComponent from '../components/Solutions';
import RepairBig from '../components/RepairBig';

const RepairNowScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}></Text>
      
      {/* Carousel Section */}
      <View style={styles.carouselWrapper}>
        <CarouselImageComponent />
      </View>

      {/* Our Services Section */}
      <View style={styles.servicesWrapper}>
        <OurServices />
      </View>

      <View style={styles.solutionWrapper}>
        <SolutionsComponent />
      </View>

      <View style={styles.solutionWrapper}>
        <RepairBig />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // header: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   marginTop: 40,
  //   marginBottom: 3,
  // },
  carouselWrapper: {
    height: 255, // Ensures proper space for the carousel
    alignItems: 'center',
  },
  servicesWrapper: {
     // Adds spacing before the services section
     marginTop:'-30'
  },
  solutionWrapper: {
    marginTop: '-40'
  }
});

export default RepairNowScreen;
