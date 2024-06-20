import React, { useEffect, useState } from 'react';
import { getMeetingRooms } from '@/api/reservation/getMeetingRoom';
import { GetMeetingRoomsParams, MeetingRoom } from '@/api/types/room';
import { useBranchStore2 } from '@/store/reserve.store';
import Image from 'next/image';
import DatePickerModal from './DatePickerModal';
import { useRouter } from 'next/router';
import { useBranchStore } from '@/store/branch.store';
import { getBranchesByDistance } from '@/api/reservation/getBranchesByDistance';
import { BranchDistanceResponse } from '@/api/types/branch';
import { getSelectedOfficeInfo } from '@/api/map/getSelectedOffice';

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
  const roundedMinutes = Math.ceil(now.getMinutes() / 30) * 30;
  const startAt = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    roundedMinutes,
    0
  );

  let endAt: Date;
  if (startAt.getHours() === 23 && startAt.getMinutes() === 30) {
    endAt = new Date(startAt.getTime() + 30 * 60 * 1000);
  } else {
    endAt = new Date(startAt.getTime() + 60 * 60 * 1000);
  }

  const currentTime = formatDisplayDate(startAt, endAt);

  return [startAt, endAt, currentTime];
};

const setInitialParams = (
  startAt: Date,
  endAt: Date,
  branchName: string
): GetMeetingRoomsParams => {
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
    sortDirection: 'ASC'
  };
};

const MeetingRoomIndex: React.FC = () => {
  const [params, setParams] = useState<GetMeetingRoomsParams | null>(null);
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoom[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMeetingRoomTypes, setSelectedMeetingRoomTypes] =
    useState<string>('인원 수');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('비품');
  const [sortTarget, setSortTarget] = useState<'roomCapacity' | 'roomFloor'>(
    'roomCapacity'
  );
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState('적은 인원 순');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<React.ReactNode>(null);

  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  const updatedTimeSelected = useBranchStore((state) => state.updatedTimeSelected);
  const reservedBranch = useBranchStore2((state) => state.reservedBranch);
  const updatedTimeReserved = useBranchStore2((state) => state.updatedTimeReserved);

  const [toastType, setToastType] = useState<string | null>(null);
  const [activeTabState, setActiveTabState] = useState<string>('');

  const [newMeetingRoomsInfo, setNewMeetingRoomsInfo] =
    useState<BranchDistanceResponse[]>();
  const [newMeetingRoomsInfo2, setNewMeetingRoomsInfo2] =
    useState<BranchDistanceResponse[]>();
  const [newMeetingRooms, setNewMeetingRooms] = useState<MeetingRoom[]>([]);
  const [newMeetingRooms2, setNewMeetingRooms2] = useState<MeetingRoom[]>([]);

  const currentBranch =
    updatedTimeSelected &&
    updatedTimeReserved &&
    updatedTimeSelected > updatedTimeReserved
      ? selectedBranch
      : reservedBranch || selectedBranch;

  useEffect(() => {
    if (!currentBranch) return;

    const [startAt, endAt, currentTime] = setInitialDateTime();
    setStartTime(startAt);
    setEndTime(endAt);
    setCurrentTime(currentTime);

    const initialParams = setInitialParams(startAt, endAt, currentBranch.branchName);
    setParams(initialParams);
    setSelectedSortOption('적은 인원 순');
  }, [currentBranch]);

  const fetchMeetingRooms = async (params: GetMeetingRoomsParams) => {
    try {
      const response = await getMeetingRooms(params);
      const rooms = response.meetingRoomForListList;
      const toastType = response.toastType;

      rooms.sort(
        (a, b) =>
          a.meetingRoomCapacity - b.meetingRoomCapacity ||
          a.meetingRoomId - b.meetingRoomId
      );

      setMeetingRooms(rooms);

      if (toastType == 'OVERLAPPING_MEETING_ROOM_EXISTS') {
        setToastMessage(
          <div className="flex text-white text-sm font-normal items-center h-full">
            <Image
              src="/reserveAlert.svg"
              width={30}
              height={30}
              alt="Reserve Alert"
              style={{ marginRight: '8px' }}
            />
            해당 시간에 미팅룸 일정이 있습니다.
            <br />
            다른 시간으로 예약해보세요.
          </div>
        );
        setToastType('OVERLAPPING_MEETING_ROOM_EXISTS');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 20000);
      }

      if (toastType === null) {
        setToastType('Can Click');
        setShowToast(false);
      }
    } catch (error) {
      console.error('Error fetching meeting rooms:', error);
    }
  };

  useEffect(() => {
    if (params) {
      fetchMeetingRooms(params);
    }
  }, [params]);

  useEffect(() => {}, [meetingRooms]);

  const roomTypeMap: { [key: string]: string } = {
    MINI: '미니(1-4인)',
    STANDARD: '스탠다드(5-8인)',
    MEDIUM: '미디움(9-12인)',
    STATE: '스테이트(13-15인)'
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
      isPrivate: options.isPrivate
    };
    setParams(newParams);
    setStartTime(startDate);
    setEndTime(endDate);

    const selectedCount = options.meetingRoomTypes.length;
    let displayTypes;
    if (selectedCount === 0) {
      displayTypes = '인원 수';
    } else if (selectedCount === 1) {
      displayTypes = roomTypeMap[options.meetingRoomTypes[0]];
    } else {
      displayTypes = `${roomTypeMap[options.meetingRoomTypes[0]]}외 ${selectedCount - 1}`;
    }
    setSelectedMeetingRoomTypes(displayTypes);

    const equipmentArray = [];
    if (options.projectorExists) equipmentArray.push('프로젝터');
    if (options.canVideoConference) equipmentArray.push('화상 회의');
    if (options.isPrivate) equipmentArray.push('프라이빗');
    const selectedEquipCount = equipmentArray.length;
    const displayEquipment =
      selectedEquipCount > 1
        ? `${equipmentArray[0]} 외 ${selectedEquipCount - 1}`
        : equipmentArray[0] || '비품';
    setSelectedEquipment(displayEquipment);
  };

  const handleReset = () => {
    const [startAt, endAt, currentTime] = setInitialDateTime();
    setStartTime(startAt);
    setEndTime(endAt);
    setCurrentTime(currentTime);

    setSelectedMeetingRoomTypes('인원 수');
    setSelectedEquipment('비품');

    const initialParams = setInitialParams(startAt, endAt, currentBranch!.branchName);
    setParams(initialParams);
  };

  const router = useRouter();

  const handleRoomClick = (roomId: number) => {
    const formattedCurrentTime = currentTime;
    router.push(
      {
        pathname: `/reservation/${roomId}`,
        query: {
          startTime: formattedCurrentTime,
          startedAt: params?.startAt,
          endedAt: params?.endAt
        }
      },
      `/reservation/${roomId}`
    );
  };

  const handleSortToggle = (
    target: 'roomCapacity' | 'roomFloor',
    direction: 'ASC' | 'DESC'
  ) => {
    setSortTarget(target);
    setSortDirection(direction);
    setDropdownOpen(false);

    if (target === 'roomCapacity') {
      setSelectedSortOption(direction === 'ASC' ? '적은 인원 순' : '많은 인원 순');
    } else {
      setSelectedSortOption(direction === 'ASC' ? '낮은 층 수' : '높은 층 수');
    }

    const sortedRooms = [...meetingRooms].sort((a, b) => {
      if (target === 'roomCapacity') {
        return direction === 'ASC'
          ? a.meetingRoomCapacity - b.meetingRoomCapacity
          : b.meetingRoomCapacity - a.meetingRoomCapacity;
      } else {
        return direction === 'ASC'
          ? a.meetingRoomFloor - b.meetingRoomFloor
          : b.meetingRoomFloor - a.meetingRoomFloor;
      }
    });
    setMeetingRooms(sortedRooms);
  };

  const handleModalOpen = (tab: string) => {
    setActiveTabState(tab);
    setShowModal(true);
  };

  const fetchBranchesByDistance = async (
    branchId: number,
    existingParams: GetMeetingRoomsParams
  ) => {
    try {
      const branches = await getBranchesByDistance(branchId);

      if (branches && branches.length > 0) {
        const nearestBranch = branches[0];
        setNewMeetingRoomsInfo([nearestBranch]);
        const newParams = {
          ...existingParams,
          branchName: nearestBranch.branchName
        };
        const response = await getMeetingRooms(newParams);
        const newRooms = response.meetingRoomForListList;

        setNewMeetingRooms(newRooms);

        const nearestBranch2 = branches[1];
        setNewMeetingRoomsInfo2([nearestBranch2]);
        const newParams2 = {
          ...existingParams,
          branchName: nearestBranch2.branchName
        };
        const response2 = await getMeetingRooms(newParams2);
        const newRooms2 = response2.meetingRoomForListList;

        setNewMeetingRooms2(newRooms2);
      }
    } catch (error) {
      console.error('Error fetching branches or meeting rooms:', error);
    }
  };

  const handleNear1Office = async () => {
    try {
      if (!newMeetingRoomsInfo || newMeetingRoomsInfo.length === 0) {
        console.error('newMeetingRoomsInfo is undefined or empty');
        return;
      }
      const data = await getSelectedOfficeInfo(newMeetingRoomsInfo[0].branchName);
      const officeInfo = data.data;
      router.push(
        {
          pathname: `/branches/${encodeURIComponent(newMeetingRoomsInfo[0].branchName)}`,
          query: {
            name: officeInfo.branchName,
            address: officeInfo.branchAddress,
            branchPhoneNumber: officeInfo.branchPhoneNumber,
            roadFromStation: officeInfo.roadFromStation,
            stationToBranch: officeInfo.stationToBranch.join(','),
            branchId: officeInfo.branchId
          }
        },
        `/branches/${encodeURIComponent(newMeetingRoomsInfo[0].branchName)}`
      );
    } catch (error) {
      console.error('Error fetching office info:', error);
    }
  };

  const handleNear2Office = async () => {
    try {
      if (!newMeetingRoomsInfo2 || newMeetingRoomsInfo2.length === 0) {
        console.error('newMeetingRoomsInfo is undefined or empty');
        return;
      }
      const data = await getSelectedOfficeInfo(newMeetingRoomsInfo2[0].branchName);
      const officeInfo = data.data;
      router.push(
        {
          pathname: `/branches/${encodeURIComponent(newMeetingRoomsInfo2[0].branchName)}`,
          query: {
            name: officeInfo.branchName,
            address: officeInfo.branchAddress,
            branchPhoneNumber: officeInfo.branchPhoneNumber,
            roadFromStation: officeInfo.roadFromStation,
            stationToBranch: officeInfo.stationToBranch.join(','),
            branchId: officeInfo.branchId
          }
        },
        `/branches/${encodeURIComponent(newMeetingRoomsInfo2[0].branchName)}`
      );
    } catch (error) {
      console.error('Error fetching office info:', error);
    }
  };

  useEffect(() => {
    if (meetingRooms.length == 0 && params) {
      fetchBranchesByDistance(currentBranch!.branchId, params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingRooms, params]);

  return (
    <div className="p-4 h-screen">
      <div className="relative cursor-pointer">
        <Image
          src={'/resetwithbg.svg'}
          width={45}
          height={45}
          alt="reset"
          className="absolute right-0"
          onClick={handleReset}
        />
      </div>
      <div className="flex mb-4 w-full overflow-x-auto whitespace-nowrap mr-[50px]">
        <div
          className="flex-none w-[190px] h-[33px] px-3 py-2 bg-violet-100 rounded inline-flex cursor-pointer"
          onClick={() => handleModalOpen('schedule')}>
          <Image
            src={'/calendar.svg'}
            width={14}
            height={14}
            alt="calendar"
            className="mr-[6px]"
          />
          <div className="text-neutral-700 text-sm font-semibold font-['Pretendard']">
            {currentTime}
          </div>
          <Image
            src={'/bottomArrow.svg'}
            width={11}
            height={11}
            alt="bottomArrow"
            className="ml-auto mr-[2px]"
          />
        </div>
        <div
          className={`flex-none h-[33px] px-3 py-2 rounded inline-flex cursor-pointer ml-2 ${selectedMeetingRoomTypes === '인원 수' ? 'w-[110px] bg-white border border-neutral-300' : 'w-[170px] bg-violet-100'}`}
          onClick={() => handleModalOpen('people')}>
          <Image
            src={'/people.svg'}
            width={14}
            height={14}
            alt="people"
            className="mr-[6px]"
          />
          <div className="text-neutral-700 text-sm font-semibold font-['Pretendard']">
            {selectedMeetingRoomTypes}
          </div>
          <Image
            src={'/bottomArrow.svg'}
            width={11}
            height={11}
            alt="bottomArrow"
            className="ml-auto mr-[2px]"
          />
        </div>
        <div className="w-[200px]">
          <div
            className={`flex-none h-[33px] px-3 py-2 rounded inline-flex cursor-pointer ml-2 mr-[50px] ${selectedEquipment === '비품' ? 'w-[100px] bg-white border border-neutral-300' : 'w-[150px] bg-violet-100'}`}
            onClick={() => handleModalOpen('equipment')}>
            <Image
              src={'/check.svg'}
              width={14}
              height={14}
              alt="check"
              className="mr-[6px]"
            />
            <div className="text-neutral-700 text-sm font-semibold font-['Pretendard']">
              {selectedEquipment}
            </div>
            <Image
              src={'/bottomArrow.svg'}
              width={11}
              height={11}
              alt="bottomArrow"
              className="ml-auto mr-[2px]"
            />
          </div>
        </div>
      </div>
      <div className="flex mb-2">
        <div className="text-indigo-700 text-lg font-bold font-['Pretendard']">
          바로예약
        </div>
        <div className="text-black text-lg font-medium font-['Pretendard'] ml-[5px]">
          가능
        </div>
      </div>
      <div className="flex mb-2 w-full items-center">
        <div className="">총 {meetingRooms.length}개의 공간</div>
        <div className="ml-auto">
          <div className="relative inline-block text-left">
            <div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                type="button"
                className={`inline-flex justify-center w-full rounded-md px-4 py-2 bg-white text-sm font-medium text-gray-700 border-none hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100`}
                id="options-menu"
                aria-haspopup="true"
                aria-expanded="true">
                {selectedSortOption}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M5.293 8.293a1 1 0 011.414-1.414L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 01-.001-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {dropdownOpen && (
              <div
                className={`origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999]`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu">
                <div className="py-1" role="none">
                  <button
                    onClick={() => handleSortToggle('roomCapacity', 'ASC')}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${sortTarget === 'roomCapacity' && sortDirection === 'ASC' ? 'text-indigo-700' : ''}`}
                    role="menuitem">
                    적은 인원 순
                  </button>
                  <button
                    onClick={() => handleSortToggle('roomCapacity', 'DESC')}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${sortTarget === 'roomCapacity' && sortDirection === 'DESC' ? 'text-indigo-700' : ''}`}
                    role="menuitem">
                    많은 인원 순
                  </button>
                  <button
                    onClick={() => handleSortToggle('roomFloor', 'ASC')}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${sortTarget === 'roomFloor' && sortDirection === 'ASC' ? 'text-indigo-700' : ''}`}
                    role="menuitem">
                    낮은 층 수
                  </button>
                  <button
                    onClick={() => handleSortToggle('roomFloor', 'DESC')}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${sortTarget === 'roomFloor' && sortDirection === 'DESC' ? 'text-indigo-700' : ''}`}
                    role="menuitem">
                    높은 층 수
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {meetingRooms.length === 0 ? (
        <div className="flex justify-center items-center mt-[60px] text-center text-neutral-400 text-base font-normal font-['Pretendard']">
          조건에 맞는 미팅룸이 없습니다.
        </div>
      ) : (
        <div
          className={`grid grid-cols-2 gap-x-[11px] gap-y-[24px] ${toastType === 'OVERLAPPING_MEETING_ROOM_EXISTS' ? 'pointer-events-none opacity-50' : ''}`}>
          {meetingRooms.map((room) => (
            <div
              key={room.meetingRoomId}
              className={`overflow-hidden bg-white text-center ${toastType === 'OVERLAPPING_MEETING_ROOM_EXISTS' ? 'pointer-events-none' : 'cursor-pointer'}`}
              onClick={() => handleRoomClick(room.meetingRoomId)}>
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
                  <Image
                    src={'/floor.svg'}
                    width={14}
                    height={14}
                    alt="floor"
                    className="mr-[6px]"
                  />
                  <div className="text-stone-500 text-xs font-normal font-['Pretendard'] mr-[12px] mt-auto">
                    {room.meetingRoomFloor < 0
                      ? `B${Math.abs(room.meetingRoomFloor)}`
                      : `${room.meetingRoomFloor}`}
                    층
                  </div>
                  <Image
                    src={'/capacity.svg'}
                    width={14}
                    height={14}
                    alt="capacity"
                    className="mr-[6px]"
                  />
                  <div className="text-stone-500 text-xs font-normal font-['Pretendard']">
                    최대 {room.meetingRoomCapacity}명
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        {meetingRooms.length === 0 && (
          <div>
            {newMeetingRooms?.length != 0 && newMeetingRooms2?.length != 0 && (
              <>
                <div className="w-full h-[4px] bg-gray-200 mt-[70px] mb-[35px]" />
                <div>
                  <span className="text-indigo-700 text-lg font-bold font-['Pretendard']">
                    같은 조건
                  </span>
                  <span className="text-black/opacity-20 text-lg font-medium font-['Pretendard']">
                    으로
                  </span>
                  <span className="text-black/opacity-20 text-lg font-bold font-['Pretendard']">
                    {' '}
                    <br />
                  </span>
                  <span className="text-indigo-700 text-lg font-bold font-['Pretendard']">
                    근처 지점
                  </span>
                  <span className="text-black/opacity-20 text-lg font-medium font-['Pretendard']">
                    에서 찾아봤어요.
                  </span>
                </div>
              </>
            )}
            {newMeetingRoomsInfo && newMeetingRooms?.length > 0 && (
              <>
                <div className="mt-[30px] mb-[20px]">
                  <div className="flex flex-row justify-between">
                    <div className="text-black/opacity-20 text-lg font-bold font-['Pretendard'] my-auto">
                      {newMeetingRoomsInfo[0].branchName}
                    </div>
                    <div className="ml-auto flex cursor-pointer">
                      <div
                        className="mr-[5px] text-neutral-400 text-sm font-normal font-['Pretendard'] leading-[21px] my-auto"
                        onClick={handleNear1Office}>
                        지점 상세보기
                      </div>
                      <Image
                        src={'/nextArrow.svg'}
                        width={5}
                        height={11}
                        alt="arrow"
                        className="mr-[6px] mb-[2px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row mt-[8px]">
                    <img
                      src={'/map/OfficeLocationSmall1.svg'}
                      width={8}
                      height={12}
                      alt="location"
                      className="mr-[6px] mb-[3px]"
                    />
                    <div className="text-neutral-700 text-sm font-normal font-['Pretendard'] leading-[21px]">
                      {currentBranch?.branchName}으로부터{' '}
                      {newMeetingRoomsInfo[0].distance.toFixed(2)}km
                    </div>
                  </div>
                </div>
                <div style={{ overflowX: 'auto', display: 'flex' }}>
                  {newMeetingRooms.map((room) => (
                    <div
                      key={room.meetingRoomId}
                      className={`overflow-hidden bg-white text-center ${toastType === 'OVERLAPPING_MEETING_ROOM_EXISTS' ? 'pointer-events-none' : 'cursor-pointer'}`}
                      onClick={() => handleRoomClick(room.meetingRoomId)}
                      style={{ minWidth: 160, maxWidth: 160, marginRight: 10 }}>
                      <div className="rounded">
                        <img
                          src={room.meetingRoomImage || '/meetingRoomImg.svg'}
                          width={160}
                          height={124}
                          alt={room.meetingRoomName}
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-neutral-700 text-base font-bold font-['Pretendard'] mr-auto mt-[16px]">
                          {room.meetingRoomName}
                        </div>
                        <div className="flex my-[4px] items-center">
                          <img
                            src={'/floor.svg'}
                            width={14}
                            height={14}
                            alt="floor"
                            className="mr-[6px]"
                          />
                          <div className="text-stone-500 text-xs font-normal font-['Pretendard'] mr-[12px] mt-auto">
                            {room.meetingRoomFloor < 0
                              ? `B${Math.abs(room.meetingRoomFloor)}`
                              : `${room.meetingRoomFloor}`}
                            층
                          </div>
                          <img
                            src={'/capacity.svg'}
                            width={14}
                            height={14}
                            alt="capacity"
                            className="mr-[6px]"
                          />
                          <div className="text-stone-500 text-xs font-normal font-['Pretendard']">
                            최대 {room.meetingRoomCapacity}명
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {newMeetingRoomsInfo2 && newMeetingRooms2?.length > 0 && (
              <>
                <div className="mt-[30px] mb-[20px]">
                  <div className="flex flex-row justify-between">
                    <div className="text-black/opacity-20 text-lg font-bold font-['Pretendard'] my-auto">
                      {newMeetingRoomsInfo2[0].branchName}
                    </div>
                    <div className="ml-auto flex cursor-pointer">
                      <div
                        className="mr-[5px] text-neutral-400 text-sm font-normal font-['Pretendard'] leading-[21px] my-auto"
                        onClick={handleNear2Office}>
                        지점 상세보기
                      </div>
                      <Image
                        src={'/nextArrow.svg'}
                        width={5}
                        height={11}
                        alt="arrow"
                        className="mr-[6px] mb-[2px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row mt-[8px]">
                    <img
                      src={'/map/OfficeLocationSmall1.svg'}
                      width={8}
                      height={12}
                      alt="location"
                      className="mr-[6px] mb-[3px]"
                    />
                    <div className="text-neutral-700 text-sm font-normal font-['Pretendard'] leading-[21px]">
                      {currentBranch?.branchName}으로부터{' '}
                      {newMeetingRoomsInfo2[0].distance.toFixed(2)}km
                    </div>
                  </div>
                </div>
                <div style={{ overflowX: 'auto', display: 'flex' }}>
                  {newMeetingRooms2.map((room) => (
                    <div
                      key={room.meetingRoomId}
                      className={`overflow-hidden bg-white text-center ${toastType === 'OVERLAPPING_MEETING_ROOM_EXISTS' ? 'pointer-events-none' : 'cursor-pointer'}`}
                      onClick={() => handleRoomClick(room.meetingRoomId)}
                      style={{ minWidth: 160, maxWidth: 160, marginRight: 10 }}>
                      <div className="rounded">
                        <img
                          src={room.meetingRoomImage || '/meetingRoomImg.svg'}
                          width={160}
                          height={124}
                          alt={room.meetingRoomName}
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-neutral-700 text-base font-bold font-['Pretendard'] mr-auto mt-[16px]">
                          {room.meetingRoomName}
                        </div>
                        <div className="flex my-[4px] items-center">
                          <img
                            src={'/floor.svg'}
                            width={14}
                            height={14}
                            alt="floor"
                            className="mr-[6px]"
                          />
                          <div className="text-stone-500 text-xs font-normal font-['Pretendard'] mr-[12px] mt-auto">
                            {room.meetingRoomFloor < 0
                              ? `B${Math.abs(room.meetingRoomFloor)}`
                              : `${room.meetingRoomFloor}`}
                            층
                          </div>
                          <img
                            src={'/capacity.svg'}
                            width={14}
                            height={14}
                            alt="capacity"
                            className="mr-[6px]"
                          />
                          <div className="text-stone-500 text-xs font-normal font-['Pretendard']">
                            최대 {room.meetingRoomCapacity}명
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="h-[100px]"></div>
      {startTime && endTime && (
        <DatePickerModal
          showModal={showModal}
          setShowModal={setShowModal}
          onConfirm={handleConfirm}
          initialStartTime={startTime}
          initialEndTime={endTime}
          activeTab={activeTabState}
        />
      )}
      {showToast && (
        <div className="fixed bottom-[100px] w-[303px] left-1/2 transform -translate-x-1/2 h-[68px] opacity-90 bg-neutral-700 px-4 py-2 rounded-[40px]">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default MeetingRoomIndex;
