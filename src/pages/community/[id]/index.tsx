/* eslint-disable react/jsx-pascal-case */
import PostDetailIndex from '@/components/community/PostDetailIndex';
import MainContainer from '@/components/shared/MainContainer';
import SEO from '@/components/shared/SEO';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { QueryClient, dehydrate } from 'react-query';

const CommunityDetailPage = () => {
  return (
    <>
      <SEO title="Offispace | 커뮤니티" />
      <MainContainer>
        <PostDetailIndex />
      </MainContainer>
    </>
  );
};

export default CommunityDetailPage;

// eslint-disable-next-line react-refresh/only-export-components
export async function getStaticSideProps(context: GetServerSidePropsContext) {
  const { query, req } = context;
  const { cookie } = req.headers;
  const postId = query.id as string;
  const token = cookie ? cookie.split('=')[1] : '';

  if (token !== '') {
    const client = new QueryClient();
    try {
      await client.prefetchQuery(['post', postId], async () => {
        const { data } = await axios.get(`https://www.4bujak.site/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return data.data;
      });
      return {
        props: {
          dehydratedState: JSON.parse(JSON.stringify(dehydrate(client)))
        }
      };
    } catch (error) {
      return {
        props: {
          error: 'Failed to fetch post data'
        }
      };
    }
  }

  return {
    props: {}
  };
}
