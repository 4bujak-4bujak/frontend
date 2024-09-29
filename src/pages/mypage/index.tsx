/* eslint-disable react/jsx-pascal-case */
import { jobPosition, getTitleFromDescription } from '@/constant/jobPosition';
import { useMember } from '@/store/user';
import Link from 'next/link';
import LogoutModal from '@/components/modal/logoutModal';
import { useCallback, useState } from 'react';
import useLoggedOut from '@/hook/useLoggedOut';
import SuccessModal from '@/components/modal/successModal';
import useUpdateMember from '@/hook/useUpdateMember';
import Footer from '@/components/layout/footer/Footer';
import SEO from '@/components/shared/SEO';

const MyPage = () => {
  const member = useMember();
  const job = getTitleFromDescription(jobPosition, member.memberJob);
  const [isModalVisible, setModalVisible] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const logout = useLoggedOut();
  const handleLogout = useCallback(() => {
    setModalVisible(false);
    setSuccessModal(true);

    setTimeout(() => {
      logout();
    }, 2000);
  }, [logout]);

  useUpdateMember();
  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <SEO title="Offispace | 마이페이지" />
      <div className=" max-w-[393px]  mx-auto relative">
        <Footer />
        <div className="w-full max-w-md flex flex-col items-center justify-center mt-[142px] relative">
          <div className="flex flex-col justify-center items-center">
            <div>
              {member.imageUrl && (
                <img
                  className="w-24 h-24 rounded-full"
                  src={member.imageUrl}
                  alt="Selected Profile Picture"
                />
              )}
              {/* <img src={`${member.imageUrl}`}></img> */}
            </div>
            <div className=" flex flex-col justify-center items-center">
              <div className="h-14 flex flex-col  ">
                <div className="  text-indigo-700 text-lg font-bold mt-[8px] mb-[2px]">
                  {member.memberNickName}
                </div>
                <div className=" flex justify-center text-neutral-400 text-sm font-medium font-['Pretendard'] ">
                  {job}
                </div>
              </div>
              <div className="text-neutral-400 text-sm font-normal font-['Pretendard'] ">
                {member.memberEmail}
              </div>
            </div>
          </div>
          <Link href="/mypage/changeprofile">
            <div>
              <div className=" xs:w-[340px] w-[361px] h-[42px] p-2 rounded-sm border border-zinc-400 flex justify-center items-center gap-2 mt-[32px]">
                <div className="text-black/opacity-20 text-base font-normal font-['Pretendard'] leading-normal">
                  프로필 수정
                </div>
              </div>
            </div>
          </Link>

          <div className="w-[300px] flex justify-between items-center mt-[53.5px]">
            <Link href={'/mypage/guide'}>
              <div className="flex flex-col justify-center items-start">
                <div className="w-[70px] h-[78px] flex flex-col justify-start items-center">
                  <div className="w-[70px] h-[54px] flex justify-center items-center gap-2">
                    <div className="w-[43px] h-[43px] bg-indigo-50 rounded-full relative">
                      <img
                        className="absolute top-1/4 left-[13px]"
                        src="/mypage/Guide.svg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="w-[80px] flex justify-center items-center">
                    <div className="opacity-70 text-black/opacity-20 text-base font-medium font-['Pretendard'] leading-normal">
                      이용가이드
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <img src="/mypage/Vector.svg" alt="" />
            <Link href={'/mypage/notice'}>
              <div className="flex flex-col justify-center items-start">
                <div className="w-[70px] h-[78px] flex flex-col justify-start items-center">
                  <div className="w-[70px] h-[54px] flex justify-center items-center gap-2">
                    <div className="w-[43px] h-[43px] bg-indigo-50 rounded-full relative">
                      <img
                        className="absolute top-1/4 left-1/4"
                        src="/mypage/Notice.svg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="w-[70px] flex justify-center items-center">
                    <div className="opacity-70 text-black/opacity-20 text-base font-medium font-['Pretendard'] leading-normal">
                      공지사항
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <img src="/mypage/Vector.svg" alt="" />
            <Link href={'/mypage/question'}>
              <div className="flex flex-col justify-center items-start">
                <div className="w-[70px] h-[78px] flex flex-col justify-start items-center">
                  <div className="w-[70px] h-[54px] flex justify-center items-center gap-2">
                    <div className="w-[43px] h-[43px] bg-indigo-50 rounded-full relative">
                      <img
                        className="absolute top-1/4 left-1/4"
                        src="/mypage/Inquiry.svg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="w-[70px] flex justify-center items-center">
                    <div className="opacity-70 text-black/opacity-20 text-base font-medium font-['Pretendard'] leading-normal">
                      1:1문의
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="w-full h-[13px] bg-stone-50 mt-[56px] mb-[24px]" />

          <div className="w-[361px] h-[39px] pb-3 flex justify-start items-start gap-3.5">
            <div className="text-center text-neutral-800 text-lg font-semibold font-['Pretendard'] leading-[27px]">
              설정
            </div>
          </div>

          <div
            className="w-[361px] h-9 pb-3 flex justify-start items-center gap-[268px] cursor-pointer"
            onClick={() => {
              Notification.requestPermission().then((permission) => {
                if (permission !== 'granted') {
                  // 푸시 거부됐을 때 처리할 내용
                  console.log('푸시 거부됨');
                } else {
                  // 푸시 승인됐을 때 처리할 내용
                  console.log('푸시 승인됨');
                }
              });
            }}>
            <div className="h-6 flex justify-start items-start gap-3.5">
              <div className="w-[360px] flex justify-between">
                <div className="text-center text-black/opacity-20 text-base font-normal font-['Pretendard'] leading-normal">
                  알림 설정
                </div>
                <img className="mr-[16px]" src="/mypage/RightArrowIcon.svg" alt="" />
              </div>
            </div>
            <div className="w-1.5 h-3 relative" />
          </div>

          <div className="w-full h-[13px] bg-stone-50 mt-[24px] mb-[24px]" />

          <div className="w-[361px] h-[33px] pb-3 flex justify-start items-start gap-4 ">
            <div
              onClick={() => setModalVisible(true)}
              className=" cursor-pointer text-center text-neutral-800 text-sm font-bold font-['Pretendard'] leading-[21px]">
              로그아웃
            </div>
          </div>
          {isModalVisible && (
            <LogoutModal onConfirm={handleLogout} onCancel={handleCancel} />
          )}
          {successModal && <SuccessModal />}
          <Link href={'/mypage/withdraw'}>
            <div className="w-[361px] h-[33px] pb-5 flex justify-start items-start gap-3.5 mb-[80px]">
              <div className="text-center text-neutral-800 text-sm font-bold font-['Pretendard'] leading-[21px]">
                회원탈퇴
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MyPage;
