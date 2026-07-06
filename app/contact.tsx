import React from 'react';
import { StyleSheet, View, FlatList, Alert, Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Appbar, Text, Button, Divider, FAB, PaperProvider, Portal, Modal, TextInput, MD3LightTheme, ActivityIndicator } from 'react-native-paper';
import FooterNav from './footernav';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';

interface Contacto {
     id: string;
     name: string;
     phone: string;
     relation: string;
}

const CONTACTS: Contacto[] = [
     { id: '1', name: 'Alan García', phone: '970464752', relation: 'Hijo' },
     { id: '2', name: 'Alberto Fernandez', phone: '927883542', relation: 'Vecino cercano' },
];

export default function EmergencyContactsScreen() {
     const router = useRouter();
     const { pacienteId } = useLocalSearchParams();
     const [visible, setVisible] = useState(false);
     const [contactos, setContactos] = useState<Contacto[]>([]);
     const [contactoEditado, setContactoEditado] = useState<Contacto | null>(null);
     const [loadingCont, setLoadingCont] = useState(true);
     const [nombreContacto, setNombreContacto] = useState('');
     const [telefonoContacto, setTelefonoContacto] = useState('');
     const [relacionContacto, setRelacionContacto] = useState('');

     const makeCall = async (phone: string) => {
          try {
               const phoneNumber = phone.replace(/\s/g, '');
               console.log(`tel:${phoneNumber}`);

               await Linking.openURL(`tel:${phoneNumber}`);
          } catch (e) {
               console.error(e);
               Alert.alert('Error', JSON.stringify(e));
          };
     };

     const showModal = () => {
          setVisible(true);
     };

     const hideModal = () => {
          setVisible(false);
          setContactoEditado(null);
          setNombreContacto('');
          setTelefonoContacto('');
          setRelacionContacto('');
     };

     const handleNumberChange = (text: string) => {
          setTelefonoContacto(text.replace(/\D/g, '').slice(0, 9));
     };

     // Para la lista de contactos
     const loadContactos = async () => {
          console.log("1. Entró a loadContactos");

          if (!pacienteId) {
               console.log("2. No hay pacienteId");
               setContactos(CONTACTS);
               setLoadingCont(false);
               return;
          }

          try {
               console.log("3. Antes del GET");

               const response = await apiService.get(`/api/contactos/${pacienteId}`);

               console.log("4. Después del GET", response);

               if (response && response.length > 0) {
                    setContactos(response);
               } else {
                    setContactos(CONTACTS);
               }
          } catch (error) {
               console.log("5. Entró al catch", error);
               setContactos(CONTACTS);
          } finally {
               console.log("6. Entró al finally");
               setLoadingCont(false);
          }
     };

     const createContacto = async () => {
          if (!pacienteId || !nombreContacto.trim()) return;

          const contacto = {
               name: nombreContacto,
               phone: telefonoContacto,
               relation: relacionContacto
          }

          try {
               await apiService.post(`/api/contactos/${pacienteId}`, contacto);
               await loadContactos();
               hideModal();
          } catch (error) {
               console.error("Error al guardar el contacto:", error);
          }
     }

     const editContacto = (contacto: Contacto) => {
          setContactoEditado(contacto);
          setNombreContacto(contacto.name);
          setTelefonoContacto(contacto.phone);
          setRelacionContacto(contacto.relation);
          setVisible(true);
     }

     const updateContacto = async () => {
          if (!contactoEditado) return;

          // Se edita el contacto
     }

     const deleteContacto = (id: string, name: string) => {
          const mensaje = `¿Estás seguro de que deseas eliminar el contacto "${name}"?`

          Alert.alert(
               "Eliminar medicamento",
               mensaje,
               [
                    { text: "Cancelar", style: "cancel" },
                    {
                         text: "Eliminar",
                         style: "destructive",
                         onPress: () => ejecutarEliminacion(id)
                    }
               ]
          );
     };

     const ejecutarEliminacion = async (id: string) => {
          if (!pacienteId) return;
          try {
               await apiService.delete(`/api/contactos/${pacienteId}/${id}`);
               setContactos((prevConts) => prevConts.filter((cont) => cont.id !== id));
          } catch (error) {
               console.log("Error al eliminar el contacto:", error);
          }
     };

     useEffect(() => {
          loadContactos();
     }, [pacienteId]);

     return (
          <PaperProvider theme={MD3LightTheme}>
               {/* Header */}
               <Appbar.Header style={styles.header}>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title="Atrás" />
               </Appbar.Header>

               <View style={styles.container}>
                    <Text variant="headlineSmall" style={styles.title}>Contactos de emergencia</Text>

                    {loadingCont ? (
                         <View>
                              <ActivityIndicator animating={true} color='#004A60' size='small' />
                         </View>
                    ) : contactos.length === 0 ? (
                         <View>
                              <Text variant='bodyMedium'>No hay contactos</Text>
                         </View>
                    ) : (
                         <FlatList
                              data={contactos}
                              keyExtractor={(item) => item.id}
                              renderItem={({ item }) => (
                                   <View style={styles.contactItem}>
                                        <View style={styles.row}>
                                             <Text variant="titleMedium" style={styles.name}>{item.name}</Text>
                                             <Text variant="bodyLarge">{item.phone}</Text>
                                        </View>

                                        <Text variant="bodyMedium" style={styles.relation}>{item.relation}</Text>

                                        <View style={[styles.row, { marginTop: 8 }]}>

                                             <Button
                                                  mode="contained"
                                                  onPress={() => makeCall(item.phone)}
                                                  buttonColor="#B3261E"
                                                  style={styles.callButton}
                                             >
                                                  Llamar
                                             </Button>

                                             <Button
                                                  mode='outlined'
                                                  onPress={() => editContacto(item)}>
                                                  Editar
                                             </Button>

                                             <Button
                                                  mode='outlined'
                                                  onPress={() => deleteContacto(item.id, item.name)}>
                                                  Eliminar
                                             </Button>
                                        </View>
                                        <Divider style={styles.divider} />
                                   </View>
                              )}
                         />
                    )}

                    <FAB icon="plus" style={styles.fab} color='white' onPress={showModal} />

                    <Portal>
                         <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                              <ScrollView showsVerticalScrollIndicator={false}>
                                   <Text style={styles.modalTitle}>{contactoEditado ? "Editar contacto" : "Agregar contacto"}</Text>

                                   <Text style={styles.inputLabel}>Nombre</Text>
                                   <TextInput keyboardType='default' placeholder='Ej. Juan Perez' mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' value={nombreContacto} onChangeText={setNombreContacto} />


                                   <Text style={styles.inputLabel}>Teléfono celular</Text>
                                   <TextInput keyboardType='numeric' placeholder='Ej. 912080867' mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' value={telefonoContacto} onChangeText={handleNumberChange} />

                                   <Text style={styles.inputLabel}>Relación con el paciente</Text>
                                   <TextInput keyboardType='default' placeholder='Ej. Hijo' mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' value={relacionContacto} onChangeText={setRelacionContacto} />

                                   <View style={styles.modalActions}>
                                        <Button mode='contained' onPress={hideModal} style={styles.cancelButton} labelStyle={{ color: '#49454f' }}>
                                             Cancelar
                                        </Button>
                                        <Button
                                             mode='contained'
                                             onPress={contactoEditado ? updateContacto : createContacto} style={styles.saveButton}>
                                             {contactoEditado ? "Guardar" : "Agregar"}
                                        </Button>
                                   </View>
                              </ScrollView>
                         </Modal>
                    </Portal>
               </View>

               <FooterNav activeTab="inicio" />
          </PaperProvider>
     );
}

const styles = StyleSheet.create({
     container: { flex: 1, padding: 16, backgroundColor: '#FEF7FF' },
     header: { backgroundColor: 'transparent', elevation: 0, justifyContent: 'space-between', },
     title: { marginBottom: 24, fontWeight: 'bold' },
     contactItem: { marginBottom: 16 },
     row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
     name: { fontWeight: '600' },
     relation: { color: '#49454F' },
     callButton: { borderRadius: 20 },
     divider: { marginTop: 16, backgroundColor: '#CAC4D0' },
     fab: { position: 'absolute', margin: 16, right: 0, bottom: 90, backgroundColor: '#004A60', borderRadius: 50, zIndex: 10 },
     modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, },
     cancelButton: { flex: 1, marginRight: 8, backgroundColor: '#E6E1E5', borderRadius: 20 },
     saveButton: { flex: 1, marginLeft: 8, backgroundColor: '#004A60', borderRadius: 20, },
     modalContainer: { backgroundColor: 'white', padding: 24, margin: 20, borderRadius: 28, maxHeight: '80%' },
     modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#1D1B20', marginBottom: 16 },
     inputLabel: { fontSize: 14, color: '#49454F', marginTop: 12, marginBottom: 10 },
     input: { backgroundColor: '#F4EFF4', marginBottom: 8, },
});