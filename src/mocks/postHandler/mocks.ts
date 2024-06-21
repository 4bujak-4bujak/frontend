/* ----- 글 상세 MOCK DATA ----- */
export const MOCK_POSTDETAIL_DATA = {
  status: 'SUCCESS',
  errorCode: null,
  data: {
    postId: 39,
    category: 'FREE_BOARD',
    tag: 'BRAG',
    title: '이것은 모킹된 데이터여',
    content: '모킹이 잘 됐나?',
    createdDate: '2024-06-12T23:01:05',
    viewCount: 12,
    likeCount: 4,
    commentCount: 2,
    images: [
      'https://sabujak-image-bucket.s3.ap-northeast-2.amazonaws.com/bc1e70ab-dIMG_2661.jpeg'
    ],
    writer: {
      profile:
        'https://sabujak-image-bucket.s3.ap-northeast-2.amazonaws.com/8968ebd6-bIMG_8418.jpeg',
      job: 'ITDEV',
      nickname: '웃고있는 감자칩'
    },
    isWriter: false,
    isLiked: false
  },
  message: null
};
