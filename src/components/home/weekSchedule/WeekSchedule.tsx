'use client';
import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSaturday, isSunday, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const WeekScheduleItem = dynamic(() => import('./WeekScheduleItem'), {
  loading: () => <div className="w-[361px] h-[121px] " />
});

const WeekSchedule = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const today: Date = new Date();
  const startDate: Date = startOfWeek(today, { weekStartsOn: 1 });
  const daysOfWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day: Date = addDays(startDate, i);
    daysOfWeek.push(day);
  }
  const formattedSelectedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  return (
    <div className="py-10 flex flex-col gap-4">
      {/* 이번주일정 */}
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold  text-gray-800">이번 주 일정</div>
        <div className="flex justify-center items-center gap-2 cursor-pointer">
          <div
            onClick={() => router.push('reservation/myreservationlist')}
            className="text-gray-500 text-sm font-normal ">
            전체보기
          </div>
          <Image src="/home/toNext_gray.svg" alt="toNext" width={7} height={13} />
        </div>
      </div>
      {/* 주차별 캘린더 */}
      <div className="flex gap-[11px] justify-center items-center bg-violet-50">
        {daysOfWeek.map((day, i) => (
          <div
            className={`mt-3 mb-3 py-[13px] px-[11px] flex flex-col gap-[13px] cursor-pointer text-base font-medium 
            ${isSaturday(day) || isSunday(day) ? 'text-gray-400' : 'text-gray-600'} 
            ${selectedDate && isSameDay(day, selectedDate) ? 'bg-space-purple text-white rounded-[30px]' : ''}
            items-center justify-center`}
            key={i}
            onClick={() => {
              setSelectedDate(day);
            }}>
            <div>{format(day, 'EEEE', { locale: ko }).slice(0, 1)}</div>
            <div>{format(day, 'dd')}</div>
          </div>
        ))}
      </div>

      {/* 예약 리스트 */}
      <WeekScheduleItem formattedSelectedDate={formattedSelectedDate} />
    </div>
  );
};

export default WeekSchedule;
