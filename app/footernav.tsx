import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface FooterNavProps {
  activeTab: 'inicio' | 'datos';
}

export const FooterNav = ({ activeTab }: FooterNavProps) => {
  const router = useRouter();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
        <Text style={activeTab === 'inicio' ? styles.navTextActive : styles.navText}>Inicio</Text>
        {activeTab === 'inicio' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
        <Text style={activeTab === 'datos' ? styles.navTextActive : styles.navText}>Mis Datos</Text>
        {activeTab === 'datos' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 80,
    backgroundColor: '#004d61',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { color: '#ffffffaa', fontWeight: '500' },
  navTextActive: { color: 'white', fontWeight: 'bold' },
  activeIndicator: { height: 3, width: 30, backgroundColor: 'white', marginTop: 4, borderRadius: 2 },
});