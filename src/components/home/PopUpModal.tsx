'use client';
import React, { Dispatch } from 'react';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface PopUpModalType {
  setGuideModalOpen: Dispatch<React.SetStateAction<boolean>>;
}

const PopUpModal = ({ setGuideModalOpen }: PopUpModalType) => {
  const handleExpireTime = () => {
    const timeClicked = JSON.stringify(new Date().getTime());
    localStorage.setItem('timeClicked', timeClicked);
    setGuideModalOpen(false);
  };

  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 z-[99999]">
      <div className="z-50 w-[393px] bg-white absolute left-1/2 bottom-0 transform -translate-x-1/2 rounded-t-2xl">
        <div
          onClick={() => handleExpireTime()}
          className="flex items-center justify-end mt-2 mr-2 cursor-pointer">
          <IoClose size={30} color="#828282" />
        </div>
        <div className="flex items-center justify-center mt-4">
          <div className="text-space-purple-normal font-bold py-3 px-5 text-lg bg-space-purple-light rounded-lg">
            홈화면에서 만나요
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, translateX: -90 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut'
          }}
          animate={{
            opacity: 1,
            translateX: 0
          }}>
          <div className="mt-4 flex items-center justify-center text-space-black text-xl font-semibold">
            Offisapce 서비스를
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, translateX: -90 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            delay: 0.2
          }}
          animate={{
            opacity: 1,
            translateX: 0
          }}>
          <div className="flex items-center justify-center text-space-black text-xl font-semibold">
            <span className="text-space-purple font-bold">바로가기</span>에 추가해보세요.
          </div>
        </motion.div>
        <motion.div
          className="box"
          animate={{
            scale: [1, 1.1, 1.1, 1, 1],
            rotate: [0, 0, 10, 10, 0],
            borderRadius: ['0%', '0%', '50%', '50%', '0%']
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
            times: [0, 0.1, 0.2, 0.4, 1],
            repeatDelay: 1
          }}>
          <div className="my-6 flex items-center justify-center ">
            <Image
              src="/home/pwalogo.png"
              width={140}
              height={140}
              alt="logo"
              className="rounded-2xl"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, translateX: -90 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            delay: 0.6
          }}
          animate={{
            opacity: 1,
            translateX: 0
          }}>
          <div className="mb-4">
            <div className="mt-2 flex items-center justify-center text-gray-600 font-semibold text-md">
              모바일 첫 화면에서
            </div>
            <div className="flex items-center justify-center text-gray-600 font-semibold text-md">
              빠르게 이동할 수 있어요.
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, translateX: -90 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            delay: 0.9
          }}
          animate={{
            opacity: 1,
            translateX: 0
          }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              onClick={() => handleExpireTime()}
              className="cursor-pointer flex-1 ml-5 flex items-center h-[45px] justify-center rounded-lg bg-gray-400 text-lg text-white font-semibold ">
              다시 보지 않기
            </div>
            <div
              onClick={() =>
                router.push(
                  'https://support.google.com/chrome/answer/9658361?hl=ko&co=GENIE.Platform%3DiOS&oco=2'
                )
              }
              className="cursor-pointer flex-1 mr-5 flex items-center  h-[45px] justify-center rounded-lg bg-space-purple text-lg text-white font-semibold ">
              자세히 보기
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PopUpModal;
