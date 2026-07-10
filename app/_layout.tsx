import { Stack } from "expo-router";
import { TelemetriaProvider } from '../context/TelemetriaContext';
import { NotificationProvider } from "@/context/NotificationContext";
import { PacienteProvider } from "@/context/PacienteContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <PacienteProvider>
        <TelemetriaProvider>
          <NotificationProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </NotificationProvider>
        </TelemetriaProvider>
      </PacienteProvider>
    </LanguageProvider>
  );
}
