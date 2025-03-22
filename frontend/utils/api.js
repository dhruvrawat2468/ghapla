import axios from "axios";

const API_URL = "http://172.20.10.3:3001";// ✅ Replace with your actual local IP

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // ✅ Set timeout to 10 seconds
});

export default API;

