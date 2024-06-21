import MainContainer from '@/components/shared/MainContainer';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <MainContainer>
      <Image
        src="/404img.gif"
        width={500}
        height={500}
        alt="404"
        className="mt-[160px]"
      />
      <div className="flex items-center justify-center text-3xl font-extrabold">
        페이지가 존재하지 않습니다.
      </div>
      <div
        onClick={() => router.replace('/')}
        className="cursor-pointer mt-16 mx-auto rounded-lg w-[360px] h-12 bg-space-purple text-white text-xl font-semibold flex items-center justify-center">
        홈으로
      </div>
    </MainContainer>
  );
};

export default NotFoundPage;
