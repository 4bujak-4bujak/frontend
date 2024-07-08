'use client';
import { userinfo } from '@/api/auth/auth.get.api';
import MainPageIndex from '@/components/home/MainPageIndex';
import Footer from '@/components/layout/footer/Footer';
import MainContainer from '@/components/shared/MainContainer';
import { useMember, useSetMember } from '@/store/user';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
// import { dehydrate, useQuery, QueryClient } from 'react-query';
import PopUpModal from '@/components/home/PopUpModal';
// import { getCookie } from '@utils/cookies';
const Index = () => {
  //
  /* eslint-disable */
  const member = useMember();
  const { data: memberData } = useQuery({ queryKey: ['userinfo'], queryFn: userinfo });
  const setmember = useSetMember();

  const [guideModalOpen, setGuideModalOpen] = useState(false);

  useEffect(() => {
    setmember(memberData?.data);
  }, [memberData, setmember]);

  useEffect(() => {
    const timeClicked = localStorage.getItem('timeClicked');
    if (timeClicked) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - JSON.parse(timeClicked);
      if (timeDifference < 24 * 60 * 60 * 1000) {
        return;
      }
    }
    setGuideModalOpen(true);
  }, []);

  return (
    <MainContainer>
      <MainPageIndex />
      <Footer />
      {guideModalOpen ? <PopUpModal setGuideModalOpen={setGuideModalOpen} /> : null}
    </MainContainer>
  );
};

// export const getServerSideProps = async () => {
//   const token = getCookie('token') as string;

//   const queryClient = new QueryClient(); // 1. 새 QueryClient 인스턴스 만들기

//   await queryClient.prefetchQuery(['userinfo'], userinfo); // 2. 데이터를 prefetch(캐싱)
//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient) // 3. dehydrate한 캐시를 props로 페이지에 넘겨준다.
//     }
//   };
// };

export default Index;
