import { create } from "zustand";
import axios from "axios";

type CartState = {
  cart: any;
  isLoading: boolean;
  counter: number;
  getCart: () => void;
  addItem: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  removeItem: (itemId: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  isLoading: true,
  counter: 0,

  getCart: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart");
      const cart = res.data;
      set({
        cart: cart || { lineItems: [] },
        isLoading: false,
        counter: cart?.lineItems?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ cart: { lineItems: [] }, isLoading: false, counter: 0 });
    }
  },

  addItem: async (productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const res = await axios.post("http://localhost:5000/api/cart/add", {
        productId,
        variantId,
        quantity
      });
      const cart = res.data.cart;
      set({ cart, counter: cart?.lineItems?.length || 0, isLoading: false });
    } catch (error) {
      console.error("Add item failed", error);
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  removeItem: async (itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const res = await axios.post("http://localhost:5000/api/cart/remove", { itemId });
      const cart = res.data.cart;
      set({ cart, counter: cart?.lineItems?.length || 0, isLoading: false });
    } catch (error) {
      console.error("Remove item failed", error);
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));
