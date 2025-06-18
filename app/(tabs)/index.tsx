import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  TextInput,
  ActivityIndicator,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, X, Filter } from 'lucide-react-native';
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
  const fadeAnim = new Animated.Value(0);
  
  useEffect(() => {
    // Simulate loading data with animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 800);
    
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
    router.push('/settings/subscription');
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
      
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textSecondary} />
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
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={18} color={colors.textSecondary} />
              </Pressable>
            ) : null}
          </View>
          
          <Pressable style={styles.filterButton}>
            <Filter size={20} color={colors.primary} />
          </Pressable>
        </View>
        
        {contacts.length > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {filteredContacts.length} contact{filteredContacts.length > 1 ? 's' : ''}
              {searchQuery ? ` trouvé${filteredContacts.length > 1 ? 's' : ''}` : ''}
            </Text>
          </View>
        )}
      </View>
      
      {isSearching && searchQuery && filteredContacts.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>Aucun contact trouvé</Text>
          <Text style={styles.noResultsSubtext}>Essayez un autre terme de recherche</Text>
        </View>
      ) : null}
    </>
  );
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement des contacts...</Text>
      </View>
    );
  }
  
  if (contacts.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContactCard contact={item} />}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
      
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
  content: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statsContainer: {
    paddingHorizontal: 4,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  noResults: {
    padding: 32,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});