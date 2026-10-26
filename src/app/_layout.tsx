import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../store/AuthContext';
import { SolicitudProvider } from '../store/SolicitudContext';
import { ToastProvider } from '../store/ToastContext';
import { CLINICA_NOMBRE } from '../utils/constants';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SolicitudProvider>
        <ToastProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#7e9936' },
              headerTintColor: '#7e9936',
              headerTitleStyle: { fontWeight: '700', fontSize: 18 },
              contentStyle: { backgroundColor: '#FFF9ED' },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="registro" options={{ title: 'Crear una cuenta' }} />
            <Stack.Screen
              name="solicitudes"
              options={{ title: CLINICA_NOMBRE, headerBackVisible: false }}
            />
            <Stack.Screen name="crear" options={{ title: 'Nueva solicitud' }} />
            <Stack.Screen name="detalle" options={{ title: 'Detalle de solicitud' }} />
          </Stack>
        </ToastProvider>
      </SolicitudProvider>
    </AuthProvider>
  );
}
