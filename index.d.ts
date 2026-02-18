export interface PhoneNumberHintResult {
  phoneNumber: string;
  success: boolean;
  error?: string;
}

export declare const requestPhoneNumberHint: () => Promise<PhoneNumberHintResult>;

declare const _default: {
  requestPhoneNumberHint: typeof requestPhoneNumberHint;
};

export default _default;
