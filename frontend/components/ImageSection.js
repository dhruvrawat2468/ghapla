import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// ImageSection Component: Displays an image inside a container
const ImageSection = ({ source }) => {
    return (
        <View style={styles.container}>
            <Image source={source} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', // Centers the image inside the container
        marginBottom: 20, // Adds spacing below the image
    },
    image: {
        width: '90%', // Makes the image responsive to screen width
        height: 150, // Fixed height for consistency
        resizeMode: 'contain', // Ensures the entire image fits within the given space
    },
});

export default ImageSection;
