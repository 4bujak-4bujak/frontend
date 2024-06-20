'use client';
import { userinfo } from '@/api/auth/auth.get.api';
import MainPageIndex from '@/components/home/MainPageIndex';
import Footer from '@/components/layout/footer/Footer';
import MainContainer from '@/components/shared/MainContainer';
import { useMember, useSetMember } from '@/store/user';
import React, { useEffect, useState } from 'react';
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

  const [guideModalOpen, setGuideModalOpen] = useState(false);

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

export default Index;
