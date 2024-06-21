import { useQuery } from 'react-query';
import { useEnumToTag } from '../hooks/useEnumToTag';
import { useEnumToCategory } from '../hooks/useEnumToCategory';
import { getPostDetail } from '../remote/post';

export const usePostDetail = (postId: string) => {
  const { data: postData, ...queryProps } = useQuery(
    ['post', postId],
    () => getPostDetail(postId),
    {
      enabled: postId != null
    }
  );

  const tag = useEnumToTag(postData?.tag);
  const category = useEnumToCategory(postData?.category);
  const heartImg = postData?.isLiked
    ? '/community/colorHeart.svg'
    : '/community/heart.svg';

  return {
    postData,
    tag,
    category,
    heartImg,
    ...queryProps
  };
};
