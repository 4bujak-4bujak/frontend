// import { ICommon } from '../types/common';
import { postRequest } from '../request';
import {
  ISignIn,
  ISignUp,
  UserInfoType,
  IEmail,
  IEmailAuth,
  IPhoneNumber,
  IPhoneAuth
} from '../types/auth';

/* 회원가입 */

export const signup = async ({
  memberEmail,
  memberPassword,
  memberName,
  memberGender,
  memberJob,
  memberPhone,
  memberBirthDate,
  memberSmsAgree
}: ISignUp) => {
  const response = await postRequest<null, ISignUp>('members', {
    memberEmail,
    memberPassword,
    memberName,
    memberGender,
    memberJob,
    memberPhone,
    memberBirthDate,
    memberSmsAgree
  });
  return response;
};

/* 로그인 */

export const signin = async ({ memberEmail, memberPassword }: ISignIn) => {
  const response = await postRequest<UserInfoType, ISignIn>('login', {
    memberEmail,
    memberPassword
  });

  return response;
};

/* 이메일 인증 요청 */

export const emailauthrequest = async ({ emailAddress }: IEmail) => {
  const response = await postRequest<null, IEmail>('auth/email', {
    emailAddress
  });

  return response;
};

/* 이메일 코드 검증 */

export const emailauthverify = async ({ emailAddress, code }: IEmailAuth) => {
  const response = await postRequest<null, IEmailAuth>('auth/email/verify', {
    emailAddress,
    code
  });

  return response;
};

/* 휴대전화 번호 인증 요청*/

export const phoneauthrequest = async ({ phoneNumber }: IPhoneNumber) => {
  const response = await postRequest<null, IPhoneNumber>('/auth/phone', {
    phoneNumber
  });

  return response;
};

/* 휴대전화 번호 코드 검증*/

export const phoneauthverify = async ({ phoneNumber, code }: IPhoneAuth) => {
  const response = await postRequest<null, IPhoneAuth>('/auth/phone/verify', {
    phoneNumber,
    code
  });

  return response;
};

/* 로그아웃*/

export const logout = async () => {
  const response = await postRequest<null, null>('/logout');

  return response;
};

/* 토큰 리프레쉬*/
