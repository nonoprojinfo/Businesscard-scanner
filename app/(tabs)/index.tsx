import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ContactCard } from '@/components/ContactCard';
import { EmptyState } from '@/components/EmptyState';
import { PremiumBanner } from '@/components/PremiumBanner';
import { useContactStore } from '@/store/contactStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function ContactsScreen() {
  const router = useRouter();
  const { contacts } = useContactStore();
  const { contactsCount, maxFreeContacts, isPremium } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = contacts.filter(
        contact => 
          contact.name.toLowerCase().includes(query) ||
          contact.company.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.phone.includes(query)
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);
  
  const handleAddContact = () => {
    router.push('/scan');
  };
  
  const handleUpgrade = () => {
    router.push('/profile');
  };
  
  const renderHeader = () => (
    <>
      {!isPremium && contactsCount > 0 && (
        <PremiumBanner 
          contactsCount={contactsCount}
          maxFreeContacts={maxFreeContacts}
          onUpgrade={handleUpgrade}
        />
      )}
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearching(true)}
            placeholderTextColor={colors.placeholder}
          />
          {searchQuery ? (
            <Pressable 
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>
      
      {isSearching && searchQuery && filteredContacts.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>Aucun contact trouvé</Text>
        </View>
      ) : null}
    </>
  );
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (contacts.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactCard contact={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
      />
      
      <Pressable 
        style={styles.fab} 
        onPress={handleAddContact}
      >
        <Plus size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  noResults: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});