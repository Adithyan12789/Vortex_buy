import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

type CartState = {
  cart: any;
  isLoading: boolean;
  counter: number;
  getCart: () => void;
  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  checkout: (amount: number) => void;
};

const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = "guest_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: { lineItems: [], subtotal: { amount: 0 } },
  isLoading: true,
  counter: 0,

  getCart: async () => {
    try {
      const guestId = getGuestId();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart?guestId=${guestId}`);
      const cart = res.data;
      set({
        cart: cart || { lineItems: [], subtotal: { amount: 0 } },
        isLoading: false,
        counter: cart?.lineItems?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ cart: { lineItems: [], subtotal: { amount: 0 } }, isLoading: false, counter: 0 });
    }
  },

  addItem: async (productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const guestId = getGuestId();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId, variantId, quantity, guestId }
      );
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
      const guestId = getGuestId();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/remove`,
        { itemId, guestId }
      );
      const cart = res.data.cart;
      set({ cart, counter: cart?.lineItems?.length || 0, isLoading: false });
    } catch (error) {
      console.error("Remove item failed", error);
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  checkout: async (amount: number) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const cart = get().cart;
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { amount, lineItems: cart.lineItems }
      );

      const order = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_12345abcdef",
        amount: order.amount,
        currency: order.currency,
        name: "Vortex Buy",
        description: "Official Transaction",
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verifyRes.data.success) {
            alert("Payment successful!");
            window.location.reload();
          }
        },
        theme: { color: "#000000" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));
