import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Card } from 'react-native-paper';
import React, { ReactNode } from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';

interface AnimatedCardProps {
  children: ReactNode;
  background?: string;
  onPress?: (event: GestureResponderEvent) => void;
  delay?: number;
}

const AnimatedCard = ({ children, onPress, background, delay = 0, }: AnimatedCardProps) => {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(1500)}
      style={[style, styles.container, { backgroundColor: background, borderRadius: 28 }]}>
      <Card
        style={[styles.card, { backgroundColor: background }]}
        elevation={0}
        onPressIn={() => {
          scale.value = withSpring(0.90);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
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
  card: {
    width: '100%',
    height: 120,
    borderRadius: 28,
    justifyContent: 'center',
  },
});