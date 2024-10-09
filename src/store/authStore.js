import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      setLoginState: (token) => set({ isLoggedIn: true, token }),
      setLogoutState: () => set({ isLoggedIn: false, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;