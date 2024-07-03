'use client';
import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';
const MainHeader = () => {
  const router = useRouter();
  return (
    <header>
      <div className="flex justify-between items-center py-6">
        <div className="w-[116px] h-8 cursor-pointer">
          <Image
            src="/OffispaceLogo.png"
            alt="logo"
            width={115}
            height={20}
            className="w-full"
            loading="eager"
          />
        </div>
        <div className="flex justify-center items-center gap-6 ">
          <div className="cursor-pointer" onClick={() => router.push('mypage/question')}>
            <Image
              src="/home/Inquiry_white.svg"
              alt="inquiry"
              width={20}
              height={20}
              loading="eager"
            />
          </div>
          <div className="cursor-pointer" onClick={() => router.push('/notification')}>
            <Image
              src="/home/Notification_white.svg"
              alt="notification"
              width={20}
              height={20}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
