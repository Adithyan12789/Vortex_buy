import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
  fetchProfile: () => Promise<UserProfile | null>;
  updateUser: (updatedData: Partial<UserProfile>) => void;
  checkAuth: () => Promise<void>;
}

const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem("vortex_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  token: Cookies.get("token") || null,
  isAuthenticated: !!Cookies.get("token"),
  isLoading: true,

  setAuth: (token: string, user: UserProfile) => {
    Cookies.set("token", token, { expires: 30 });
    localStorage.setItem("vortex_user", JSON.stringify(user));
    set({
      token,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    Cookies.remove("token");
    localStorage.removeItem("vortex_user");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  fetchProfile: async () => {
    const token = Cookies.get("token");
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }

    try {
      set({ isLoading: true });
      const res = await axios.get(`${getApiUrl()}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      const user: UserProfile = {
        id: data._id || data.id,
        username: data.username,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        postalCode: data.postalCode || '',
        country: data.country || '',
        avatar: data.avatar || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      localStorage.setItem("vortex_user", JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false, token });
      return user;
    } catch (err: any) {
      console.warn("Failed to fetch user profile:", err?.response?.data || err.message);
      if (err.response?.status === 401) {
        Cookies.remove("token");
        localStorage.removeItem("vortex_user");
        set({ user: null, isAuthenticated: false, token: null, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return null;
    }
  },

  updateUser: (updatedData: Partial<UserProfile>) => {
    const currentUser = get().user;
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedData };
      localStorage.setItem("vortex_user", JSON.stringify(newUser));
      set({ user: newUser });
    }
  },

  checkAuth: async () => {
    const token = Cookies.get("token");
    if (!token) {
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    await get().fetchProfile();
  }
}));
