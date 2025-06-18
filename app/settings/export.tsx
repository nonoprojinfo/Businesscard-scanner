import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Stack } from 'expo-router';
import { Download, FileText, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useContactStore } from '@/store/contactStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function ExportScreen() {
  const { contacts } = useContactStore();
  const { isPremium } = useSettingsStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  
  const handleExport = async () => {
    if (!isPremium) {
      Alert.alert(
        "Fonctionnalité Premium",
        "L'exportation des contacts est une fonctionnalité Premium. Passez à Premium pour y accéder."
      );
      return;
    }
    
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      
      Alert.alert(
        "Exportation réussie",
        "Vos contacts ont été exportés avec succès. Dans une application réelle, un fichier CSV serait téléchargé ou partagé."
      );
    }, 2000);
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Exporter les contacts" }} />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FileText size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Exporter vos contacts</Text>
          <Text style={styles.subtitle}>
            Téléchargez vos contacts au format CSV pour les utiliser dans d'autres applications
          </Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informations sur l'exportation</Text>
          <Text style={styles.infoText}>
            • Le fichier exporté contiendra tous vos contacts ({contacts.length})
          </Text>
          <Text style={styles.infoText}>
            • Format : CSV (compatible avec Excel, Google Sheets, etc.)
          </Text>
          <Text style={styles.infoText}>
            • Inclut : nom, entreprise, email, téléphone, notes et autres détails
          </Text>
        </View>
        
        {exportComplete ? (
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Check size={24} color="white" />
            </View>
            <Text style={styles.successText}>Exportation réussie</Text>
            <Text style={styles.successSubtext}>
              Vos contacts ont été exportés avec succès
            </Text>
          </View>
        ) : (
          <Pressable 
            style={[styles.exportButton, isExporting && styles.exportingButton]} 
            onPress={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Download size={20} color="white" />
                <Text style={styles.exportButtonText}>Exporter les contacts</Text>
              </>
            )}
          </Pressable>
        )}
        
        <Text style={styles.disclaimer}>
          Vos données sont exportées uniquement sur votre appareil et ne sont pas partagées avec des tiers.
        </Text>
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
    marginBottom: 32,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  exportingButton: {
    opacity: 0.7,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  successContainer: {
    alignItems: 'center',
    backgroundColor: colors.success + '10', // 10% opacity
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  successIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});