import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});

export function setAccessToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

const storedToken = localStorage.getItem("accessToken");
if (storedToken) {
  setAccessToken(storedToken);
}

export default api;
