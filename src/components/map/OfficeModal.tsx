import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ModalProps } from '@/api/types/branch';

const OfficeModal: React.FC<ModalProps> = ({ isOpen, onClose, branchName, branchAddress }) => {
    const modalRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
  
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onClose]);
  
    if (!isOpen) return null;
  
    return (
        <div className="w-[373px] mx-auto fixed bottom-[20px] left-0 right-0 z-50">
          <div ref={modalRef} className="bg-white px-4 py-6 rounded-lg shadow-lg">
        
            <div className='flex'>
              <div className="flex-shrink-0 w-[88px] h-[88px] bg-gray-300 rounded-md">
                <Image 
                  src="/OfficeDefaultImg.png" 
                  alt="Office" 
                  width={88}
                  height={88}
                  className="object-cover rounded-md w-full h-full"
                />
              </div>
              <div className='ml-4 flex-1'>
            <div className="text-xl font-semibold">{branchName}</div>
            <div className="flex items-start">
              <Image src="/OfficeLocationSmall1.svg" alt="Location" width={12} height={16} className="mt-[4px] mr-2" />
              <p className="text-sm break-words">{branchAddress}</p>
            </div>
            <div className="flex">
              <Image src="/OfficeInfo.svg" alt="Location" width={12} height={12} className="mr-2" />
              <p className="text-sm break-words">회의실 43개 중 현재 22개 사용중</p>
            </div>
          </div>
            </div>
            <div className="flex justify-between mt-4">
            <button className="flex w-[151px] bg-[#EDEBF8] text-[#3B268C] px-4 py-[6px] rounded-md justify-center items-center gap-2">상세보기</button>
            <button className="flex w-[151px] text-[#3B268C] px-[6px] py-[6px] rounded-md justify-center items-center gap-2 border border-[#3E2896]">예약 바로가기</button>
            </div>
          </div>
        </div>
      );
    };
  
  export default OfficeModal;