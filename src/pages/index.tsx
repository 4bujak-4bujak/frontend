'use client';
import { userinfo } from '@/api/auth/auth.get.api';
import MainPageIndex from '@/components/home/MainPageIndex';
import Footer from '@/components/layout/footer/Footer';
import MainContainer from '@/components/shared/MainContainer';
import { useMember, useSetMember } from '@/store/user';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { fcmpost } from '@/api/fcm/fcm.post.api';
import { getTokenHandler } from '@/components/pwa/Fcm';
import PopUpModal from '@/components/home/PopUpModal';
const Index = () => {
  //
  /* eslint-disable */
  const member = useMember();
  const { data: memberData } = useQuery({ queryKey: ['userinfo'], queryFn: userinfo });
  const setmember = useSetMember();
  useEffect(() => {
    setmember(memberData?.data);
  }, [memberData, setmember]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getTokenHandler();
        if (typeof token === 'string') {
          fcmpost({ fcmToken: token });
        }
      } catch (error) {
        console.error('Failed to get FCM token:', error);
      }
    };

    fetchToken();
  }, []);

  return (
    <MainContainer>
      <MainPageIndex />
      <Footer />
      <PopUpModal />
    </MainContainer>
  );
};

export default Index;
