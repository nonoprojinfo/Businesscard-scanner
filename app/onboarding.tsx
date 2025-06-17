import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  Pressable,
  Animated,
  useWindowDimensions
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScanLine, Users, Bell, ArrowRight, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Scan Business Cards',
    description: 'Quickly capture and digitize business cards with your camera',
    icon: <ScanLine size={64} color={colors.primary} />,
    image: 'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Organize Contacts',
    description: 'Keep all your professional connections organized in one place',
    icon: <Users size={64} color={colors.primary} />,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Set Reminders',
    description: 'Never forget to follow up with important contacts',
    icon: <Bell size={64} color={colors.primary} />,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1970&auto=format&fit=crop'
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: windowWidth } = useWindowDimensions();
  
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };
  
  const handleSkip = () => {
    handleComplete();
  };
  
  const handleComplete = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };
  
  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={[styles.slide, { width: windowWidth }]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.imageOverlay} />
        <View style={styles.iconContainer}>
          {item.icon}
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
  
  const renderDots = () => {
    return (
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * windowWidth,
            index * windowWidth,
            (index + 1) * windowWidth,
          ];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width: dotWidth, opacity },
              ]}
            />
          );
        })}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / windowWidth
          );
          setCurrentIndex(index);
        }}
      />
      
      {renderDots()}
      
      <View style={styles.buttonsContainer}>
        <Pressable 
          style={styles.skipButton} 
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </Pressable>
        
        <Pressable 
          style={styles.nextButton} 
          onPress={handleNext}
        >
          {currentIndex < onboardingData.length - 1 ? (
            <ArrowRight size={24} color="white" />
          ) : (
            <Check size={24} color="white" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '50%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  iconContainer: {
    position: 'absolute',
    bottom: -32,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  skipButton: {
    padding: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  nextButton: {
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
});