import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../store/AuthContext';
import { CitaProvider } from '../store/CitaContext';
import { MascotaProvider } from '../store/MascotaContext';
import { SolicitudProvider } from '../store/SolicitudContext';
import { ToastProvider } from '../store/ToastContext';
import { colors, headerOptions } from '../utils/theme';

function RootStack() {
  const { autenticado } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (autenticado) router.replace('/home');
  }, [autenticado, router]);

  return (
    <Stack
      screenOptions={{ ...headerOptions, headerBackButtonDisplayMode: 'minimal', contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Protected guard={!autenticado}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="registro" options={{ title: 'Crear cuenta' }} />
      </Stack.Protected>

      <Stack.Protected guard={autenticado}>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="crear" options={{ title: 'Nueva solicitud' }} />
        <Stack.Screen name="detalle" options={{ title: 'Detalle de solicitud' }} />
        <Stack.Screen name="cita-nueva" options={{ title: 'Agendar cita' }} />
        <Stack.Screen name="mascota-nueva" options={{ title: 'Nueva mascota' }} />
        <Stack.Screen name="mascota-detalle" options={{ title: 'Ficha de la mascota' }} />
        <Stack.Screen name="servicios" options={{ title: 'Servicios y precios' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SolicitudProvider>
        <MascotaProvider>
          <CitaProvider>
            <ToastProvider>
              <StatusBar style="light" />
              <RootStack />
            </ToastProvider>
          </CitaProvider>
        </MascotaProvider>
      </SolicitudProvider>
    </AuthProvider>
  );
}
