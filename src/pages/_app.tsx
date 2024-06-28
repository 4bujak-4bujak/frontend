import ErrorBoundary from '@/components/shared/ErrorBoundary';
import Layout from '@/components/shared/Layout';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
// import { AuthorizationProvider } from '@/providers/Authentication';
import MockProvider from '@/providers/MockProvider';
import QueryProvider from '@/providers/QueryProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
// import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <Layout>
        <MockProvider>
          <QueryProvider>
            {/* <Script
              strategy="beforeInteractive"
              src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}></Script> */}
            {/* <AuthorizationProvider> */}
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <ErrorBoundary>
                  {loading && <LoadingSpinner />}
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Hydrate>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
            {/* </AuthorizationProvider> */}
          </QueryProvider>
        </MockProvider>
      </Layout>
    </>
  );
}
