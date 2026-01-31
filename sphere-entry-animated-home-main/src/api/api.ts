import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "http://20.204.205.244:3000",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
