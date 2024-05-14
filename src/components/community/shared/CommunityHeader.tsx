import { useCurrentTalkStore } from '@/store/currentTalk.store';
import React from 'react';

const CommunityHeader = () => {
  const { currentTalk, setCurentTalk } = useCurrentTalkStore();
  return (
    <header className="w-full flex gap-[16px] pl-[16px] pt-[8px] ">
      <div
        className={`w-[63px] h-[41px] cursor-pointer font-pretendard] text-lg flex justify-center items-centerpt-3 pb-2
      ${currentTalk === 'career' ? 'text-black font-extrabold border-b-2 border-space-purple ' : 'text-neutral-800'}
      `}
        onClick={() => setCurentTalk('career')}>
        커리어톡
      </div>
      <div
        className={`w-[63px] h-[41px] cursor-pointer font-pretendard] text-lg flex justify-center items-centerpt-3 pb-2
      ${currentTalk === 'interest' ? 'text-black font-extrabold border-b-2 border-space-purple ' : 'text-neutral-800'}
      `}
        onClick={() => setCurentTalk('interest')}>
        관심톡
      </div>
    </header>
  );
};

export default CommunityHeader;
