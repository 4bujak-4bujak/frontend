import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <Script
          strategy="beforeInteractive"
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}></Script>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon16.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="root-portal"></div>
      </body>
    </Html>
  );
}
