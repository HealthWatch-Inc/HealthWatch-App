import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Card } from 'react-native-paper';
import React, { ReactNode, useState } from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import type { AnimatedCardProps } from '@/types/types';

const AnimatedCard = ({ children, onPress, background, delay = 0, fullWidth = false}: AnimatedCardProps) => {
  const scale = useSharedValue(1);
  const [disabled, setDisabled] = useState(false);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      style={[style, styles.container, fullWidth && styles.fullWidth, { backgroundColor: background, borderRadius: 28 }]}>
      <Card
        style={[styles.card, fullWidth && styles.fullCard, { backgroundColor: background, }]}
        elevation={0}
        onPressIn={() => {
          scale.value = withSpring(0.90);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={async (event) => {
          if (disabled) return;

          setDisabled(true);

          scale.value = withSpring(0.90);

          setTimeout(() => {
            scale.value = withSpring(1);

            setTimeout(() => {
              onPress?.(event);
              setDisabled(false);
            }, 120);
          }, 120);
        }}
      >
        {children}
      </Card>
    </Animated.View>
  );
};

export default AnimatedCard;

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 28,
    marginBottom: 16,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  card: {
    width: '100%',
    height: 120,
    borderRadius: 28,
    justifyContent: 'center',
  },
  fullCard: {
    width: '100%',
  },
});