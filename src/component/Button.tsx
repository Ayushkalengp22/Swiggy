import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Colors} from '../constants/Colors';
import Text, {variants} from './Text';
import TouchableOpacity from './TouchableOpacity';
import Icon from './Icon';
import {Images} from '../constants/images';
import {defaultSpace} from '../lib/deviceHelper';

type Props = {
  onPress?: () => void;
  label: string;
  type?: 'primary' | 'white' | 'outlined';
  disabled?: boolean;
  isLoading?: boolean;
  style?: any;
  textStyle?: any;
  icon?: keyof typeof Images;
  iconSize?: number;
  iconPosition?: 'leading' | 'trailing';
  iconColor?: string;
  iconNoColor?: boolean;
  textVariant?: keyof typeof variants;
};

export default function Button({
  onPress,
  label,
  type = 'primary',
  disabled,
  isLoading,
  style = {},
  textStyle = {},
  icon,
  iconSize,
  iconPosition = 'leading',
  iconColor = 'white',
  iconNoColor = false,
  textVariant = 'text16M',
}: Props): JSX.Element {
  const colorsMap = disabled
    ? {label: Colors.white, background: Colors.greyDark}
    : type === 'primary'
    ? {label: Colors.white, background: Colors.primary}
    : type === 'white'
    ? {label: Colors.primary, background: Colors.white}
    : type === 'outlined'
    ? {label: Colors.black, background: Colors.white}
    : {label: Colors.white, background: Colors.black};

  const borderColor = type === 'outlined' ? Colors.greyD7 : 'transparent';
  return (
    <TouchableOpacity
      onPress={disabled ? () => {} : onPress}
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor: colorsMap.background,
          borderColor: borderColor,
        },
        style,
      ]}>
      {isLoading && (
        <ActivityIndicator
          style={styles.loader}
          color={colorsMap.label}
          size={12}
        />
      )}

      {icon && iconPosition === 'leading' && (
        <Icon
          name={icon}
          small={iconSize === undefined}
          size={iconSize}
          style={{marginRight: defaultSpace / 2}}
          color={iconColor}
          noColor={iconNoColor}
        />
      )}

      <Text variant={textVariant} color={colorsMap.label} style={textStyle}>
        {label}
      </Text>

      {icon && iconPosition === 'trailing' && (
        <Icon
          name={icon}
          small={iconSize === undefined}
          size={iconSize}
          style={{marginLeft: defaultSpace / 2}}
          color={iconColor}
          noColor={iconNoColor}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = {
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 60,
  },
  loader: {
    marginHorizontal: 10,
  },
};
