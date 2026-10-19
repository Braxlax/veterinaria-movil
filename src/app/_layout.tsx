import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, Text } from 'react-native';
import { AuthProvider, useAuth } from '../store/AuthContext';
import { SolicitudProvider } from '../store/SolicitudContext';
import { ToastProvider } from '../store/ToastContext';
import { CLINICA_NOMBRE } from '../utils/constants';
import { colors } from '../utils/theme';

function EncabezadoSolicitudes() {
  const router = useRouter();
  const { cerrarSesion } = useAuth();

  const handleCerrarSesion = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          cerrarSesion();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <Pressable
      onPress={handleCerrarSesion}
      accessibilityRole="button"
      accessibilityLabel="Cerrar sesión"
      hitSlop={10}
      style={{ backgroundColor: '#fb2521', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 }}
    >
      <Text style={{ color: colors.white, fontWeight: '700', fontSize: 18 }}>Salir ↪</Text>
    </Pressable>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
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
            <Stack.Screen
              name="solicitudes"
              options={{
                title: `🐾 ${CLINICA_NOMBRE}`,
                headerBackVisible: false,
                headerRight: () => <EncabezadoSolicitudes />,
              }}
            />
            <Stack.Screen name="crear" options={{ title: 'Nueva solicitud' }} />
            <Stack.Screen name="detalle" options={{ title: 'Detalle de solicitud' }} />
          </Stack>
        </ToastProvider>
      </SolicitudProvider>
    </AuthProvider>
  );
}
