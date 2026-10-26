import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TipoServicio } from '../models/solicitud';
import { SERVICIO_INFO } from '../utils/constants';
import { AppIcon } from './AppIcon';

export function ServicioIcon({ tipo, size = 44 }: { tipo: TipoServicio; size?: number }) {
  const info = SERVICIO_INFO[tipo];
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size / 3, backgroundColor: info.color }]}>
      <AppIcon name={info.icon} size={size * 0.52} color={info.fg} />
    </View>
  );
}

const styles = StyleSheet.create({ box: { alignItems: 'center', justifyContent: 'center' } });
