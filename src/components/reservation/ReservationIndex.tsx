import React, { useEffect, useState } from 'react';
import CurrentRoom from './shared/CurrentRoom';
import ChangeRoomType from './shared/ChangeRoomType';
import FocuszoneIndex from './focuszone/FocuszoneIndex';
import MeetingRoomIndex from './meetingRoom/MeetingRoomIndex';
import RechargingRoomIndex from './rechargingRoom/RechargingRoomIndex';

interface ReservationIndexProps {
  initialTab: string;
}

const ReservationIndex: React.FC<ReservationIndexProps> = ({ initialTab }) => {
  const [currentRoom, setCurrentRoom] = useState('meeting');

  useEffect(() => {
    if (initialTab) {
      const tabMapping: { [key: string]: string } = {
        meetingRoom: 'meeting',
        rechargingRoom: 'recharging',
        focusZone: 'focus'
      };
      setCurrentRoom(tabMapping[initialTab] || 'meeting');
    }
  }, [initialTab]);

  return (
    <div className="mt-[80px] mb-[100px] ">
      {/* 현재 지정된 오피스 */}
      <header>
        <CurrentRoom />
      </header>

      {/* 룸 타입 설정 네브바 */}
      <nav>
        <ChangeRoomType currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
      </nav>

      {/* 룸 타입에 따른 예약  */}
      <section>
        {currentRoom === 'meeting' ? <MeetingRoomIndex /> : null}
        {currentRoom === 'recharging' ? <RechargingRoomIndex /> : null}
        {currentRoom === 'focus' ? <FocuszoneIndex /> : null}
      </section>
    </div>
  );
};

export default ReservationIndex;
