import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { colors } from '../../constants/theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'AIが考え中...',
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.emoji}>💭</Text>
          <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.sub}>少々お待ちください</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(61,44,44,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: 220,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  spinner: {
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  sub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
