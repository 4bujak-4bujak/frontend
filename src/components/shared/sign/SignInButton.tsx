import { useRouter } from 'next/router';
import React from 'react';

const SignInButton = () => {
  const router = useRouter();
  //
  return (
    <button
      data-cy="sign-in-Btn"
      className=" w-[361px] h-12 px-3.5 rounded-lg border border-black justify-center items-center inline-flex text-black text-[15px] font-semibold font-pretendard leading-snug"
      onClick={() => router.push('/signin')}>
      로그인
    </button>
  );
};

export default SignInButton;
