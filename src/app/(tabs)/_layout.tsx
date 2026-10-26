import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { AppIcon } from '../../components/AppIcon';
import { useAuth } from '../../store/AuthContext';
import { IconName } from '../../utils/constants';
import { colors, headerOptions } from '../../utils/theme';

const icono = (name: IconName) =>
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <AppIcon name={name} size={size} color={color as string} />;
  };

export default function TabsLayout() {
  const { sesion } = useAuth();
  const esCliente = sesion?.rol === 'cliente';

  return (
    <Tabs
      screenOptions={{
        ...headerOptions,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11.5, fontWeight: '700' },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="inicio" options={{ title: 'Inicio', headerShown: false, tabBarIcon: icono('home-variant') }} />
      <Tabs.Screen
        name="solicitudes"
        options={{ title: esCliente ? 'Mis solicitudes' : 'Solicitudes', tabBarLabel: 'Solicitudes', tabBarIcon: icono('clipboard-text') }}
      />
      <Tabs.Screen name="agenda" options={{ title: esCliente ? 'Mis citas' : 'Agenda', tabBarLabel: 'Agenda', tabBarIcon: icono('calendar-month') }} />
      <Tabs.Screen name="mascotas" options={{ title: esCliente ? 'Mis mascotas' : 'Mascotas', tabBarLabel: 'Mascotas', tabBarIcon: icono('paw') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Mi perfil', tabBarLabel: 'Perfil', tabBarIcon: icono('account-circle') }} />
    </Tabs>
  );
}
