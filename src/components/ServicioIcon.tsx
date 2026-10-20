import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TipoServicio } from '../models/solicitud';
import { SERVICIO_INFO } from '../utils/constants';

export function ServicioIcon({ tipo, size = 44 }: { tipo: TipoServicio; size?: number }) {
  const info = SERVICIO_INFO[tipo];
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size / 3, backgroundColor: info.color }]}>
      <Text style={{ fontSize: size * 0.5 }}>{info.icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ box: { alignItems: 'center', justifyContent: 'center' } });
