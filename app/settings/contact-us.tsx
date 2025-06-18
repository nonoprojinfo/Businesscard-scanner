import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { Mail, Send } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function ContactUsScreen() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate sending the message
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Message envoyé",
        "Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.",
        [
          { 
            text: "OK", 
            onPress: () => {
              setSubject('');
              setMessage('');
            }
          }
        ]
      );
    }, 1500);
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Contactez-nous" }} />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Mail size={40} color={colors.primary} />
            </View>
            <Text style={styles.title}>Envoyez-nous un message</Text>
            <Text style={styles.subtitle}>
              Notre équipe est là pour vous aider. Nous vous répondrons dans les plus brefs délais.
            </Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sujet</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Ex: Question sur l'abonnement"
                placeholderTextColor={colors.placeholder}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Décrivez votre problème ou posez votre question..."
                placeholderTextColor={colors.placeholder}
                multiline
                textAlignVertical="top"
              />
            </View>
            
            <Pressable 
              style={[
                styles.submitButton,
                (!subject.trim() || !message.trim() || isSubmitting) && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!subject.trim() || !message.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Send size={20} color="white" />
                  <Text style={styles.submitButtonText}>Envoyer</Text>
                </>
              )}
            </Pressable>
          </View>
          
          <View style={styles.alternativeContainer}>
            <Text style={styles.alternativeTitle}>Autres moyens de nous contacter</Text>
            
            <View style={styles.alternativeItem}>
              <Text style={styles.alternativeLabel}>Email:</Text>
              <Text style={styles.alternativeValue}>support@cardscan.com</Text>
            </View>
            
            <View style={styles.alternativeItem}>
              <Text style={styles.alternativeLabel}>Téléphone:</Text>
              <Text style={styles.alternativeValue}>+33 1 23 45 67 89</Text>
            </View>
            
            <View style={styles.alternativeItem}>
              <Text style={styles.alternativeLabel}>Horaires:</Text>
              <Text style={styles.alternativeValue}>Lun-Ven, 9h-18h (CET)</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
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
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  messageInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 150,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  alternativeContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alternativeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  alternativeItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  alternativeLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    width: 100,
  },
  alternativeValue: {
    fontSize: 15,
    color: colors.primary,
    flex: 1,
  },
});