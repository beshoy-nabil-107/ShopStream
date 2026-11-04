import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authLogin, authRegister } from "../../services/authService";

// Load auth from storage
const loadAuthFromStorage = () => {
  try {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (
      !savedToken ||
      savedToken === "undefined" ||
      !savedUser ||
      savedUser === "undefined"
    ) {
      return { user: null, token: null, isLoggedIn: false };
    }

    return {
      user: JSON.parse(savedUser),
      token: savedToken,
      isLoggedIn: true,
    };
  } catch {
    return { user: null, token: null, isLoggedIn: false };
  }
};

// Login
export const login = createAsyncThunk(
  "authSlice/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      return await authLogin({ username, password });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to login"
      );
    }
  }
);

// Register
export const register = createAsyncThunk(
  "authSlice/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await authRegister(userData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register"
      );
    }
  }
);

const initialAuth = loadAuthFromStorage();

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    isLoading: false,
    error: null,
    user: initialAuth.user,
    isLoggedIn: initialAuth.isLoggedIn,
    token: initialAuth.token,
  },
  reducers: {
    // Update user
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    // Logout user
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.token = action.payload?.accessToken;

        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("token", action.payload?.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        const simulatedToken = `simulated-token-${Date.now()}`;
        const newUser = {
          ...action.payload,
          image:
            action.payload.image || "https://dummyjson.com/icon/emilys/128",
        };

        state.user = newUser;
        state.isLoggedIn = true;
        state.token = simulatedToken;

        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("token", simulatedToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;