import { ICommon } from './common';

export interface ISignIn {
  memberEmail: string;
  memberPassword: string;
}

export interface ISignUp extends ISignIn {
  memberName: string;
  memberGender: string;
  memberJob: string;
  memberPhone: string;
  memberBirthDate: string;
  memberSmsAgree: boolean;
}

export interface IUpdateProfile {
  memberEmail: string;
  memberName: string;
  memberJob: string;
  memberPhone: string;
  memberBirthDate: string;
}

export interface IPhoneNumber {
  phoneNumber: string;
}

export interface IPhoneAuth extends IPhoneNumber {
  code: number;
}

export interface IUserInfo {
  memberEmail: string;
  memberName: string;
  memberJob: string;
  memberPhone: string;
  memberBirthDate: string;
}

export interface IWithdraw {
  memberPassword: string;
}

export interface IEmail {
  emailAddress: string;
}
export interface IEmailAuth extends IEmail {
  code: number;
}

export interface ITokenRefresh {
  // 아직 타입 안들어옴
}
export type FindPassword = Pick<ISignUp, 'memberPassword'>;
export type ChangePassword = Pick<ISignUp, 'memberPassword'>;
export type UserInfoType = ICommon<IUserInfo>;
