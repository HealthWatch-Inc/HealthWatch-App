import React from 'react';
import { StyleSheet, View, FlatList, Alert, Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Appbar, Text, Button, Divider, FAB, PaperProvider, MD3LightTheme, Portal, Modal, TextInput, ActivityIndicator } from 'react-native-paper';
import FooterNav from './Footernav';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { t } from '../utils/i18n';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#FEF7FF',
    surface: '#FEF7FF',
    onSurface: '#000000',
    onSurfaceVariant: '#000000',
  },
};

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
          if (!pacienteId) {
               setContactos([]);
               setLoadingCont(false);
               return;
          }

          try {
               setLoadingCont(true);
               const response = await apiService.get(`/api/contactos/${pacienteId}`);
               const contactosApi = Array.isArray(response) ? response : [];
               setContactos(contactosApi);
          } catch (error) {
               console.error("Error al cargar los contactos:", error);
               setContactos([]);
          } finally {
               setLoadingCont(false);
          }
     };

     const createContacto = async () => {
          if (!pacienteId || !nombreContacto.trim() || !telefonoContacto.trim() || !relacionContacto.trim()) {
               Alert.alert(t('common.error'), t('contacts.incomplete_data'));
               return;
          }

          const contacto = {
               name: nombreContacto.trim(),
               phone: telefonoContacto,
               relation: relacionContacto.trim()
          }

          try {
               await apiService.post(`/api/contactos/${pacienteId}`, contacto);
               await loadContactos();
               hideModal();
          } catch (error) {
               console.error("Error al guardar el contacto:", error);
               Alert.alert(t('common.error'), t('contacts.error_save'));
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
          if (!contactoEditado || !pacienteId) return;

          if (!nombreContacto.trim() || !telefonoContacto.trim() || !relacionContacto.trim()) {
               Alert.alert(t('common.error'), t('contacts.incomplete_data'));
               return;
          }

          const contactoActualizado = {
               name: nombreContacto.trim(),
               phone: telefonoContacto,
               relation: relacionContacto.trim()
          };

          try {
               await apiService.put(`/api/contactos/${pacienteId}/${contactoEditado.id}`, contactoActualizado);
               await loadContactos();
               hideModal();
          } catch (error) {
               console.error("Error al actualizar el contacto:", error);
               Alert.alert(t('common.error'), t('contacts.error_update'));
          }
     }

     const deleteContacto = (id: string, name: string) => {
          const mensaje = t('contacts.delete_contact_message', { name })

          Alert.alert(
               t('contacts.delete_contact_title'),
               mensaje,
               [
                    { text: t('common.cancel'), style: "cancel" },
                    {
                         text: t('common.delete'),
                         onPress: () => ejecutarEliminacion(id)
                    }
               ]
          );
     };

     const ejecutarEliminacion = async (id: string) => {
          if (!pacienteId) return;
          try {
               await apiService.delete(`/api/contactos/${pacienteId}/${id}`);
               await loadContactos();
          } catch (error) {
               console.error("Error al eliminar el contacto:", error);
               Alert.alert(t('common.error'), t('contacts.error_save'));
          }
     };

     useEffect(() => {
          loadContactos();
     }, [pacienteId]);

     return (
          <PaperProvider theme={theme}>
               {/* Header */}
               <Appbar.Header style={styles.header}>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title={t('common.back')} />
               </Appbar.Header>

               <View style={styles.container}>
                    <Text variant="headlineSmall" style={styles.title}>{t('contacts.title')}</Text>

                    {loadingCont ? (
                         <View>
                              <ActivityIndicator animating={true} color='#004A60' size='small' />
                         </View>
                    ) : contactos.length === 0 ? (
                         <View>
                              <Text variant='bodyMedium'>{t('contacts.no_contacts')}</Text>
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
                                                  {t('contacts.call')}
                                             </Button>

                                             <Button
                                                  mode='outlined'
                                                  onPress={() => editContacto(item)}>
                                                  {t('contacts.edit')}
                                             </Button>

                                             <Button
                                                  mode='outlined'
                                                  onPress={() => deleteContacto(item.id, item.name)}>
                                                  {t('contacts.delete')}
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
                                   <Text style={styles.modalTitle}>{contactoEditado ? t('contacts.edit_contact') : t('contacts.add_contact')}</Text>

                                   <Text style={styles.inputLabel}>{t('contacts.name')}</Text>
                                   <TextInput keyboardType='default' placeholder={t('contacts.placeholder_name')} mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' value={nombreContacto} onChangeText={setNombreContacto} />


                                   <Text style={styles.inputLabel}>{t('contacts.phone')}</Text>
                                   <TextInput keyboardType='numeric' placeholder={t('contacts.placeholder_phone')} mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' value={telefonoContacto} onChangeText={handleNumberChange} />

                                   <Text style={styles.inputLabel}>{t('contacts.relation')}</Text>
                                   <TextInput keyboardType='default' placeholder={t('contacts.placeholder_relation')} mode='outlined' style={styles.input} outlineColor='#CAC4D0' activeOutlineColor='#004A60' value={relacionContacto} onChangeText={setRelacionContacto} />

                                   <View style={styles.modalActions}>
                                        <Button mode='contained' onPress={hideModal} style={styles.cancelButton} labelStyle={{ color: '#49454f' }}>
                                             {t('common.cancel')}
                                        </Button>
                                        <Button
                                             mode='contained'
                                             onPress={contactoEditado ? updateContacto : createContacto} style={styles.saveButton}>
                                             {contactoEditado ? t('common.save') : t('common.add')}
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
     header: { backgroundColor: '#FEF7FF', elevation: 0, justifyContent: 'space-between', shadowOpacity: 0, borderBottomWidth: 0 },
     title: { marginBottom: 24, fontWeight: 'bold', color: '#1D1B20' },
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