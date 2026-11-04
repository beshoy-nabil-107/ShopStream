import { api } from "./axios";

// Fetch featured products
export async function getFeaturedProducts() {
  const response = await api.get("/products?limit=12");
  return response.data.products;
}

// Fetch products with pagination and sorting
export async function getProducts(
  limit = 30,
  skip = 0,
  sortBy = "",
  order = "",
) {
  let url = `/products?limit=${limit}&skip=${skip}`;
  if (sortBy && order) {
    // Add sorting parameters if provided
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  const response = await api.get(url);
  return response.data;
}

// Fetch category products with pagination and sorting
export async function getProductsByCategory(
  category,
  limit = 30,
  skip = 0,
  sortBy = "",
  order = "",
) {
  let url = `/products/category/${category}?limit=${limit}&skip=${skip}`;
  if (sortBy && order) {
    // Add sorting parameters if provided
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  const response = await api.get(url);
  return response.data;
}

// Fetch single product details by ID
export async function getProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

// Search products
export async function searchProducts(
  query,
  limit = 30,
  skip = 0,
  sortBy = "",
  order = ""
) {
  let url = `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
  if (sortBy && order) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }
  const response = await api.get(url);
  return response.data;
}
