import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function FunkyBackground() {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 3000 }),
        withTiming(0.8, { duration: 3000 }),
        withTiming(1, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Shapes */}
      <Animated.View style={[styles.shape1, animatedStyle]}>
        <LinearGradient
          colors={colors.gradient1}
          style={styles.gradient}
        />
      </Animated.View>
      
      <Animated.View style={[styles.shape2, animatedStyle]}>
        <LinearGradient
          colors={colors.gradient2}
          style={styles.gradient}
        />
      </Animated.View>
      
      <Animated.View style={[styles.shape3, animatedStyle]}>
        <LinearGradient
          colors={colors.gradient3}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  shape1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.1,
  },
  shape2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.08,
  },
  shape3: {
    position: 'absolute',
    top: height * 0.3,
    right: -200,
    width: 350,
    height: 350,
    borderRadius: 175,
    opacity: 0.06,
  },
  gradient: {
    flex: 1,
    borderRadius: 200,
  },
});