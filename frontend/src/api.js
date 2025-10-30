// src/api.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API, // Ye base URL sab requests me lag jaega
  withCredentials: true, // optional, agar cookies/auth use karte ho
});

export default api;
