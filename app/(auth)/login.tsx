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
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the store
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop' }}
              style={styles.logoBackground}
              contentFit="cover"
            />
            <View style={styles.logoOverlay} />
          </View>
          <Text style={styles.appName}>CardScan</Text>
          <Text style={styles.tagline}>Your business cards, digitized</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
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
          
          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
          
          <Pressable 
            style={[
              styles.loginButton,
              (!email || !password || isLoading) && styles.disabledButton
            ]} 
            onPress={handleLogin}
            disabled={!email || !password || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
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
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Sign Up</Text>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  logoBackground: {
    width: '100%',
    height: '100%',
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  formContainer: {
    paddingHorizontal: 24,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
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