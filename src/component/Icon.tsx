import React from 'react';
import {Image} from 'react-native';
import {Colors} from '../constants/Colors';
import {Images} from '../constants/images';

const iconSizes = {
  small: 16,
  medium: 32,
  large: 48,
};

type Props = {
  name: keyof typeof Images;
  style?: any;
  size?: number;
  color?: string;
  medium?: boolean;
  small?: boolean;
  large?: boolean;
  noColor?: boolean;
};

function Icon({
  name,
  style = {},
  size = iconSizes.large,
  color = Colors.white,
  medium = false,
  small = false,
  large = false,
  noColor = false,
}: Props): JSX.Element {
  size = small
    ? iconSizes.small
    : medium
    ? iconSizes.medium
    : large
    ? iconSizes.large
    : size;
  return (
    <Image
      source={Images[name] ? Images[name] : Images.arrowLeft}
      style={[
        {
          tintColor: noColor ? null : color,
          height: size,
          width: size,
          resizeMode: 'contain',
        },
        {...style},
      ]}
    />
  );
}

export default React.memo(Icon);
