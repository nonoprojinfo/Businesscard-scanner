import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Modal,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Calendar, Clock, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSetReminder: (date: number) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ 
  visible, 
  onClose,
  onSetReminder
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  const reminderOptions = [
    { id: 1, label: 'Demain', days: 1 },
    { id: 2, label: 'Dans 3 jours', days: 3 },
    { id: 3, label: 'Dans 1 semaine', days: 7 },
    { id: 4, label: 'Dans 2 semaines', days: 14 },
    { id: 5, label: 'Dans 1 mois', days: 30 },
  ];
  
  const handleSelect = (optionId: number) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedOption(optionId);
  };
  
  const handleConfirm = () => {
    if (selectedOption) {
      const option = reminderOptions.find(opt => opt.id === selectedOption);
      if (option) {
        const date = new Date();
        date.setDate(date.getDate() + option.days);
        onSetReminder(date.getTime());
      }
    }
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.modalTitle}>Définir un rappel de suivi</Text>
            </View>
            <Pressable 
              style={styles.closeButton} 
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={colors.text} />
            </Pressable>
          </View>
          
          <Text style={styles.modalDescription}>
            Choisissez quand vous souhaitez être rappelé de suivre ce contact
          </Text>
          
          <View style={styles.optionsContainer}>
            {reminderOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.optionItem,
                  selectedOption === option.id && styles.selectedOption
                ]}
                onPress={() => handleSelect(option.id)}
              >
                <Clock 
                  size={18} 
                  color={selectedOption === option.id ? 'white' : colors.primary} 
                />
                <Text 
                  style={[
                    styles.optionText,
                    selectedOption === option.id && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
          
          <View style={styles.buttonsContainer}>
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable 
              style={[
                styles.button, 
                styles.confirmButton,
                !selectedOption && styles.disabledButton
              ]} 
              onPress={handleConfirm}
              disabled={!selectedOption}
            >
              <Text style={styles.confirmButtonText}>Définir le rappel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    gap: 12,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
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
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
});