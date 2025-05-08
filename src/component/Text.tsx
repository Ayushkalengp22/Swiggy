import React from 'react';
import {Text as RNText} from 'react-native';

import {FontFamily} from '../constants/FontFamily';
import {Colors} from '../constants/Colors';
import {scale} from '../lib/deviceHelper';

type Variant = keyof typeof variants;
type Props = {
  variant?: Variant;
  style?: any;
  color?: string;
  numberOfLines?: number;
  children?: JSX.Element | string | number | JSX.Element[];
  onPress?: () => void;
};

export default function Text({
  style,
  color,
  children,
  numberOfLines,
  onPress,
  variant = onPress ? 'link' : 'title',
}: Props): JSX.Element {
  return (
    <RNText
      numberOfLines={numberOfLines}
      onPress={onPress}
      style={[variants[variant], {color: color ?? Colors.black}, style]}>
      {children}
    </RNText>
  );
}

export const variants = {
  title: {
    fontFamily: FontFamily.bold,
    fontSize: scale(20),
  },
  text8R: {
    fontSize: scale(8),
    fontFamily: FontFamily.regular,
  },
  text8B: {
    fontSize: scale(8),
    fontFamily: FontFamily.bold,
  },
  text10R: {
    fontSize: scale(10),
    fontFamily: FontFamily.regular,
  },
  text10B: {
    fontSize: scale(10),
    fontFamily: FontFamily.bold,
  },
  text12R: {
    fontSize: scale(12),
    fontFamily: FontFamily.regular,
  },
  text12M: {
    fontSize: scale(12),
    fontFamily: FontFamily.medium,
  },
  text12B: {
    fontSize: scale(12),
    fontFamily: FontFamily.bold,
  },
  text13R: {
    fontSize: scale(13),
    fontFamily: FontFamily.regular,
  },
  text14R: {
    fontSize: scale(14),
    fontFamily: FontFamily.regular,
  },
  text14M: {
    fontSize: scale(14),
    fontFamily: FontFamily.medium,
  },
  text14B: {
    fontSize: scale(14),
    fontFamily: FontFamily.bold,
  },
  text15R: {
    fontSize: scale(15),
    fontFamily: FontFamily.regular,
  },
  text15M: {
    fontSize: scale(15),
    fontFamily: FontFamily.medium,
  },
  text15B: {
    fontSize: scale(15),
    fontFamily: FontFamily.bold,
  },
  text16R: {
    fontSize: scale(16),
    fontFamily: FontFamily.regular,
  },
  text16M: {
    fontSize: scale(16),
    fontFamily: FontFamily.medium,
  },
  text16B: {
    fontSize: scale(16),
    fontFamily: FontFamily.bold,
  },
  text18R: {
    fontSize: scale(18),
    fontFamily: FontFamily.regular,
  },
  text18M: {
    fontSize: scale(18),
    fontFamily: FontFamily.medium,
  },
  text18B: {
    fontSize: scale(18),
    fontFamily: FontFamily.bold,
  },
  text20M: {
    fontFamily: FontFamily.medium,
    fontSize: scale(20),
  },
  text20B: {
    fontFamily: FontFamily.bold,
    fontSize: scale(20),
  },
  text24M: {
    fontFamily: FontFamily.medium,
    fontSize: scale(24),
  },
  text24B: {
    fontFamily: FontFamily.bold,
    fontSize: scale(24),
  },
  text25B: {
    fontFamily: FontFamily.bold,
    fontSize: scale(25),
  },
  text30B: {
    fontSize: scale(30),
    fontFamily: FontFamily.bold,
  },
  text35B: {
    fontSize: scale(35),
    fontFamily: FontFamily.bold,
  },
  text45B: {
    fontSize: scale(35),
    fontFamily: FontFamily.bold,
  },
  link: {
    color: Colors.blue,
  },
};
