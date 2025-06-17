import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isOnboardingComplete: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would make an API call to authenticate
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          if (email && password) {
            set({
              user: {
                id: '1',
                email,
                name: email.split('@')[0],
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would make an API call to register
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful registration
          if (name && email && password) {
            set({
              user: {
                id: '1',
                email,
                name,
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error('Please fill all fields');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
          });
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      
      completeOnboarding: () => {
        set({ isOnboardingComplete: true });
      },
      
      checkAuth: () => {
        // In a real app, this would check if the token is valid
        // For now, we just check if we have a user in the store
        const { user } = get();
        set({ isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);