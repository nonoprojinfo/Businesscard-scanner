import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Camera, X, Check, RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { ContactFormData } from '@/types/contact';

interface ScannerProps {
  onScanComplete: (data: ContactFormData, imageUri: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<any>(null);
  
  const handleCapture = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    try {
      // In a real app, we would use the camera's takePictureAsync method
      // For this demo, we'll simulate capturing an image
      const mockImageUri = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop';
      setCapturedImage(mockImageUri);
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };
  
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCapturedImage(result.assets[0].uri);
    }
  };
  
  const handleRetake = () => {
    setCapturedImage(null);
  };
  
  const handleProcess = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, we would send the image to an OCR API
      // For this demo, we'll simulate the OCR process with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock OCR result
      const mockOcrResult: ContactFormData = {
        name: 'John Smith',
        company: 'Acme Corporation',
        email: 'john.smith@acme.com',
        phone: '+1 (555) 123-4567',
        position: 'Sales Director',
        website: 'www.acmecorp.com',
        address: '123 Business Ave, San Francisco, CA 94107',
        notes: '',
        tags: ['Sales', 'Technology'],
      };
      
      onScanComplete(mockOcrResult, capturedImage);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process business card. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  if (!permission) {
    return <View />;
  }
  
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Camera size={64} color={colors.primary} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need camera access to scan business cards. Your photos will not be stored or shared without your permission.
        </Text>
        <Pressable 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <>
          <CameraView 
            style={styles.camera} 
            facing={facing}
            ref={cameraRef}
          >
            <View style={styles.overlay}>
              <View style={styles.scanFrame} />
            </View>
            
            <View style={styles.controls}>
              <Pressable 
                style={styles.cancelButton} 
                onPress={handleCancel}
              >
                <X size={24} color="white" />
              </Pressable>
              
              <View style={styles.bottomControls}>
                <Pressable 
                  style={styles.galleryButton} 
                  onPress={handlePickImage}
                >
                  <Text style={styles.galleryButtonText}>Gallery</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.captureButton} 
                  onPress={handleCapture}
                >
                  <View style={styles.captureButtonInner} />
                </Pressable>
                
                <Pressable 
                  style={styles.flipButton} 
                  onPress={toggleCameraFacing}
                >
                  <RotateCcw size={24} color="white" />
                </Pressable>
              </View>
            </View>
          </CameraView>
          
          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Position the business card within the frame and take a photo
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.previewImage}
            contentFit="contain"
          />
          
          {isProcessing ? (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.processingText}>Processing card...</Text>
            </View>
          ) : (
            <View style={styles.previewControls}>
              <Pressable 
                style={[styles.previewButton, styles.retakeButton]} 
                onPress={handleRetake}
              >
                <X size={24} color={colors.text} />
                <Text style={styles.retakeButtonText}>Retake</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.previewButton, styles.useButton]} 
                onPress={handleProcess}
              >
                <Check size={24} color="white" />
                <Text style={styles.useButtonText}>Use Photo</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanFrame: {
    width: '80%',
    height: '40%',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
  },
  galleryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  galleryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
  },
  flipButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  instructions: {
    padding: 16,
    backgroundColor: colors.background,
  },
  instructionsText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  previewImage: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewControls: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retakeButton: {
    marginRight: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retakeButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  useButton: {
    backgroundColor: colors.primary,
  },
  useButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  processingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});