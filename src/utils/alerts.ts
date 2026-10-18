import { Alert } from 'react-native';

/** Diálogo de confirmación antes de eliminar (requisito de UX de la rúbrica). */
export const confirmarEliminacion = (mascota: string, onConfirm: () => void) => {
  Alert.alert(
    'Eliminar solicitud',
    `¿Seguro que deseas eliminar la solicitud de ${mascota}? Esta acción no se puede deshacer.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: onConfirm },
    ]
  );
};
