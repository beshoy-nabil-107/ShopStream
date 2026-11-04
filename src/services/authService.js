import { api } from "./axios";

// Login user
export async function authLogin({ username, password }) {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
}

// Register user
export async function authRegister(userData) {
  const response = await api.post("/users/add", userData);
  return response.data;
}