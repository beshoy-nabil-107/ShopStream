import { api } from "./axios";

// Categories Endpoint
const categoriesEndpoint = "/products/categories";

// Fetch all categories
export async function getAllCategories() {
  const response = await api.get(categoriesEndpoint);
  return response.data;
}