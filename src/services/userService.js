import { api } from "./axios";

// Fetch users with pagination
export async function getUsers(limit = 10, skip = 0) {
  const response = await api.get(`/users?limit=${limit}&skip=${skip}`);
  return response.data;
}

// Search users by name
export async function searchUsers(query, limit = 10, skip = 0) {
  const response = await api.get(
    `/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  );
  return response.data;
}