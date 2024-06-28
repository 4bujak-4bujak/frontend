import MainContainer from '@/components/shared/MainContainer';
import Link from 'next/link';

const ChangepasswordSuccess = () => {
  return (
    <MainContainer>
      <div className="w-full h-[852px] flex flex-col bg-white">
        <div className="flex flex-col items-center ">
          <div className="w-[95.84px] h-[95.84px] bg-violet-100 rounded-full mt-[240px] relative">
            <img
              className="absolute left-[15px] bottom-[30px]"
              src="/mypage/passwordchange/Success.svg"
              alt=""></img>
          </div>
          <div className="text-center text-black text-[22px] font-semibold font-['Pretendard'] leading-[30.80px] mt-8">
            비밀번호 재설정이 <br />
            완료되었습니다.
          </div>
        </div>
        <div className="flex flex-col items-center mb-8 mt-[91px]">
          <div className="w-[361px] h-12 border border-indigo-700 rounded-lg flex justify-center items-center">
            <Link href="/signin">
              <span className="text-indigo-700 text-[15px] font-medium font-['Pretendard']">
                로그인하러 가기
              </span>
            </Link>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default ChangepasswordSuccess;
