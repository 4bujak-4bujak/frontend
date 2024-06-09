import React, { Dispatch } from 'react';
import { rechargingRoomDataType } from '../model/recharging';
import { SelectedState } from './RechargingRoomIndex';

interface RechargingRoomItemType {
  roomData: rechargingRoomDataType;
  isSelected: SelectedState;
  setIsSelected: Dispatch<React.SetStateAction<SelectedState>>;
}

const RechargingRoomItem = ({
  roomData,
  isSelected,
  setIsSelected
}: RechargingRoomItemType) => {
  const handleTimeBtn = (startAt: string) => {
    setIsSelected({
      rechargingRoomId: roomData?.rechargingRoomId,
      startAt,
      rechargingRoomName: roomData?.rechargingRoomName
    });
  };

  return (
    <div className="mt-5">
      {/* 캐러셀 */}
      <div className="mx-4 w-[361px] shadow rounded border border-gray-100">
        <img src="/reservation/rechargingMock.jpeg" alt="" className="w-full" />
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
