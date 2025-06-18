import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  Alert
} from 'react-native';
import { Stack } from 'expo-router';
import { 
  HelpCircle, 
  FileText, 
  MessageCircle, 
  Mail, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function HelpScreen() {
  const handleOpenLink = (title: string) => {
    Alert.alert(
      "Ouvrir le lien",
      `Ceci ouvrirait la page "${title}" dans le navigateur ou dans l'application.`
    );
  };
  
  const renderHelpItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    onPress: () => void
  ) => (
    <Pressable 
      style={({ pressed }) => [
        styles.helpItem,
        pressed && styles.helpItemPressed
      ]}
      onPress={onPress}
    >
      <View style={styles.helpItemContent}>
        <View style={styles.helpItemIcon}>
          {icon}
        </View>
        <View style={styles.helpItemText}>
          <Text style={styles.helpItemTitle}>{title}</Text>
          <Text style={styles.helpItemDescription}>{description}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={colors.textSecondary} />
    </Pressable>
  );
  
  return (
    <>
      <Stack.Screen options={{ title: "Aide & Support" }} />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <HelpCircle size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Comment pouvons-nous vous aider ?</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Pressable 
            style={styles.searchBar}
            onPress={() => Alert.alert("Recherche", "Ceci ouvrirait une barre de recherche pour trouver de l'aide.")}
          >
            <Text style={styles.searchPlaceholder}>Rechercher dans l'aide...</Text>
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ressources d'aide</Text>
          
          {renderHelpItem(
            <FileText size={22} color={colors.primary} />,
            "Guide d'utilisation",
            "Apprenez à utiliser toutes les fonctionnalités de l'application",
            () => handleOpenLink("Guide d'utilisation")
          )}
          
          {renderHelpItem(
            <FileText size={22} color={colors.primary} />,
            "FAQ",
            "Réponses aux questions fréquemment posées",
            () => handleOpenLink("FAQ")
          )}
          
          {renderHelpItem(
            <ExternalLink size={22} color={colors.primary} />,
            "Tutoriels vidéo",
            "Regardez des vidéos pour apprendre à utiliser l'application",
            () => handleOpenLink("Tutoriels vidéo")
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nous contacter</Text>
          
          {renderHelpItem(
            <MessageCircle size={22} color={colors.primary} />,
            "Chat en direct",
            "Discutez avec notre équipe de support",
            () => handleOpenLink("Chat en direct")
          )}
          
          {renderHelpItem(
            <Mail size={22} color={colors.primary} />,
            "Email",
            "Envoyez-nous un email à support@cardscan.com",
            () => handleOpenLink("Email")
          )}
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version de l'application: 1.0.0</Text>
          <Pressable 
            style={styles.termsLink}
            onPress={() => handleOpenLink("Conditions d'utilisation")}
          >
            <Text style={styles.termsLinkText}>Conditions d'utilisation</Text>
          </Pressable>
          <Pressable 
            style={styles.termsLink}
            onPress={() => handleOpenLink("Politique de confidentialité")}
          >
            <Text style={styles.termsLinkText}>Politique de confidentialité</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15', // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 32,
  },
  searchBar: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    color: colors.placeholder,
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  helpItemPressed: {
    opacity: 0.8,
    backgroundColor: colors.highlight,
  },
  helpItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helpItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10', // 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helpItemText: {
    flex: 1,
    marginRight: 8,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  helpItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  termsLink: {
    marginBottom: 12,
  },
  termsLinkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});