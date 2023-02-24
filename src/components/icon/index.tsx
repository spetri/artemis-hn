import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { type AppColors, responsiveSize, useDash } from '../../../dash.config';

export interface IconProps {
  color: AppColors;
  name: any;
  size: number;
  style?: string;
}

export const Icon = memo(function Icon(props: IconProps) {
  const { color, type } = useDash().tokens;
  return (
    <Feather
      {...props}
      style={props.style ?? ('' as any)}
      size={responsiveSize(props.size * (type.size.base / 16))}
      color={color[props.color]}
    />
  );
});
