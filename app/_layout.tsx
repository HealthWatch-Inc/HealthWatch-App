import { Stack } from "expo-router";
import { TelemetriaProvider } from '../context/TelemetriaContext';
import { NotificationProvider } from "@/context/NotificationContext";
import { PacienteProvider } from "@/context/PacienteContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PacienteProvider>
          <TelemetriaProvider>
            <NotificationProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </NotificationProvider>
          </TelemetriaProvider>
        </PacienteProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
