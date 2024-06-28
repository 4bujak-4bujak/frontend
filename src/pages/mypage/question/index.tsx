/* eslint-disable react/jsx-pascal-case */
import { questioninfo, registerquestion } from '@/api/question/question.api';
import { Branch } from '@/api/types/branch';
import { BackArrow } from '@/components/sign/backarrow/BackArrow';
import SearchModal from '@/components/home/SearchModal';
import { useQuestionBranchStore } from '@/store/questionBranch.store';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import SEO from '@/components/shared/SEO';

const InquiryForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isButtonActive = title && content;
  const [showSearchModal, setShowSearchModal] = useState(false);
  const branch = useQuestionBranchStore((state) => state.selectedQuestionBranch);
  const branchName = branch?.branchName;

  const setSelectedQuestionBranch = useQuestionBranchStore(
    (state) => state.setSelectedQuestionBranch
  );
  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  const handleBranchSelect = (branch: Branch) => {
    setSelectedQuestionBranch(branch, Date.now());
    setShowSearchModal(false);
  };

  const handleSubmit = () => {
    if (isButtonActive) {
      try {
        registerquestion({ title, content, branchName });
        setTitle('');
        setContent('');
        alert('문의등록이 완료되었습니다!');
        window.location.reload();
      } catch {
        alert('문의등록에 실패했습니다.');
      }
    }
  };

  return (
    <div className="w-full overflow-y-auto h-full max-w-md mx-auto p-4">
      <div
        className="w-[180px] flex flex-row items-center mb-4 cursor-pointer"
        onClick={handleSearchClick}>
        <img className=" w-5 h-5" src="/mypage/inquiry/Map.svg" alt="map" />
        {/* api */}
        <div className="text-black text-base font-medium">
          {branch ? branch.branchName : '지점을 설정해주세요'}
        </div>
      </div>
      <div className="border-b border-neutral-200 py-4">
        <div className="text-lg font-bold text-black">제목</div>
        <input
          className="w-full  mt-2 text-neutral-400 text-base font-medium focus:outline-none"
          type="text"
          placeholder="제목을 입력하세요. (최대 20자)"
          maxLength={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="py-4">
        <div className="text-lg font-bold text-black">내용</div>
        <textarea
          className="w-full mt-2 h-[400px] text-neutral-400 text-base font-medium focus:outline-none"
          placeholder="내용을 입력해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <button
          className={`w-full py-3 rounded-lg text-base font-medium ${isButtonActive ? 'bg-indigo-700 text-white' : 'border border-neutral-300 text-zinc-400'}`}
          onClick={handleSubmit}>
          등록
        </button>
      </div>
      {showSearchModal && (
        <SearchModal
          onClose={() => setShowSearchModal(false)}
          onBranchSelect={handleBranchSelect}
        />
      )}
    </div>
  );
};

const InquiryHistory = () => {
  const [openInquiry, setOpenInquiry] = useState<number | null>(null);
  const toggleInquiry = (index: number): void => {
    setOpenInquiry(openInquiry === index ? null : index);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['questioninfo'],
    queryFn: questioninfo
  });
  const inquiriesData = data?.data.privatePostList;

  return (
    <div className="w-full h-[800px] max-w-md mx-auto p-4 overflow-y-auto">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        inquiriesData?.length === 0 && (
          <div className=" w-full h-[400px] flex flex-col justify-center items-center">
            <img className="mb-[16px]" src="/mypage/inquiry/Warning.svg" alt="" />
            <div className="text-neutral-400 text-base font-normal font-['Pretendard'] leading-snug">
              문의 내역이 없습니다.
            </div>
          </div>
        )
      )}

      {inquiriesData?.map(
        (
          data: {
            title: string;
            content: string;
            createdDate: string;
            answer: { content: string };
          },
          index: number
        ) => {
          // const openAnswer = inquiriesData.length - index;
          return (
            <div
              key={index}
              className="border-b border-neutral-300 py-4 cursor-pointer"
              onClick={() => toggleInquiry(index)}>
              <div className="flex justify-between items-center">
                <div className="text-base font-medium text-black">{data.title}</div>
                <img
                  className="w-2.5 h-5"
                  src={
                    openInquiry === index
                      ? '/mypage/notice/UpArrow.svg'
                      : '/mypage/notice/DownArrow.svg'
                  }
                  alt="arrow"
                />
              </div>
              <div className="text-sm font-normal text-neutral-400 mt-2">
                {data.createdDate}
              </div>
              {openInquiry === index && (
                <div>
                  <div className="flex flex-row justify-between">
                    <div className="w-auto" />
                    <div className="w-auto h-auto min-h-[45px] max-w-[250px] pl-5 pr-4 py-3 bg-violet-50 rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] justify-center items-center gap-2 inline-flex">
                      <div className="text-right text-neutral-700 text-sm font-normal font-['Pretendard'] leading-[21px] tracking-tight">
                        {data.content}
                      </div>
                    </div>
                  </div>
                  {data.answer && (
                    <div className="flex flex-row justify-between">
                      <div className="w-auto h-auto min-h-[45px] max-w-[250px] pl-5 pr-4 py-3 bg-violet-50 rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] justify-center items-center gap-2 inline-flex">
                        <div className="text-right text-neutral-700 text-sm font-normal font-['Pretendard'] leading-[21px] tracking-tight">
                          {data.answer.content}
                        </div>
                        <div className="w-auto" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }
      )}
    </div>
  );
};

const InquiryPage = () => {
  const [view, setView] = useState('inquiry');
  // const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // const handleInquirySubmit = (inquiry: Inquiry) => {
  //   setInquiries([...inquiries, inquiry]);
  // };

  return (
    <>
      <SEO title="Offispace | 1:1 문의" />
      <div className=" max-w-[393px] h-[890px]  mx-auto relative  overflow-hidden">
        <div className="mt-[20px] ml-[10px] ">
          <BackArrow width="40px" height="24px" name="1:1 문의" />
        </div>
        <div className="w-full h-[900px] bg-white flex flex-col justify-between items-center">
          <div className="w-full flex justify-center items-center border-b border-neutral-200 mt-[13px]">
            <button
              className={`px-6 py-2 ${view === 'inquiry' ? 'border-b-2 border-indigo-700 text-indigo-700 font-bold' : 'text-neutral-700 font-normal'}`}
              onClick={() => setView('inquiry')}>
              문의하기
            </button>
            <button
              className={`px-6 py-2 ${view === 'history' ? 'border-b-2 border-indigo-700 text-indigo-700 font-bold' : 'text-neutral-700 font-normal'}`}
              onClick={() => setView('history')}>
              문의내역
            </button>
          </div>

          <div className="w-full flex-1 overflow-y-auto">
            {view === 'inquiry' ? <InquiryForm /> : <InquiryHistory />}
          </div>
        </div>
      </div>
    </>
  );
};

export default InquiryPage;
