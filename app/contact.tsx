import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Appbar, Text, Button, Divider, PaperProvider, MD3LightTheme } from 'react-native-paper';
import FooterNav from './footernav';

const CONTACTS = [
     { id: '1', name: 'José García', phone: '912 345 678', relation: 'Hijo' },
     { id: '2', name: 'Alberto Fernandez', phone: '927 883 542', relation: 'Vecino cercano' },
];

export default function EmergencyContactsScreen() {
     const router = useRouter();
     return (
          <PaperProvider theme={MD3LightTheme}>
               {/* Header */}
               <Appbar.Header style={styles.header}>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title="Atrás" />
               </Appbar.Header>

               <View style={styles.container}>
                    <Text variant="headlineSmall" style={styles.title}>Contactos de emergencia</Text>

                    <FlatList
                         data={CONTACTS}
                         keyExtractor={(item) => item.id}
                         renderItem={({ item }) => (
                              <View style={styles.contactItem}>
                                   <View style={styles.row}>
                                        <Text variant="titleMedium" style={styles.name}>{item.name}</Text>
                                        <Text variant="bodyLarge">{item.phone}</Text>
                                   </View>

                                   <View style={[styles.row, { marginTop: 8 }]}>
                                        <Text variant="bodyMedium" style={styles.relation}>{item.relation}</Text>
                                        <Button
                                             mode="contained"
                                             onPress={() => console.log('Llamando a', item.phone)}
                                             buttonColor="#B3261E" // Color rojo de error/emergencia M3
                                             style={styles.callButton}
                                        >
                                             Llamar
                                        </Button>
                                   </View>
                                   <Divider style={styles.divider} />
                              </View>
                         )}
                    />
               </View>

               <FooterNav activeTab="inicio" />
          </PaperProvider>
     );
}

const styles = StyleSheet.create({
     container: { flex: 1, padding: 16, backgroundColor: '#FEF7FF' },
     header: { backgroundColor: 'transparent', elevation: 0, justifyContent: 'space-between',},
     title: { marginBottom: 24, fontWeight: 'bold' },
     contactItem: { marginBottom: 16 },
     row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
     name: { fontWeight: '600' },
     relation: { color: '#49454F' },
     callButton: { borderRadius: 20 },
     divider: { marginTop: 16, backgroundColor: '#CAC4D0' }
});