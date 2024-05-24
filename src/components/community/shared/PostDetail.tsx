import React from 'react';
import { formatDate, formatTime } from '@/utils/invertFullTime';
import { useModalStore } from '@/store/modal.store';
import { PostDetailDataType } from '../model/postDetailType';
import { useMutation, useQueryClient } from 'react-query';
import { cancelLike, registerLike } from '../remote/post';

interface PostDetailType {
  postData: PostDetailDataType;
}

const PostDetail = ({ postData }: PostDetailType) => {
  const queryClient = useQueryClient();
  const { setOpen, setDeleteId, setCategory } = useModalStore();

  const { mutateAsync: registerLikeMutate } = useMutation(
    (postId: string) => registerLike(postId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', postData.postId]);
      }
    }
  );

  const { mutateAsync: cancelLikeMutate } = useMutation(
    (postId: string) => cancelLike(postId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', postData.postId]);
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
        <span className="text-xs font-medium text-gray-700">{postData.tag}</span>
      </div>

      {/* 사진 닉네임 카테고리 삭제 자리 */}
      {/* 글쓴 유저 자리 */}
      <div className="mt-5 flex items-center gap-[13px]">
        {/* 유저 사진 */}
        <div className="w-[42px] h-[42px]">
          <img
            src={`${postData.writer.profileImage}`}
            alt=""
            className="rounded-[50%] w-full h-full"
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
                  setDeleteId(postData.postId);
                  setCategory('post');
                }}
                className="text-gray-500 text-sm font-normal underline cursor-pointer">
                삭제
              </div>
            )}
          </div>

          {/* 유저직무 */}
          <div className="text-xs text-gray-400">{postData.category}</div>
        </div>
      </div>

      {/* 제목자리 */}
      <div className="mt-6 text-lg font-bold">{postData.title}</div>

      {/* 컨텐츠 내용자리 */}
      <div className="mt-3">{postData.content}</div>

      {/* 사진자리 */}
      {(postData.postImage?.length as number) > 0 && (
        <div className="flex flex-col gap-2 mt-5">
          {postData.postImage?.map((image, i) => (
            <div className="w-[360px] h-[280px]" key={i}>
              <img src={image} className="object-cover w-full h-full " />
            </div>
          ))}
        </div>
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
        {/* todo : 내가 좋아요 누른 글인지 분기처리, 좋아요눌렀으면 다시 누를때 취소, 안눌렀으면 좋아요 처리 */}
        <div
          onClick={() => {
            if (postData.isLiked) {
              cancelLikeMutate(postData.postId);
              console.log('실행1');
            } else {
              registerLikeMutate(postData.postId);
              console.log('실행1');
            }
          }}
          className="flex items-center justify-center gap-1 cursor-pointer">
          {postData.isLiked ? (
            <img src="/community/colorHeart.svg" alt="" />
          ) : (
            <img src="/community/heart.svg" alt="" />
          )}

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
