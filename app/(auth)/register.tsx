import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    try {
      await register(name, email, password);
    } catch (error) {
      // Error is handled in the store
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Join CardScan</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <User size={20} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.placeholder}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.placeholder}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={colors.placeholder}
            />
            <Pressable 
              onPress={togglePasswordVisibility}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor={colors.placeholder}
            />
            <Pressable 
              onPress={toggleConfirmPasswordVisibility}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>
          
          <View style={styles.termsContainer}>
            <Pressable 
              style={styles.checkbox} 
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[
                styles.checkboxInner,
                agreeToTerms && styles.checkboxChecked
              ]} />
            </Pressable>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
          
          <Pressable 
            style={[
              styles.registerButton,
              (!name || !email || !password || !confirmPassword || !agreeToTerms || isLoading) && styles.disabledButton
            ]} 
            onPress={handleRegister}
            disabled={!name || !email || !password || !confirmPassword || !agreeToTerms || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </Pressable>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.socialButtons}>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Apple</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: colors.error + '15', // 15% opacity
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  socialButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});