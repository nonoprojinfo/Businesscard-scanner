import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Briefcase, 
  Globe, 
  MapPin, 
  FileText, 
  Tag, 
  X, 
  Plus 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ContactFormData } from '@/types/contact';

interface ContactFormProps {
  initialData?: ContactFormData;
  imageUri?: string;
  onSubmit: (data: ContactFormData) => void;
  isLoading?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ 
  initialData, 
  imageUri, 
  onSubmit,
  isLoading = false
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    position: '',
    website: '',
    address: '',
    notes: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };
  
  const handleSubmit = () => {
    onSubmit(formData);
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const renderFormField = (
    icon: React.ReactNode,
    placeholder: string,
    value: string,
    field: keyof ContactFormData,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'url' = 'default'
  ) => (
    <View style={styles.inputContainer}>
      {icon}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => handleChange(field, text)}
        keyboardType={keyboardType}
        placeholderTextColor={colors.placeholder}
      />
    </View>
  );
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              contentFit="cover"
            />
          </View>
        )}
        
        <View style={styles.form}>
          {renderFormField(
            <User size={20} color={colors.primary} />,
            "Nom complet",
            formData.name,
            'name'
          )}
          
          {renderFormField(
            <Building2 size={20} color={colors.primary} />,
            "Entreprise",
            formData.company,
            'company'
          )}
          
          {renderFormField(
            <Briefcase size={20} color={colors.primary} />,
            "Poste",
            formData.position,
            'position'
          )}
          
          {renderFormField(
            <Mail size={20} color={colors.primary} />,
            "Email",
            formData.email,
            'email',
            'email-address'
          )}
          
          {renderFormField(
            <Phone size={20} color={colors.primary} />,
            "Téléphone",
            formData.phone,
            'phone',
            'phone-pad'
          )}
          
          {renderFormField(
            <Globe size={20} color={colors.primary} />,
            "Site web",
            formData.website,
            'website',
            'url'
          )}
          
          {renderFormField(
            <MapPin size={20} color={colors.primary} />,
            "Adresse",
            formData.address,
            'address'
          )}
          
          <View style={styles.notesContainer}>
            <View style={styles.notesHeader}>
              <FileText size={20} color={colors.primary} />
              <Text style={styles.notesLabel}>Notes</Text>
            </View>
            <TextInput
              style={styles.notesInput}
              placeholder="Ajoutez des notes sur ce contact..."
              value={formData.notes}
              onChangeText={(text) => handleChange('notes', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={colors.placeholder}
            />
          </View>
          
          <View style={styles.tagsSection}>
            <View style={styles.tagsHeader}>
              <Tag size={20} color={colors.primary} />
              <Text style={styles.tagsLabel}>Tags</Text>
            </View>
            
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Ajouter un tag..."
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
                placeholderTextColor={colors.placeholder}
              />
              <Pressable 
                style={styles.addTagButton} 
                onPress={handleAddTag}
                disabled={!tagInput.trim()}
              >
                <Plus size={20} color="white" />
              </Pressable>
            </View>
            
            {formData.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {formData.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <Pressable
                      onPress={() => handleRemoveTag(tag)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <X size={14} color={colors.primary} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        <Pressable 
          style={[styles.button, styles.cancelButton]} 
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Pressable>
        <Pressable 
          style={[
            styles.button, 
            styles.saveButton,
            (!formData.name || isLoading) && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={!formData.name || isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer le contact'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: '90%',
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.placeholder,
  },
  form: {
    paddingHorizontal: 16,
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  notesContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    padding: 12,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notesLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  notesInput: {
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
  },
  tagsSection: {
    gap: 12,
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagsLabel: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  tagInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  addTagButton: {
    backgroundColor: colors.primary,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15', // 15% opacity
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
});