import {isAndroidDevice} from '../lib/deviceHelper';

const iOSFonts = {
  regular: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  bold: 'DMSans-Bold',
};

const androidFonts = {
  regular: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  bold: 'DMSans-Bold',
};

export const FontFamily = isAndroidDevice ? androidFonts : iOSFonts;
