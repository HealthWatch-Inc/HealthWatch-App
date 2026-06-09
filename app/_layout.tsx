import { Stack } from "expo-router";
import { TelemetriaProvider } from '../context/TelemetriaContext';
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout() {
  return (
    <TelemetriaProvider>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </NotificationProvider>
    </TelemetriaProvider>
  );
}
