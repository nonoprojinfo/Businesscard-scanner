import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact, ContactFormData } from '@/types/contact';

interface ContactState {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  addContact: (contact: ContactFormData, imageUri?: string) => void;
  updateContact: (id: string, contact: ContactFormData) => void;
  deleteContact: (id: string) => void;
  setReminder: (id: string, date: number) => void;
  getContactById: (id: string) => Contact | undefined;
  searchContacts: (query: string) => Contact[];
  filterContactsByTag: (tag: string) => Contact[];
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      isLoading: false,
      error: null,
      
      addContact: (contactData, imageUri) => {
        const newContact: Contact = {
          id: Date.now().toString(),
          ...contactData,
          imageUri,
          createdAt: Date.now(),
        };
        
        set((state) => ({
          contacts: [newContact, ...state.contacts],
        }));
      },
      
      updateContact: (id, contactData) => {
        set((state) => ({
          contacts: state.contacts.map((contact) => 
            contact.id === id 
              ? { ...contact, ...contactData, updatedAt: Date.now() } 
              : contact
          ),
        }));
      },
      
      deleteContact: (id) => {
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        }));
      },
      
      setReminder: (id, date) => {
        set((state) => ({
          contacts: state.contacts.map((contact) => 
            contact.id === id 
              ? { ...contact, reminderDate: date } 
              : contact
          ),
        }));
      },
      
      getContactById: (id) => {
        return get().contacts.find((contact) => contact.id === id);
      },
      
      searchContacts: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().contacts.filter(
          (contact) => 
            contact.name.toLowerCase().includes(lowerQuery) ||
            contact.company.toLowerCase().includes(lowerQuery) ||
            contact.email.toLowerCase().includes(lowerQuery) ||
            contact.phone.includes(query)
        );
      },
      
      filterContactsByTag: (tag) => {
        return get().contacts.filter(
          (contact) => contact.tags.includes(tag)
        );
      },
    }),
    {
      name: 'contacts-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);