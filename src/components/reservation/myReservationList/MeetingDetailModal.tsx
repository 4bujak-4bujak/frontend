import useOnClickOutside from '@/components/community/hooks/useOnClickOutside';
import { useReservationStore } from '@/store/reservationModal.store';
import React, { useRef } from 'react';

const MeetingDetailModal = () => {
  const { setOpen, reservationId } = useReservationStore();
  console.log(reservationId);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));
  //todo reservationId 이용해서 상세데이터 query 날리기

  const memberList = [
    {
      name: '강윤지',
      image: '/reservation/mockProfile.jpg',
      email: 'taking_yunyun@gmail.com',
      isLeader: false
    },
    {
      name: '메리맘',
      image: '/reservation/mockProfile.jpg',
      email: 'hi-merry@gmail.com',
      isLeader: true
    },
    {
      name: '강윤지',
      image: '/reservation/mockProfile.jpg',
      email: 'miseul-smile@gmail.com',
      isLeader: false
    },
    {
      name: '강윤지',
      image: '/reservation/mockProfile.jpg',
      email: 'suhyeonbabo@gmail.com',
      isLeader: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 z-[9999]">
      <div
        ref={ref}
        className="z-50 w-[393px] bg-white absolute left-1/2 bottom-0 transform -translate-x-1/2 rounded-t-2xl">
        {/* 공통부분 */}
        <div className="mx-[30px]">
          <div className="mt-[30px] text-space-black text-lg font-bold">포커스존</div>
          <div className="mt-8 flex gap-2 ">
            <div className="mt-1">
              <img src="/reservation/modaltime.svg" alt="" />
            </div>
            <div>
              <div className="text-space-black text-base font-semibold">06.12 오늘</div>
              <div className="text-space-black text-sm font-medium">14:00-15:00</div>
            </div>
          </div>

          <div className="mt-[25px] pb-8 flex gap-2 border-b border-gray-300">
            <div className="mt-1">
              <img src="/reservation/modallocation.svg" alt="" />
            </div>
            <div>
              <div className="text-space-black text-base font-semibold">
                광화문점 포커스존12
              </div>
              <div className="text-space-black text-sm font-medium">
                서울 종로구 중랑천길 345번길 48
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <img src="/reservation/meetingicon.svg" alt="" />
            <div className="text-space-black font-semibold text-base">참석자 4</div>
          </div>

          <div className="mx-3 mt-5 flex flex-col gap-4">
            {memberList.map((member, i) => (
              <div key={i} className="flex items-center gap-[13px]">
                <div className="w-[42px] h-[42px]">
                  <img src={member.image} alt="image" className="rounded-full" />
                </div>
                <div className="flex flex-col ">
                  <div className="text-space-black font-semibold text-base">
                    {member.name}
                  </div>
                  <div className="text-gray-500 font-normal text-base">
                    {member.email}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cursor-pointer rounded-xl border-2 border-space-purple my-8 py-[13px] flex items-center justify-center text-space-purple text-semibold text-lg ">
            예약 취소
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailModal;