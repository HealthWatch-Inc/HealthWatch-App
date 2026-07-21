import { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { allowScreenCaptureAsync } from 'expo-screen-capture';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function enableRecording() {
      // Permite explícitamente la grabación de pantalla
      await allowScreenCaptureAsync();
      
      // Realiza la redirección de forma segura después de activar el permiso
      router.replace('/InicioSesionScreen');
    }

    enableRecording();
  }, []);

  return null;
}
