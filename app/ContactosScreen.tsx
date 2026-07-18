import React from 'react';
import { StyleSheet, View, FlatList, Alert, Linking, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Appbar,
  Text,
  Button,
  Divider,
  FAB,
  PaperProvider,
  Portal,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native-paper';
import FooterNav from '../components/Footernav';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { t } from '../utils/i18n';
import { useTheme } from '@/context/ThemeContext';

interface Contacto {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const {theme, Colors, globalStyles,} = useTheme();
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

  const styles = StyleSheet.create({
    contactItem: {
      marginBottom: 16
    },
    name: {
      fontWeight: '600'
    },
    relation: {
      color: Colors.textSecondaryMaterial
    },
    callButton: {
      borderRadius: 20
    },

    cancelButton: {
      flex: 1,
      marginRight: 8,
      backgroundColor: '#E6E1E5',
      borderRadius: 20,
      width: '100%',
    },
    saveButton: {
      flex: 1,
      marginLeft: 8,
      backgroundColor: Colors.primary,
      borderRadius: 20,
    },
  });

  return (
    <PaperProvider theme={theme}>
      {/* Header */}
      <Appbar.Header style={globalStyles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('common.back')} />
      </Appbar.Header>

      <View style={[globalStyles.container]}>
        {loadingCont ? (
          <View>
            <ActivityIndicator animating={true} color={Colors.primary} size='small' />
          </View>
        ) : contactos.length === 0 ? (
          <View>
            <Text variant='bodyMedium'>{t('contacts.no_contacts')}</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={globalStyles.content}
            data={contactos}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={(
              <Text variant="headlineSmall" style={[globalStyles.title]}>{t('contacts.title')}</Text>
            )}
            renderItem={({ item }) => (
              <View style={styles.contactItem}>
                <View style={globalStyles.row}>
                  <Text variant="titleMedium" style={styles.name}>{item.name}</Text>
                  <Text variant="bodyLarge">{item.phone}</Text>
                </View>

                <Text variant="bodyMedium" style={styles.relation}>{item.relation}</Text>

                <View style={[globalStyles.row, { marginTop: 8 }]}>

                  <Button
                    mode="contained"
                    onPress={() => makeCall(item.phone)}
                    buttonColor={Colors.danger}
                    style={styles.callButton}
                    textColor={Colors.white_text}
                  >
                    {t('contacts.call')}
                  </Button>

                  <Button
                    mode='contained'
                    onPress={() => editContacto(item)}
                    textColor={Colors.white_text}>
                    {t('contacts.edit')}
                  </Button>

                  <Button
                    mode='contained'
                    onPress={() => deleteContacto(item.id, item.name)}
                    textColor={Colors.white_text}>
                    {t('contacts.delete')}
                  </Button>
                </View>
                <Divider style={globalStyles.divider} />
              </View>
            )}
          />
        )}

        <FAB icon="plus" style={globalStyles.fab} color='white' onPress={showModal} />

        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={globalStyles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[globalStyles.modalTitle, { fontSize: 20, marginBottom: 16 }]}>{contactoEditado ? t('contacts.edit_contact') : t('contacts.add_contact')}</Text>

              <Text style={[globalStyles.inputLabel, {marginBottom: 8}]}>{t('contacts.name')}</Text>
              <TextInput keyboardType='default' placeholder={t('contacts.placeholder_name')} mode='outlined' style={[globalStyles.input, {marginBottom: 16}]} outlineColor='#CAC4D0' activeOutlineColor={Colors.primary} value={nombreContacto} onChangeText={setNombreContacto} />

              <Text style={[globalStyles.inputLabel, {marginBottom: 8}]}>{t('contacts.phone')}</Text>
              <TextInput keyboardType='numeric' placeholder={t('contacts.placeholder_phone')} mode='outlined' style={[globalStyles.input, {marginBottom: 16}]} outlineColor='#CAC4D0' activeOutlineColor={Colors.primary} value={telefonoContacto} onChangeText={handleNumberChange} />

              <Text style={[globalStyles.inputLabel, {marginBottom: 8}]}>{t('contacts.relation')}</Text>
              <TextInput keyboardType='default' placeholder={t('contacts.placeholder_relation')} mode='outlined' style={globalStyles.input} outlineColor='#CAC4D0' activeOutlineColor={Colors.primary} value={relacionContacto} onChangeText={setRelacionContacto} />

              <View style={globalStyles.modalActions}>
                <Button mode='contained' onPress={hideModal} style={styles.cancelButton} labelStyle={{ color: '#49454f' }}>
                  {t('common.cancel')}
                </Button>
                <Button
                  mode='contained'
                  onPress={contactoEditado ? updateContacto : createContacto} style={styles.saveButton} textColor={Colors.white_text}>
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