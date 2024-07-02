'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import BgPurpleLayout from './BgPurpleLayout';
import MainHeader from './MainHeader';
import CurrentOffice from './CurrentOffice';
import OfficeNotice from './OfficeNotice';
import UserInfo from './UserInfo';
import OfficeInfo from './OfficeInfo';
import WeekSchedule from './weekSchedule/WeekSchedule';
// import AvailableRoom from './AvailableRoom';
import { useReservationStore } from '@/store/reservationModal.store';
// import OfficeDeleteModal from './officeInfo/OfficeDeleteModal';
const OfficeDeleteModal = dynamic(() => import('./officeInfo/OfficeDeleteModal'));
const AvailableRoom = dynamic(() => import('./AvailableRoom'));
const MainPageIndex = () => {
  const { deleteOpen, deleteDeskId } = useReservationStore();
  return (
    <div className="mb-[100px]">
      <BgPurpleLayout>
        <MainHeader />
        <CurrentOffice />
        <OfficeNotice />
        <UserInfo />
      </BgPurpleLayout>
      <div className="mx-4">
        <OfficeInfo />
        <WeekSchedule />
        <AvailableRoom />
      </div>
      {deleteOpen && deleteDeskId !== null && <OfficeDeleteModal />}
    </div>
  );
};

export default MainPageIndex;
