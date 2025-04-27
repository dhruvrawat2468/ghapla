import React, { useState, useEffect, useContext } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login, userToken } = useContext(AuthContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        navigation.navigate("HomeMain");
      }
    };
    checkLoginStatus();
  }, [userToken]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
      />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.showPasswordText}>{showPassword ? "Hide" : "Show"} Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#f76a06",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  showPasswordText: {
    color: "#f76a06",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#f76a06",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
