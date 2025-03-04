
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const Services = ({ navigation }) => {
    return (
        <LinearGradient colors={['#fff3db', '#FFFFFF']} style={styles.gradientBackground}>
            <View style={styles.container}>
                <Text style={styles.title}>Our Services</Text>
                <View style={styles.underline} />
                <View style={styles.servicesContainer}>
                    <TouchableOpacity 
                        style={styles.serviceButton} 
                        onPress={() => navigation.navigate('HomeRepair')}
                    >
                        <Image source={require('../assets/images/service1.png')} style={styles.image} />
                        <Text style={styles.buttonText}></Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.serviceButton} 
                        onPress={() => navigation.navigate('PickupRepair')}
                    >
                        <Image source={require('../assets/images/service2.png')} style={styles.image} />
                        <Text style={styles.buttonText}></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
        marginTop: 2, 
        marginBottom: 0,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 30, 
        fontWeight: 'bold',
        marginTop: -5,
        color: '#575757',
        fontFamily: 'ROBOTA', 
        letterSpacing: 1, 
        textShadowColor: 'rgba(0, 0, 0, 0.35)', 
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        textTransform: 'uppercase',
       
    },
    
    underline: {
        width: 50,
        height: 4,
        backgroundColor: '#FFA500',
        marginTop: 10,
        borderRadius: 2,
        marginBottom: 8,
    },
    container: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    servicesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    image: {
        width: 170,
        height: 160,
        resizeMode: 'contain',
    },
});

export default Services;


