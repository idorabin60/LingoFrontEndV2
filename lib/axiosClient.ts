// src/api/axiosClient.js

import axios from "axios";

// You might want to store this in an environment variable:
const BASE_URL = "https://aslibackend-render.onrender.com";

// Create an instance of axios with default settings:
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// OPTIONAL: Set up an interceptor to automatically attach the token
axiosClient.interceptors.request.use(
  (config) => {
    // Try retrieving the token from localStorage (or wherever you store it)
    const token = localStorage.getItem("token");
    // If a token exists, attach it to the request as an Authorization header
    if (token) {
      // The example in your question shows using `Authorization: token <TOKEN>`
      // Some backends use `Bearer <TOKEN>`. Adjust accordingly.
      config.headers.Authorization = `token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;