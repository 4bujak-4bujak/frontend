import React, { Dispatch, useState } from 'react';
import { WritePostType } from '../model/writePostType';
import { interestTag } from '@/constant/interestTag';

interface WritePostInterestType {
  postData: Partial<WritePostType>;
  setPostData: Dispatch<React.SetStateAction<WritePostType>>;
}

const WritePostInterest = ({ postData, setPostData }: WritePostInterestType) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="py-4 border-b border-gray-200">
      {/* 위에 부분 */}
      <div className="flex items-center">
        <div className="text-lg font-bold text-gray-900">직무 선택</div>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-space-purple text-lg font-medium flex-1 ml-5 cursor-pointer">
          {postData.category}
        </div>
        <div className="cursor-pointer" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? (
            <img src="/community/toTop.svg" alt="" />
          ) : (
            <img src="/community/toBottom.svg" alt="" />
          )}
        </div>
      </div>
      {/* 클릭하면 나오는 부분 */}
      {isOpen && (
        <div className="flex flex-wrap gap-2 pt-4">
          {interestTag.slice(1).map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setPostData((prev) => ({
                  ...prev,
                  category: item.title
                }));
                setIsOpen((prev) => !prev);
              }}
              className={`cursor-pointer py-[6px] px-[10px] text-sm font-medium rounded-3xl
            ${postData.category === item.title ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-700'}
            `}>
              {item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WritePostInterest;
