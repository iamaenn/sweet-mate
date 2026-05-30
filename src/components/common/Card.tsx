import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadow } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'warm' | 'accent';
  elevation?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  elevation = 'sm',
}) => {
  return (
    <View
      style={[
        styles.base,
        variant === 'warm' && styles.warm,
        variant === 'accent' && styles.accent,
        elevation !== 'none' && shadow[elevation],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warm: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.primaryLight,
  },
  accent: {
    backgroundColor: colors.accent,
    borderColor: colors.primaryLight,
    borderWidth: 0,
  },
});
