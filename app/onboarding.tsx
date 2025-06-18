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
import { ScanLine, Users, Bell, ArrowRight, Check, Sparkles } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Scannez en un instant',
    description: 'Transformez n\'importe quelle carte de visite en contact numérique en quelques secondes',
    icon: <ScanLine size={56} color={colors.primary} />,
    image: 'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?q=80&w=1974&auto=format&fit=crop',
    accent: colors.primary
  },
  {
    id: '2',
    title: 'Organisez intelligemment',
    description: 'Gardez tous vos contacts professionnels organisés et facilement accessibles',
    icon: <Users size={56} color={colors.accent} />,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1974&auto=format&fit=crop',
    accent: colors.accent
  },
  {
    id: '3',
    title: 'Ne ratez aucun suivi',
    description: 'Définissez des rappels intelligents pour maintenir vos relations professionnelles',
    icon: <Bell size={56} color={colors.warning} />,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1970&auto=format&fit=crop',
    accent: colors.warning
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
    router.replace('/splash');
  };
  
  const renderItem = ({ item, index }: { item: typeof onboardingData[0], index: number }) => (
    <View style={[styles.slide, { width: windowWidth }]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={[styles.imageOverlay, { backgroundColor: item.accent + '20' }]} />
        
        <View style={styles.iconContainer}>
          <View style={[styles.iconBackground, { backgroundColor: item.accent + '15' }]}>
            {item.icon}
          </View>
          <View style={styles.sparkleContainer}>
            <Sparkles size={16} color={item.accent} />
          </View>
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
            outputRange: [8, 24, 8],
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
          <Text style={styles.skipButtonText}>Passer</Text>
        </Pressable>
        
        <Pressable 
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.nextButtonPressed
          ]} 
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
    height: '55%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  iconContainer: {
    position: 'absolute',
    bottom: -40,
    alignSelf: 'center',
    position: 'relative',
  },
  iconBackground: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
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
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
});