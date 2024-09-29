import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useMember } from '@/store/user';
import { getTitleFromDescription, jobPosition } from '@/constant/jobPosition';
import { memberimage } from '@/api/auth/auth.patch.api';
import useUpdateMember from '@/hook/useUpdateMember';
import { BackArrow } from '@/components/sign/backarrow/BackArrow';
import SEO from '@/components/shared/SEO';

export default function Profile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  /* eslint-disable */
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const member = useMember();
  const job = useMemo(
    () => getTitleFromDescription(jobPosition, member.memberJob),
    [member.memberJob]
  );

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      memberimage(formData);

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target && e.target.result) {
          setFileUrl(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
    alert('프로필 사진이 변경되었습니다.');
    window.location.reload();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
  };
  useUpdateMember();

  return (
    <>
      <SEO title="Offispace | 프로필 수정" />
      <div className="w-full  flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-6 rounded-lg ">
          <BackArrow width="40px" height="24px" name="프로필 수정" />
          <div className="flex flex-col items-center mb-[12px] mt-[22px]">
            <div className="w-[100px] relative">
              <label className=" cursor-pointer" htmlFor="fileInput">
                <img className="w-24 h-24 rounded-full" src={member.imageUrl} />

                <label className="w-7 h-7 absolute bottom-0 right-0 bg-neutral-400 rounded-full border border-white cursor-pointer flex items-center justify-center">
                  <img
                    className="w-4 h-4"
                    src="/mypage/profilechange/Camera.svg"
                    alt="Edit Icon"
                  />
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-neutral-600 text-base font-semibold mb-2">
                이름
              </label>
              <div className="w-full h-12 px-4 py-2 bg-stone-50 rounded-lg border border-neutral-300 flex items-center">
                <span className="text-neutral-400 text-sm">{member.memberName}</span>
              </div>
            </div>
            {/* Email Field */}
            <div>
              <label className="block text-neutral-600 text-base font-semibold mb-2">
                이메일
              </label>
              <div className="w-full h-12 px-4 py-2 bg-stone-50 rounded-lg border border-neutral-300 flex items-center">
                <span className="text-neutral-400 text-sm">{member.memberEmail}</span>
              </div>
            </div>
            {/* Password Field */}
            <div>
              <label className=" text-neutral-600 text-base font-semibold mb-2 flex items-center">
                비밀번호
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full ml-1"></span>
              </label>
              <Link href="/mypage/changepassword">
                <div className="w-full h-12 p-2 rounded-lg border border-indigo-700 flex items-center justify-center cursor-pointer">
                  <span className="text-indigo-700 text-sm">비밀번호 변경하기</span>
                </div>
              </Link>
            </div>
            {/* Job Field */}
            <div>
              <label className="block text-neutral-600 text-base font-semibold mb-2">
                직무
              </label>
              <div className="w-full h-12 px-4 py-2 bg-stone-50 rounded-lg border border-neutral-300 flex items-center">
                <span className="text-neutral-400 text-sm">{job}</span>
              </div>
            </div>
            {/* Contact Field */}
            <div>
              <label className="block text-neutral-600 text-base font-semibold mb-2">
                연락처
              </label>
              <div className="w-full h-12 px-4 py-2 bg-stone-50 rounded-lg border border-neutral-300 flex items-center">
                <span className="text-neutral-400 text-sm">{member.memberPhone}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
