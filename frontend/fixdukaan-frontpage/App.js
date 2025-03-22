import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import HomeRepair from './screens/HomeRepair';
import PickupRepair from './screens/PickupRepair';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                {/* Defines the main Home screen without a header */}
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                
                {/* Defines the Home Repair screen */}
                <Stack.Screen name="HomeRepair" component={HomeRepair} />
                
                {/* Defines the Pickup Repair screen */}
                <Stack.Screen name="PickupRepair" component={PickupRepair} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
