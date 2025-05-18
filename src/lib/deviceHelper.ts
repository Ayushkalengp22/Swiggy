import {Platform, Dimensions, PixelRatio} from 'react-native';
const {fontScale, width, height} = Dimensions.get('window');

export const isAppleDevice = Platform.OS === 'ios';
export const isAndroidDevice = Platform.OS === 'android';
export const screenWidth = width;
export const screenHeight = height;
export const defaultSpace = scale(16);
export const HEADER_HEIGHT = screenHeight / 4;

export function scale(val: number) {
  const standardWidth = 420;
  return (
    PixelRatio.roundToNearestPixel(
      Math.round((val * width) / (standardWidth * fontScale)),
    ) || 0
  );
}
