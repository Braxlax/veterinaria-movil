import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../presentation/store/AuthContext';
import { CitaProvider } from '../presentation/store/CitaContext';
import { MascotaProvider } from '../presentation/store/MascotaContext';
import { SolicitudProvider } from '../presentation/store/SolicitudContext';
import { ToastProvider } from '../presentation/store/ToastContext';
import { colors, headerOptions } from '../presentation/theme/theme';
import { observarConexion, revisarConexionYSincronizar } from '../infraestructure/sync/networkService';

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
        <Stack.Screen name="catalogo-api" options={{ title: 'Catálogo REST (demo)' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    void revisarConexionYSincronizar();
    const suscripcion = observarConexion();
    return () => suscripcion.remove();
  }, []);

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
