import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart
      ? JSON.parse(savedCart)
      : { items: [], totalQuantity: 0, totalPrice: 0 };
  } catch {
    return { items: [], totalQuantity: 0, totalPrice: 0 };
  }
};

// Recalculate totals and save to localStorage
const updateCartTotals = (state) => {
  state.totalQuantity = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  state.totalPrice = Number(
    state.items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
  );
  localStorage.setItem("cart", JSON.stringify(state));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item or increment existing quantity
    addToCart: (state, action) => {
      const { product, quantity = 1, selectedColor = null } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        existingItem.quantity = product.stock
          ? Math.min(newQty, product.stock)
          : newQty;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          category: product.category,
          brand: product.brand,
          stock: product.stock || 20,
          selectedColor,
          quantity,
        });
      }

      updateCartTotals(state);
    },

    // Remove item completely
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      updateCartTotals(state);
    },

    // Update specific item quantity (+ / -)
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem && quantity >= 1 && quantity <= existingItem.stock) {
        existingItem.quantity = quantity;
        updateCartTotals(state);
      }
    },

    // Empty the cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;