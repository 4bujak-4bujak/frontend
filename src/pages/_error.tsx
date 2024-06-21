import MainContainer from '@/components/shared/MainContainer';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';

function Error({ statusCode }: { statusCode?: number }) {
  const router = useRouter();
  return (
    <MainContainer>
      <div className="flex items-center justify-center text-3xl font-extrabold">
        {statusCode} 에러가 발생했습니다.
      </div>
      <div
        onClick={() => router.replace('/')}
        className="cursor-pointer mt-16 mx-auto rounded-lg w-[360px] h-12 bg-space-purple text-white text-xl font-semibold flex items-center justify-center">
        홈으로
      </div>
    </MainContainer>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

export default Error;
