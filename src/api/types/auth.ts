import { ICommon } from './common';

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp extends ISignIn {
  memberName: string;
  memberJob: string;
  memberPhone: string;
  memberSmsAgree: boolean;
}

export interface IUpdateProfile {
  memberEmail: string;
  memberName: string;
  memberJob: string;
  memberPhone: string;
}

export interface IPhoneNumber {
  phoneNumber: string;
}

export interface IPhoneAuth extends IPhoneNumber {
  code: string;
}

export interface IUserInfo {
  memberEmail: string;
  memberName: string;
  memberJob: string;
  memberNickName: string;
  memberSmsAgree: string;
  imageUrl?: string;
  memberPhone: string;
  companyName: string;
}

export interface IWithdraw {
  memberPassword: string;
}

export interface IEmail {
  emailAddress: string;
}

export interface IEmailChange {
  email: string;
}

export interface IPasswordVerifyChange extends IEmailChange {
  password: string;
}
export interface IEmailAuth extends IEmail {
  code: string;
}

export interface IEmailAuth2 {
  emailAddress: string;
  code: string;
}

export interface IToken {
  accessToken: string;
}
export interface ITokenRefresh {
  // 아직 타입 안들어옴
}

export interface IPasswordChage {
  currentPassword: string;
  newPassword: string;
}
export type FindPassword = Pick<ISignUp, 'password'>;
export type ChangePassword = Pick<ISignUp, 'password'>;
export type UserInfoType = ICommon<IUserInfo>;
export type UserLoginType = ICommon<IToken>;
export type UserProfile = ICommon<IUpdateProfile>;
