'use client';
import useOnClickOutside from '@/components/community/hooks/useOnClickOutside';
import { useReservationStore } from '@/store/reservationModal.store';
import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import { getReservationDetail } from '../../remote/myreservation';
import { format, isBefore } from 'date-fns';

const FRDetailModal = () => {
  const { setOpen, reservationId, setDeleteOpen, setDeleteDeskId, setRoomType } =
    useReservationStore();

  const { data } = useQuery(
    ['reservationDetail', reservationId],
    () => getReservationDetail(reservationId),
    {
      enabled: reservationId != null
    }
  );

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  if (data == undefined) {
    return null;
  }

  const renderButton = () => {
    if (data?.spaceType == 'FOCUSDESK') {
      return (
        <div
          onClick={() => {
            setRoomType('FOCUS');
            setDeleteDeskId(data?.spaceId);
            setOpen(false);
            setDeleteOpen(true);
          }}
          className="cursor-pointer rounded-xl border-2 border-space-purple my-8 py-[13px] flex items-center justify-center text-space-purple font-semibold text-lg ">
          이용 종료
        </div>
      );
    } else {
      const result = isBefore(data?.startAt, new Date());
      if (result) {
        return (
          <div className="rounded-xl border-2 border-gray-300 my-8 py-[13px] flex items-center justify-center text-gray-400 text-semibold text-lg ">
            이용 중
          </div>
        );
      } else {
        return (
          <div
            onClick={() => {
              setRoomType('RECHARGING');
              setDeleteDeskId(data?.reservationId);
              setOpen(false);
              setDeleteOpen(true);
            }}
            className="cursor-pointer rounded-xl border-2 border-space-purple my-8 py-[13px] flex items-center justify-center text-space-purple text-semibold text-lg ">
            예약 취소
          </div>
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 z-[99999]">
      <div
        ref={ref}
        className="z-50 w-[393px] bg-white absolute left-1/2 bottom-0 transform -translate-x-1/2 rounded-t-2xl">
        {/* 공통부분 */}
        <div className="mx-[30px]">
          <div className="flex justify-between items-center">
            <div className="mt-[30px] text-space-black text-lg font-bold">
              {data?.reservationName}
            </div>
            <div className="mt-[30px] cursor-pointer" onClick={() => setOpen(false)}>
              <img src="/reservation/modalCloseIcon.svg" alt="" />
            </div>
          </div>

          <div className="mt-8 flex gap-2 ">
            <div className="mt-[6px]">
              <img src="/reservation/modaltime.svg" alt="" />
            </div>
            <div>
              <div className="text-space-black text-base font-semibold">
                {format(data?.startAt, 'MM.dd')} 오늘
              </div>
              <div className="text-space-black text-sm font-medium">
                {format(data?.startAt, 'HH:mm')} ~{' '}
                {data?.spaceType == 'RECHARGINGROOM'
                  ? format(data?.endAt, 'HH:mm')
                  : '00:00'}
              </div>
            </div>
          </div>

          <div className="mt-[25px] flex gap-2 ">
            <div className="mt-1">
              <img src="/reservation/modallocation.svg" alt="" />
            </div>
            <div>
              <div className="text-space-black text-base font-semibold">
                {data?.branchName} {data?.spaceName}
              </div>
              <div className="text-space-black text-sm font-medium">
                {data?.branchAddress}
              </div>
            </div>
          </div>
          {renderButton()}
        </div>
      </div>
    </div>
  );
};

export default FRDetailModal;
