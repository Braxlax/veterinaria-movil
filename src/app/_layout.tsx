import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SolicitudProvider } from '../store/SolicitudContext';
import { ToastProvider } from '../store/ToastContext';
import { CLINICA_NOMBRE } from '../utils/constants';
import { colors } from '../utils/theme';

export default function RootLayout() {
  return (
    <SolicitudProvider>
      <ToastProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="solicitudes" options={{ title: `🐾 ${CLINICA_NOMBRE}`, headerBackVisible: false }} />
          <Stack.Screen name="crear" options={{ title: 'Nueva solicitud' }} />
          <Stack.Screen name="detalle" options={{ title: 'Detalle de solicitud' }} />
        </Stack>
      </ToastProvider>
    </SolicitudProvider>
  );
}
