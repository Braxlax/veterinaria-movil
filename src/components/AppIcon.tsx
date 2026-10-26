import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { IconName } from '../utils/constants';
import { colors } from '../utils/theme';

export function AppIcon({ name, size = 20, color = colors.text }: { name: IconName; size?: number; color?: string }) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}
