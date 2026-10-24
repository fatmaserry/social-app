import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_tkn");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default http;
