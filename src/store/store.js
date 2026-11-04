import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
    users: userReducer,
  },
});