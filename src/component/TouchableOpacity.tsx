import React from 'react';
import {TouchableOpacity as Touch} from 'react-native';

export default function TouchableOpacity({
  opacity = 0.8,
  disabled = false,
  ...rest
}) {
  return <Touch {...rest} activeOpacity={disabled ? 1 : opacity} />;
}
