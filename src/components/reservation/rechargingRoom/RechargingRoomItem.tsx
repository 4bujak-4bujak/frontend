import React, { Dispatch } from 'react';
import { rechargingRoomDataType } from '../model/recharging';
import { SelectedState } from './RechargingRoomIndex';
import { checkValidRecharging } from '../remote/recharging';
import Image from 'next/image';

interface RechargingRoomItemType {
  roomData: rechargingRoomDataType;
  isSelected: SelectedState;
  setIsSelected: Dispatch<React.SetStateAction<SelectedState>>;
  setErrorModal: Dispatch<React.SetStateAction<string>>;
}

const RechargingRoomItem = ({
  roomData,
  isSelected,
  setIsSelected,
  setErrorModal
}: RechargingRoomItemType) => {
  const formatDateWithCurrentDate = (time: string): string => {
    const today = new Date();
    const [hours, minutes] = time.split(':');
    today.setHours(parseInt(hours, 10));
    today.setMinutes(parseInt(minutes, 10));
    today.setSeconds(0);
    today.setMilliseconds(0);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}T${time}:00`;
  };

  const handleTimeBtn = async (startAt: string) => {
    const formattedStartAt = startAt ? formatDateWithCurrentDate(startAt) : '';
    const data = await checkValidRecharging(formattedStartAt);

    if (data?.toastType === 'OVERLAPPING_MEETING_ROOM_EXISTS') {
      //리차징룸 시간대에 미팅룸 예약 했을 때
      setErrorModal('MEETING_ROOM_EXISTS');
    } else if (data?.toastType === 'OVERLAPPING_RECHARGING_ROOM_EXISTS') {
      //리차징룸 시간대에 다른 리차징룸이 있을 떄
      setErrorModal('RECHARGING_ROOM_EXISTS');
    } else {
      setIsSelected({
        rechargingRoomId: roomData?.rechargingRoomId,
        startAt,
        rechargingRoomName: roomData?.rechargingRoomName
      });
    }
  };

  return (
    <div className="mt-5">
      {/* 캐러셀 */}
      <div className="mx-4 w-[361px] shadow rounded border border-gray-100">
        <Image
          width={359}
          height={239}
          src="/reservation/rechargingMock.jpeg"
          alt=""
          className="w-full"
        />
        <div className="mx-4 mt-4 text-space-black text-lg font-bold">
          {roomData?.rechargingRoomName}
        </div>
        <div className="mx-4 my-4 flex items-center gap-5">
          <div className="flex items-center gap-[6px]">
            <div>
              <img src="/reservation/rechargingUp.svg" alt="" />
            </div>
            <div> {roomData?.rechargingRoomFloor}</div>
          </div>
          <div className="flex items-center gap-[6px]">
            <div>
              <img src="/reservation/rechargingHuman.svg" alt="" />
            </div>
            <div>예약 후 이용가능</div>
          </div>
          <div className="flex items-center gap-[6px]">
            <div>
              <img src="/reservation/rechargingTime.svg" alt="" />
            </div>
            <div>리클라이너</div>
          </div>
        </div>
      </div>
      {/* 시간고르기 */}
      <div className="flex items-center gap-[10px] mt-5 mx-4">
        {roomData?.times.map((item, i) => (
          <div
            key={i}
            onClick={() => {
              if (item.canReserve) {
                handleTimeBtn(item.startAt);
              }
            }}
            className={`
        ${
          !item.canReserve
            ? 'border border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed'
            : isSelected.startAt === item.startAt &&
                isSelected.rechargingRoomId === roomData?.rechargingRoomId
              ? 'bg-space-purple text-white cursor-pointer'
              : 'bg-violet-50 border-violet-300 border text-space-purple cursor-pointer'
        }
        rounded w-16 h-8 px-2.5 py-1 flex items-center justify-center text-sm font-normal`}>
            {item.startAt}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RechargingRoomItem;
