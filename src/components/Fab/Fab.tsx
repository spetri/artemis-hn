import { IconNode } from '@rneui/base';
import { FAB } from '@rneui/themed';
import { memo } from 'react';
import { PositionType } from '../../contexts/store';

export type FabProps = {
  placement: PositionType;
  icon: IconNode | undefined;
  onPress: () => void;
  onLongPress: () => void;
};

export const Fab = memo(function Fab(props: FabProps) {
  const widthDirection = () => {
    if (props.placement === 'middle') {
      return { width: '90%', height: '12%' };
    } else {
      return { width: '30%', height: '12%' };
    }
  };

  return <FAB style={widthDirection()} {...props} />;
});
