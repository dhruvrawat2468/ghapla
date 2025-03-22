import React, { useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Get the device screen width for responsive design
const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.5; // Dynamic image width based on screen size
const IMAGE_HEIGHT = 180; // Fixed image height

// List of deals displayed in the Hot Deals section

const deals = [
    {
        id: '1',
        image: require('../assets/images/fridge-discount.png'),
        discount: '50% OFF',
        description: 'Fridge Repair',
    },
    {
        id: '2',
        image: require('../assets/images/microwave-discount.png'),
        discount: '42% OFF',
        description: 'Microwave Repair',
    },
    {
        id: '3',
        image: require('../assets/images/laptop-discount.png'),
        discount: '30% OFF',
        description: 'Washing Machine Repair',
    },
    {
        id: '4',
        image: require('../assets/images/washingma-discount.png'),
        discount: '25% OFF',
        description: 'Laptop Repair',
    },
];

// Duplicate deals to create an infinite scrolling effect
const infiniteDeals = [...deals, ...deals];

const HotDeals = () => {
    const flatListRef = useRef(null); // Reference for FlatList
    const scrollX = useRef(new Animated.Value(0)).current; // Track horizontal scroll position

    // Handle scrolling end event and reset position if needed
    const handleScrollEnd = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const itemWidth = IMAGE_SIZE;
        const index = Math.round(contentOffsetX / itemWidth);

        if (index >= deals.length) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: false });
        }
    };

    return (
        <LinearGradient colors={['#fff3db', '#FFFFFF']} style={styles.gradientBackground}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Hot Deals</Text>
                    <View style={styles.underline} />
                </View>
                <FlatList
                    ref={flatListRef}
                    data={infiniteDeals}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()} 
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image source={item.image} style={styles.image} />
                        </View>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    snapToAlignment="center"
                    pagingEnabled
                    snapToInterval={IMAGE_SIZE}
                    onMomentumScrollEnd={handleScrollEnd} // Handle scrolling event
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.text1}>Fix it, <Text style={styles.italic}>Love it Again!</Text></Text>
                <Image source={require('../assets/images/pink-heart.png')} style={styles.heartIcon} />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
        marginTop: -30, 
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 12,
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
        fontStyle: 'italic',
    },
    underline: {
        width: 50,
        height: 4,
        backgroundColor: '#FFA500',
        marginTop: 10,
        borderRadius: 2,
        marginBottom: 3,
    },
    container: {
        paddingVertical: 20,
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: -20,
    },
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 160,
        height: IMAGE_HEIGHT + 20,
        borderRadius: 12,
    },
    image: {
        width: IMAGE_SIZE, 
        height: IMAGE_HEIGHT, 
        resizeMode: 'contain',
        borderRadius: 12,
    },
    text1: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    italic: {
        fontStyle: 'italic',
        fontWeight: '600',
    },
    heartIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
        marginLeft: 5,
        marginBottom: 0,
    },
});

export default HotDeals;
