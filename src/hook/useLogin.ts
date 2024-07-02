import { signin } from '@/api/auth/auth.post.api';
import { UserLoginType } from '@/api/types/auth';
import { setCookie } from '@/utils/cookies';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { throttle } from 'lodash';
//todo 기범님 오류
import { getTokenHandler } from '@/components/pwa/Fcm';
import { fcmpost } from '@/api/fcm/fcm.post.api';

const useLogin = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const onSuccess = async (data: UserLoginType) => {
    const { accessToken } = data.data;
    const cookieOptions = { path: '/', maxAge: 3000000 * 15 };
    const token = await getTokenHandler();
    fcmpost({ fcmToken: token });
    setCookie('token', accessToken, cookieOptions);
    router.push('/');
  };

  const onError = (error: any) => {
    setError('*아이디 혹은 비밀번호가 일치하지 않습니다');
    console.log(error);
  };

  const { mutate: originalMutate } = useMutation({
    mutationFn: signin,
    onSuccess,
    onError
  });

  const mutate = throttle(originalMutate, 3000); // 3초 동안 throttle 처리
  return { mutate, error };
};

export default useLogin;
