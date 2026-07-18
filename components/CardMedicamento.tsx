import React from 'react';
import { View } from 'react-native';
import {
  Card,
  Text,
  IconButton,
} from 'react-native-paper';
import { getNotificationsStyles } from "@/constants/notificationsStyles"
import { useTheme } from "@/context/ThemeContext";
import type { CardMedicamentoProps} from '@/types/types';
import { t } from '../utils/i18n';

export const CardMedicamento = ({ id, objeto, nombre, frecuencia, horas, onEdit, onDelete }: CardMedicamentoProps) => {
  
  const {Colors} = useTheme();
  const styles = getNotificationsStyles(Colors);
  
  return (
    <>
      <Card key={id} style={styles.medCard}>
        <Card.Content style={styles.medContent}>
          <IconButton icon="pill" iconColor="white" size={24} style={styles.medIcon} />
          <View style={styles.medTextWrapper}>
            <Text style={styles.medTitle}>{nombre}</Text>
            <Text style={styles.medTime}>{t(`alerts.${frecuencia}`)}</Text>
            <Text style={styles.medTime}>{horas}</Text>
          </View>
          {/* Botón para eliminar */}
          <IconButton
            icon="pencil"
            iconColor="#ffffff"
            size={22}
            onPress={() => onEdit(objeto)}
          />

          <IconButton
            icon="delete"
            iconColor="#FF8A8A"
            size={22}
            onPress={() => onDelete(id, nombre)}
            style={styles.deleteMedBtn}
          />
        </Card.Content>
      </Card>
    </>
  )
}

