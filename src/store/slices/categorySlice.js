import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllCategories } from "../../services/categoryService";
// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "categorySlice/fetchCategories",
  async function (_, { rejectWithValue }) {
    try {
      const data = await getAllCategories();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

const categorySlice = createSlice({
  name: "categorySlice",
  initialState: {
    categories: JSON.parse(localStorage.getItem("categories")) || [],
    isLoading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Handle fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
        localStorage.setItem("categories", JSON.stringify(action.payload));
        state.error = null;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
