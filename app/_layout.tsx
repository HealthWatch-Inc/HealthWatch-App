import { Stack } from "expo-router";
import { TelemetriaProvider } from '../context/TelemetriaContext';

export default function RootLayout() {
  return (
    <TelemetriaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TelemetriaProvider>
  );
}
