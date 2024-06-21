import React from 'react';
import { formatDate, formatTime } from '@/utils/invertFullTime';
import { useModalStore } from '@/store/modal.store';
import { useMutation, useQueryClient } from 'react-query';
import { cancelLike, registerLike } from '../remote/post';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { usePostDetail } from '../factory/postDetailFactory';

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { postData, tag, category, heartImg } = usePostDetail(id);

  const queryClient = useQueryClient();
  const { setOpen, setDeleteId, setCategory } = useModalStore();

  const { mutateAsync: registerLikeMutate } = useMutation(
    (postId: string) => registerLike({ postId }),
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(['post', String(postData.postId)]);
      }
    }
  );

  const { mutateAsync: cancelLikeMutate } = useMutation(
    (postId: string) => cancelLike(postId),
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(['post', String(postData.postId)]);
      }
    }
  );

  if (postData == null) {
    return null;
  }

  return (
    <div className="mt-5 mb-8">
      {/* 태그자리 */}
      <div className="px-2 py-1 text-center bg-gray-100 inline-flex rounded-3xl">
        <span className="text-xs font-medium text-gray-700">{tag}</span>
      </div>

      {/* 사진 닉네임 카테고리 삭제 자리 */}
      {/* 글쓴 유저 자리 */}
      <div className="mt-5 flex items-center gap-[13px]">
        {/* 유저 사진 */}
        <div className="w-[42px] h-[42px]">
          <Image
            src={`${postData.writer.profile}`}
            alt="image"
            priority={true}
            className="rounded-[50%] w-full h-full"
            width={42}
            height={42}
            quality={75}
          />
        </div>

        {/* 유저 닉네임, 직무 */}
        <div className="flex flex-col flex-1">
          {/* 유저 이름 */}
          <div className="flex justify-between">
            <div className="text-sm font-semibold">{postData.writer.nickname}</div>
            {postData.isWriter && (
              <div
                onClick={() => {
                  setOpen(true);
                  setDeleteId(String(postData.postId));
                  setCategory('post');
                }}
                className="text-gray-500 text-sm font-normal underline cursor-pointer">
                삭제
              </div>
            )}
          </div>

          {/* 유저직무 */}
          <div className="text-xs text-gray-400">{category}</div>
        </div>
      </div>

      {/* 제목자리 */}
      <div className="mt-6 text-lg font-bold">{postData.title}</div>

      {/* 컨텐츠 내용자리 */}
      <div className="mt-3">{postData.content}</div>

      {/* 사진자리 */}
      {(postData.images?.length as number) > 0 ? (
        <div className="flex flex-col gap-2 mt-5">
          {postData.images?.map((image: string, i: number) => (
            <div className="w-[360px] h-[280px]" key={i}>
              <Image
                width={360}
                height={280}
                alt="image"
                quality={75}
                src={image}
                priority
                className="object-cover w-full h-full "
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[140px]" />
      )}

      {/* 시간자리 */}
      <div className="flex items-center mt-3 text-gray-500 text-xs font-normal">
        {/* 일자 */}
        <div className="border-r border-neutral-300 pr-2">
          {formatDate(postData.createdDate)}
        </div>
        {/* 시간 */}
        <div className="pl-2">{formatTime(postData.createdDate)}</div>
      </div>

      {/* 좋아요 조회수 자리 */}
      <div className=" mt-7 flex items-center justify-center text-sm text-gray-800 gap-[37px]">
        {/* 좋아요 */}
        <div
          onClick={() => {
            if (postData.isLiked) {
              cancelLikeMutate(postData.postId);
            } else {
              registerLikeMutate(postData.postId);
            }
          }}
          className="flex items-center justify-center gap-1 cursor-pointer">
          <img src={heartImg} alt="" />

          <div className="flex items-center justify-center gap-1">
            <div>좋아요</div>
            <div>{postData.likeCount}</div>
          </div>
        </div>

        {/* 구분선 */}
        <img src="/community/devider.svg" alt="" />

        {/* 조회수 */}
        <div className="flex items-center justify-center gap-1">
          <img src="/community/viewCount.svg" alt="" />
          <div className="flex items-center justify-center gap-1">
            <div>조회수</div>
            <div>{postData.viewCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
