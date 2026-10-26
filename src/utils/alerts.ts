import { Alert } from 'react-native';

export const confirmar = (titulo: string, mensaje: string, textoAccion: string, onConfirm: () => void) => {
  Alert.alert(titulo, mensaje, [
    { text: 'Cancelar', style: 'cancel' },
    { text: textoAccion, style: 'destructive', onPress: onConfirm },
  ]);
};

export const confirmarEliminacion = (mascota: string, onConfirm: () => void) =>
  confirmar(
    'Eliminar solicitud',
    `¿Seguro que deseas eliminar la solicitud de ${mascota}? Esta acción no se puede deshacer.`,
    'Eliminar',
    onConfirm
  );
