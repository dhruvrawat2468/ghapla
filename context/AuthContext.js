// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native"; // Add this import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        setUserToken(token);
      }
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://192.168.1.7:5000/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      await AsyncStorage.setItem("authToken", token);
      setUserToken(token);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      // Adjust this endpoint based on your backend
      await axios.post("http://192.168.1.7:5000/auth/logout", {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout Error:", error);
      // Don’t block logout if backend fails
    }
    await AsyncStorage.removeItem("authToken");
    setUserToken(null);
    Alert.alert("Logged Out", "You have been successfully logged out.");
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};