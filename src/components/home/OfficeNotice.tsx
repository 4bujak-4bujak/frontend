import React from 'react';
import { useNotices } from '@/hook/useNotices';
import { getSelectedOfficeInfo } from '@/api/map/getSelectedOffice';
import { useBranchStore } from '@/store/branch.store';
import { useRouter } from 'next/router';
import Image from 'next/image';
const OfficeNotice: React.FC = () => {
  const { urgentNoticeTitle, urgentNoticeContent } = useNotices();
  const selectedBranch = useBranchStore((state) => state.selectedBranch);

  const router = useRouter();

  const handleOfficeInfo = async () => {
    try {
      const data = await getSelectedOfficeInfo(selectedBranch!.branchName);
      const officeInfo = data.data;
      console.log(officeInfo);
      router.push(
        {
          pathname: `/branches/${encodeURIComponent(selectedBranch!.branchName)}`,
          query: {
            name: selectedBranch!.branchName,
            urgentNoticeTitle,
            urgentNoticeContent,
            address: officeInfo.branchAddress,
            branchPhoneNumber: officeInfo.branchPhoneNumber,
            roadFromStation: officeInfo.roadFromStation,
            stationToBranch: officeInfo.stationToBranch.join(','),
            branchId: officeInfo.branchId as number,
            scrollToOffice: true
          }
        },
        `/branches/${encodeURIComponent(selectedBranch!.branchName)}`
      );
    } catch (error) {
      console.error('Error fetching office info:', error);
    }
  };

  return (
    <>
      <div
        onClick={handleOfficeInfo}
        className=" cursor-pointer w-full h-12 mt-7 flex items-center gap-[13px] px-[13px] py-[14px] rounded shadow border border-gray-200"
        style={{ backgroundColor: 'rgb(228, 224, 245)' }}>
        <div>
          <Image
            src="/home/notice.svg"
            alt="map"
            width={24}
            height={21}
            className="w-full"
          />
        </div>

        <div className="flex-1 flex items-center gap-[22px] justify-between">
          <div className="text-sm font-normal flex justify-center text-space-purple-darker">
            {urgentNoticeTitle ? urgentNoticeTitle : '긴급 공지가 없습니다.'}
          </div>
          {urgentNoticeContent && (
            <div className="">
              <Image
                src="/home/toNext.svg"
                alt="map"
                width={7}
                height={14}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OfficeNotice;
