import { useRouter } from 'expo-router';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { TIPOS_SERVICIO } from '../models/solicitud';
import { CLINICA_NOMBRE, SERVICIO_INFO } from '../utils/constants';
import { colors, radius, spacing } from '../utils/theme';

export default function BienvenidaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('../../assets/images/tabIcons/fondobienvenida.png')}
      style={styles.container}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/tabIcons/mr.patitas.png')}
            style={styles.logoImage}
            resizeMode="contain"
             />
        </View>
          <Text style={styles.title}>{CLINICA_NOMBRE}</Text>

          <Text style={styles.subtitle}>
            Gestión de solicitudes de atención
          </Text>

          <View style={styles.services}>
            {TIPOS_SERVICIO.map((t) => (
              <View key={t} style={styles.service}>
                <View
                  style={[
                    styles.serviceIcon,
                    { backgroundColor: SERVICIO_INFO[t].color },
                  ]}
                >
                  <Text style={styles.serviceImage}>
                    {SERVICIO_INFO[t].icon}
                  </Text>
                </View>

                <Text style={styles.serviceLabel}>
                  {SERVICIO_INFO[t].label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint}>
            Registra, consulta y actualiza las solicitudes de tus clientes
            en un solo lugar.
          </Text>

          <PrimaryButton
            title="Ingresar"
            onPress={() => router.replace('/solicitudes')}
          />
        </View>
      
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  main: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
},
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
 
  logoContainer: {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  alignItems: 'center',
  transform: [{ translateY: -60 }],
},

logoImage: {
  width: 120,
  height: 10,
  resizeMode: 'contain',
},
 
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.primarySoft,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  service: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  serviceIcon: {
    width: 100,
    height: 100,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceImage: {
    fontSize: 24,
  },
  serviceLabel: {
    fontSize: 12,
    color: colors.primarySoft,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  hint: {
    color: colors.primarySoft,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontSize: 13,
    lineHeight: 19,
  },
});
