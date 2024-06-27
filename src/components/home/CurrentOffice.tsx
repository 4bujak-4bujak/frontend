/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import SelectOfficeMap from './SelectOfficeMap';
import { Branch } from '@/api/types/branch';
import { useBranchStore } from '@/store/branch.store';
import { useIsCurrentBranch } from '@/store/isCurrentBranch.store';
import Image from 'next/image';
const CurrentOffice = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSelectOfficeMap, setShowSelectOfficeMap] = useState(false);
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  const setSelectedBranch = useBranchStore((state) => state.setSelectedBranch);
  const [isHydrated, setIsHydrated] = useState(false);
  const { isCurrent } = useIsCurrentBranch();

  const initialBranch: Branch = {
    branchId: 27,
    branchName: '강남1호점',
    branchAddress: '서울 강남구 강남대로 382 메리츠타워 17, 18층 (메인라운지 17층)',
    branchLatitude: 37.4971261,
    branchLongitude: 127.0287132
  };

  useEffect(() => {
    setIsHydrated(true);

    if (!selectedBranch) {
      setSelectedBranch(initialBranch, Date.now());
    }
  }, [selectedBranch, setSelectedBranch]);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch, Date.now());
    setShowSearchModal(false);
    setShowSelectOfficeMap(true);
  };

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  const handleCloseSelectOfficeMap = () => {
    setShowSelectOfficeMap(false);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-[10px] mt-6 relative">
        <div className="text-white text-lg font-extralight">지금 이용중인 곳은</div>
        <div className="flex items-center justify-center gap-1">
          <div>
            <Image
              src="/home/location.svg"
              alt="map"
              width={11}
              height={15}
              className="w-full"
            />
          </div>
          <div
            className="text-white text-lg underline font-medium cursor-pointer"
            onClick={handleSearchClick}>
            {selectedBranch?.branchName}
          </div>
        </div>

        {!isCurrent ? (
          <div className="absolute z-50 top-6 right-20">
            <div className="ml-[22px] opacity-95 ">
              <Image
                src="/home/triangle.svg"
                alt="map"
                width={11}
                height={15}
                className="w-full"
              />
            </div>
            <div className="border-t border-space-purple-dark-active p-2 opacity-95 bg-space-purple-dark-active rounded text-white text-sm font-normal">
              이 지점이 맞나요?
            </div>
          </div>
        ) : null}
      </div>
      {showSearchModal && (
        <SearchModal
          onClose={() => setShowSearchModal(false)}
          onBranchSelect={handleBranchSelect}
        />
      )}
      {showSelectOfficeMap && selectedBranch && (
        <SelectOfficeMap branch={selectedBranch} onClose={handleCloseSelectOfficeMap} />
      )}
    </>
  );
};

export default CurrentOffice;
