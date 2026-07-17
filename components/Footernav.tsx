import React from 'react';
import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { t } from '../utils/i18n';
import { LightColors, DarkColors, getGlobalStyles } from '@/constants/styles';
import { useLanguage } from '../context/LanguageContext';

interface FooterNavProps {
  activeTab: 'inicio' | 'datos' | 'pacientes';
}

const FooterNav = ({ activeTab }: FooterNavProps) => {
  const router = useRouter();
  const { language } = useLanguage();

  const colorScheme = useColorScheme();
  const Colors = colorScheme === 'dark' ? DarkColors : LightColors;
  const globalStyles = getGlobalStyles(Colors);

  const navLabels = {
    home: t('home.nav_home', { locale: language }),
    patients: t('home.nav_patients', { locale: language }),
    myData: t('home.nav_my_data', { locale: language }),
  };

  const styles = StyleSheet.create({
    bottomNav: {
      height: 80,
      backgroundColor: Colors.primary,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    navItem: {
      alignItems: 'center',
      flex: 1
    },
    navText: {
      color: Colors.navItem,
      fontWeight: '500'
    },
    navTextActive: {
      color: 'white',
      fontWeight: 'bold'
    },
    activeIndicator: {
      height: 3,
      width: 30,
      backgroundColor: 'white',
      marginTop: 4,
      borderRadius: 2
    },
  });

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => router.push({ pathname: '/PrincipalScreen' })}>
        <Text style={activeTab === 'inicio' ? styles.navTextActive : styles.navText}>{navLabels.home}</Text>
        {activeTab === 'inicio' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push({ pathname: '/MisPacientesScreen' })}>
        <Text style={activeTab === 'pacientes' ? styles.navTextActive : styles.navText}>{navLabels.patients}</Text>
        {activeTab === 'pacientes' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => router.push({ pathname: '/AjustesScreen' })}>
        <Text style={activeTab === 'datos' ? styles.navTextActive : styles.navText}>{navLabels.myData}</Text>
        {activeTab === 'datos' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

export default FooterNav;