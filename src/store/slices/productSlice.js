import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getFeaturedProducts,
  getProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
} from "../../services/productService";

// Fetch featured products
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getFeaturedProducts();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products",
      );
    }
  },
);

// Fetch products (All, Category, or Search)
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (
    {
      limit = 30,
      skip = 0,
      category = "",
      searchQuery = "",
      sortBy = "",
      order = "",
    },
    { rejectWithValue },
  ) => {
    try {
      if (searchQuery) {
        return await searchProducts(searchQuery, limit, skip, sortBy, order);
      }
      if (category && category !== "all") {
        return await getProductsByCategory(
          category,
          limit,
          skip,
          sortBy,
          order,
        );
      }
      return await getProducts(limit, skip, sortBy, order);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      return await getProductById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details",
      );
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    featuredProducts: [],
    allProducts: [],
    selectedProduct: null,
    total: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Add new product
    addProduct: (state, action) => {
      state.allProducts.unshift(action.payload);
      state.total += 1;
    },

    // Update product
    editProduct: (state, action) => {
      const index = state.allProducts.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.allProducts[index] = action.payload;
      }
    },

    // Delete product
    deleteProduct: (state, action) => {
      state.allProducts = state.allProducts.filter(
        (item) => item.id !== action.payload,
      );
      if (state.total > 0) {
        state.total -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allProducts = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Single Product Details
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addProduct, editProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;