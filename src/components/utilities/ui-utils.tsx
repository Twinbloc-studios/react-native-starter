import { Dimensions, Platform } from 'react-native';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

const { width, height } = Dimensions.get('screen');

export const WIDTH = width;
export const HEIGHT = height;
