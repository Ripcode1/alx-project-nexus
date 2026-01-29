import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/types';

const save = (items: CartItem[]) => { if (typeof window !== 'undefined') localStorage.setItem('cart', JSON.stringify(items)); };

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity: number }>) {
      const ex = state.items.find((i) => i.product.id === action.payload.product.id);
      if (ex) ex.quantity += action.payload.quantity;
      else state.items.push({ product: action.payload.product, quantity: action.payload.quantity });
      save(state.items);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      save(state.items);
    },
    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.productId);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
      save(state.items);
    },
    clearCart(state) {
      state.items = [];
      if (typeof window !== 'undefined') localStorage.removeItem('cart');
    },
    loadCartFromStorage(state) {
      if (typeof window !== 'undefined') {
        const s = localStorage.getItem('cart');
        if (s) try { state.items = JSON.parse(s); } catch { /* skip */ }
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
