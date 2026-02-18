import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

const ExpoPhoneNumberHint = Platform.OS === 'android' ? requireNativeModule('ExpoPhoneNumberHint') : null;

export const requestPhoneNumberHint = async () => {
  if (Platform.OS === 'android' && ExpoPhoneNumberHint) {
    try {
      return await ExpoPhoneNumberHint.requestPhoneNumberHint();
    } catch (error) {
      return {
        phoneNumber: '',
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  } else {
    console.warn('ExpoPhoneNumberHint is only supported on Android.');
    return {
      phoneNumber: '',
      success: false,
      error: 'Platform not supported'
    };
  }
};

export default { requestPhoneNumberHint };
