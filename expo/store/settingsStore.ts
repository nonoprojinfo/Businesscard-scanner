import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  isPremium: boolean;
  contactsCount: number;
  maxFreeContacts: number;
  setPremium: (value: boolean) => void;
  incrementContactsCount: () => void;
  decrementContactsCount: () => void;
  canAddContact: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      isPremium: false,
      contactsCount: 0,
      maxFreeContacts: 3, // Changed from 10 to 3 as requested
      
      setPremium: (value) => {
        set({ isPremium: value });
      },
      
      incrementContactsCount: () => {
        set((state) => ({ contactsCount: state.contactsCount + 1 }));
      },
      
      decrementContactsCount: () => {
        set((state) => ({ 
          contactsCount: Math.max(0, state.contactsCount - 1) 
        }));
      },
      
      canAddContact: () => {
        const { isPremium, contactsCount, maxFreeContacts } = get();
        return isPremium || contactsCount < maxFreeContacts;
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);