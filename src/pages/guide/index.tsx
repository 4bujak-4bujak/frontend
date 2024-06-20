import Footer from '@/components/layout/footer/Footer';
import MainContainer from '@/components/shared/MainContainer';
import React, { useState } from 'react';

const GuidePage = () => {
  const [phone, setPhone] = useState('aos');
  return (
    <MainContainer>
      <header className="w-full flex gap-[20px] pl-[16px] pt-[12px] mt-6">
        <div
          className={`w-[73px] h-[41px] cursor-pointer font-pretendard] text-lg flex justify-center items-centerpt-3 pb-2
      ${phone === 'aos' ? 'text-gray-900 font-bold border-b-2 border-space-purple ' : 'text-gray-900'}
      `}
          onClick={() => setPhone('aos')}>
          Andriod
        </div>
        <div
          className={`w-[73px] h-[41px] cursor-pointer font-pretendard] text-lg flex justify-center items-centerpt-3 pb-2
      ${phone === 'ios' ? 'text-gray-900 font-bold border-b-2 border-space-purple ' : 'text-gray-900'}
      `}
          onClick={() => setPhone('ios')}>
          IOS
        </div>
      </header>
      <Footer />
    </MainContainer>
  );
};

export default GuidePage;
