import React, { useEffect, useState } from 'react';
import { getMeetingRooms } from '@/api/reservation/getMeetingRoom';
import { GetMeetingRoomsParams, MeetingRoom } from '@/api/types/room';
import { useBranchStore } from '@/store/branch.store';
import Image from 'next/image';
import DatePickerModal from './DatePickerModal';
import Link from 'next/link';

const formatDateToCustomString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};

const formatDisplayDate = (startDate: Date, endDate: Date): string => {
  const month = String(startDate.getMonth() + 1).padStart(2, '0');
  const day = String(startDate.getDate()).padStart(2, '0');
  const startHours = String(startDate.getHours()).padStart(2, '0');
  const startMinutes = String(startDate.getMinutes()).padStart(2, '0');
  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
  return `${month}.${day} ${startHours}:${startMinutes}~${endHours}:${endMinutes}`;
};

const setInitialDateTime = (): [Date, Date, string] => {
  const now = new Date();
  let startAt: Date;

  if (now.getMinutes() > 30) {
    startAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
  } else {
    startAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 30, 0);
  }

  const endAt = new Date(startAt.getTime() + 60 * 60 * 1000);
  const currentTime = formatDisplayDate(startAt, endAt);

  return [startAt, endAt, currentTime];
};

const setInitialParams = (startAt: Date, endAt: Date, branchName: string): GetMeetingRoomsParams => {
  const formattedStartAt = formatDateToCustomString(startAt);
  const formattedEndAt = formatDateToCustomString(endAt);

  return {
    startAt: formattedStartAt,
    endAt: formattedEndAt,
    branchName: branchName,
    meetingRoomTypes: ['MINI', 'STANDARD', 'MEDIUM', 'STATE'],
    projectorExists: false,
    canVideoConference: false,
    isPrivate: false,
    sortTarget: 'roomCapacity',
    sortDirection: 'ASC',
  };
};

const MeetingRoomIndex: React.FC = () => {
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  const [params, setParams] = useState<GetMeetingRoomsParams | null>(null);
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMeetingRoomTypes, setSelectedMeetingRoomTypes] = useState<string>('인원 수');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('비품');

  useEffect(() => {
    if (!selectedBranch) return;

    const [startAt, endAt, currentTime] = setInitialDateTime();
    setStartTime(startAt);
    setEndTime(endAt);
    setCurrentTime(currentTime);

    const initialParams = setInitialParams(startAt, endAt, selectedBranch.branchName);
    setParams(initialParams);
  }, [selectedBranch]);

  const fetchMeetingRooms = async (params: GetMeetingRoomsParams) => {
    try {
      const rooms = await getMeetingRooms(params);
      rooms.sort((a, b) => a.meetingRoomCapacity - b.meetingRoomCapacity || a.meetingRoomId - b.meetingRoomId);
      setMeetingRooms(rooms);
      console.log(rooms);
    } catch (error) {
      console.error('Error fetching meeting rooms:', error);
    }
  };

  useEffect(() => {
    if (params) {
      fetchMeetingRooms(params);
      console.log(params);
    }
  }, [params]);

  const roomTypeMap: { [key: string]: string } = {
    'MINI': '미니(1-4인)',
    'STANDARD': '스탠다드(5-8인)',
    'MEDIUM': '미디움(9-12인)',
    'STATE': '스테이트(13-15인)',
  };

  const handleConfirm = (
    startDate: Date,
    endDate: Date,
    options: {
      meetingRoomTypes: ('MINI' | 'STANDARD' | 'MEDIUM' | 'STATE')[];
      projectorExists: boolean;
      canVideoConference: boolean;
      isPrivate: boolean;
    }
  ) => {
    const formattedStartAt = formatDateToCustomString(startDate);
    const formattedEndAt = formatDateToCustomString(endDate);
    setCurrentTime(formatDisplayDate(startDate, endDate));

    const newParams: GetMeetingRoomsParams = {
      ...params!,
      startAt: formattedStartAt,
      endAt: formattedEndAt,
      meetingRoomTypes: options.meetingRoomTypes,
      projectorExists: options.projectorExists,
      canVideoConference: options.canVideoConference,
      isPrivate: options.isPrivate,
    };
    setParams(newParams);
    setStartTime(startDate);
    setEndTime(endDate);

    const selectedCount = options.meetingRoomTypes.length;
    const displayTypes = selectedCount > 1 
      ? `${roomTypeMap[options.meetingRoomTypes[0]]}외 ${selectedCount - 1}` 
      : roomTypeMap[options.meetingRoomTypes[0]];
    setSelectedMeetingRoomTypes(displayTypes);

    const equipmentArray = [];
    if (options.projectorExists) equipmentArray.push('프로젝터');
    if (options.canVideoConference) equipmentArray.push('화상 회의');
    if (options.isPrivate) equipmentArray.push('프라이빗');
    const selectedEquipCount = equipmentArray.length;
    const displayEquipment = selectedEquipCount > 1 
      ? `${equipmentArray[0]} 외 ${selectedEquipCount - 1}` 
      : (equipmentArray[0] || '비품');
    setSelectedEquipment(displayEquipment);
  };

  const handleReset = () => {
    const [startAt, endAt, currentTime] = setInitialDateTime();
    setStartTime(startAt);
    setEndTime(endAt);
    setCurrentTime(currentTime);

    setSelectedMeetingRoomTypes('인원 수');
    setSelectedEquipment('비품');
    
    const initialParams = setInitialParams(startAt, endAt, selectedBranch!.branchName);
    setParams(initialParams);
  };
  

  return (
    <div className="p-4 h-screen">
      <div className='relative'>
        <Image src={'/resetwithbg.svg'} width={45} height={45} alt="reset" className="absolute right-0" onClick={handleReset} />
      </div>
      <div className="flex mb-4 overflow-x-auto whitespace-nowrap">
        <div
          className="flex-none w-[190px] h-[33px] px-3 py-2 bg-violet-100 rounded inline-flex cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <Image src={'/calendar.svg'} width={14} height={14} alt="calendar" className="mr-[6px]" />
          <div className="text-neutral-700 text-sm font-semibold font-['Pretendard']">{currentTime}</div>
          <Image src={'/bottomArrow.svg'} width={11} height={11} alt="bottomArrow" className="ml-auto mr-[2px]" />
        </div>
        <div
          className={`flex-none h-[33px] px-3 py-2 rounded inline-flex cursor-pointer ml-2 ${selectedMeetingRoomTypes === '인원 수' ? 'w-[110px] bg-white border border-neutral-300' : 'w-[170px] bg-violet-100'}`}
          onClick={() => setShowModal(true)}
        >
          <Image src={'/people.svg'} width={14} height={14} alt="people" className="mr-[6px]" />
          <div className="text-neutral-700 text-sm font-semibold font-['Pretendard']">{selectedMeetingRoomTypes}</div>
          <Image src={'/bottomArrow.svg'} width={11} height={11} alt="bottomArrow" className="ml-auto mr-[2px]" />
        </div>
        <div
          className={`flex-none h-[33px] px-3 py-2 rounded inline-flex cursor-pointer ml-2 mr-[50px] ${selectedEquipment === '비품' ? 'w-[100px] bg-white border border-neutral-300' : 'w-[150px] bg-violet-100'}`}
          onClick={() => setShowModal(true)}
        >
          <Image src={'/check.svg'} width={14} height={14} alt="check" className="mr-[6px]" />
          <div className="text-neutral-700 text-sm font-semibold font-['Pretendard']">{selectedEquipment}</div>
          <Image src={'/bottomArrow.svg'} width={11} height={11} alt="bottomArrow" className="ml-auto mr-[2px]" />
        </div>
      </div>
      <div className='flex mb-2'>
      <div className="text-indigo-700 text-lg font-bold font-['Pretendard']">바로예약</div>
      <div className="text-black text-lg font-medium font-['Pretendard'] ml-[5px]">가능</div>
      </div>
      <div className="mb-4">총 {meetingRooms.length}개의 공간</div>
      <div className="grid grid-cols-2 gap-x-[11px] gap-y-[24px]">
        {meetingRooms.map((room) => (
          <Link key={room.meetingRoomId} href={`/reservation/${room.meetingRoomId}`} passHref>
          <div key={room.meetingRoomId} className="overflow-hidden bg-white text-center">
            <div className="rounded">
              <Image
                src={room.meetingRoomImage || '/meetingRoomImg.svg'}
                width={175}
                height={124}
                alt={room.meetingRoomName}
                className="object-cover rounded"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-neutral-700 text-base font-bold font-['Pretendard'] mr-auto mt-[16px]">
                {room.meetingRoomName}
              </div>
              <div className="flex mt-[4px] items-center">
                <Image src={'/floor.svg'} width={14} height={14} alt="floor" className="mr-[6px]" />
                <div className="text-stone-500 text-xs font-normal font-['Pretendard'] mr-[12px] my-auto">
                  {room.meetingRoomFloor}층
                </div>
                <Image src={'/capacity.svg'} width={14} height={14} alt="capacity" className="mr-[6px]" />
                <div className="text-stone-500 text-xs font-normal font-['Pretendard']">1~{room.meetingRoomCapacity}명</div>
              </div>
            </div>
          </div>
          </Link>
        ))}
        <div className="h-[100px]"></div>
      </div>
      {startTime && endTime && (
        <DatePickerModal
          showModal={showModal}
          setShowModal={setShowModal}
          onConfirm={handleConfirm}
          initialStartTime={startTime}
          initialEndTime={endTime}
        />
      )}
    </div>
  );
};

export default MeetingRoomIndex;