import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers, searchUsers } from "../../services/userService";

// Fetch all users or search users by name
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async ({ limit = 10, skip = 0, searchQuery = "" }, { rejectWithValue }) => {
    try {
      if (searchQuery) {
        return await searchUsers(searchQuery, limit, skip);
      }
      return await getUsers(limit, skip);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
    totalUsers: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Add new user
    addUser: (state, action) => {
      state.allUsers.unshift(action.payload);
      state.totalUsers += 1;
    },

    // Update user
    editUser: (state, action) => {
      const index = state.allUsers.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.allUsers[index] = action.payload;
      }
    },

    // Delete user
    deleteUser: (state, action) => {
      state.allUsers = state.allUsers.filter((u) => u.id !== action.payload);
      if (state.totalUsers > 0) {
        state.totalUsers -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload.users;
        state.totalUsers = action.payload.total;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addUser, editUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
