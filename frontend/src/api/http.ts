import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

// setup of api
export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});
