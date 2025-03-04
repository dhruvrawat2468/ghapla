
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import OtpLoginScreen from "./screens/OtpLoginScreen";
import RepairNowScreen from "./screens/RepairNowScreen";
import TrackingScreen from "./screens/TrackingScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OtpLoginScreen" component={OtpLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RepairNowScreen" component={RepairNowScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TrackingScreen" component={TrackingScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
