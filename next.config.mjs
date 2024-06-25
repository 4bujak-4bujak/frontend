/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sign',
        permanent: true // true로 설정하면 308 리다이렉션, false로 설정하면 307 리다이렉션
      }
    ];
  },

  images: {
    domains: [
      'bzbz-file-bucket.s3.ap-northeast-2.amazonaws.com',
      'userimage.bucket.s3.ap-northeast-2.amazonaws.com',
      'sabujak-image-bucket.s3.ap-northeast-2.amazonaws.com',
      '*'
    ],
    formats: ['image/avif', 'image/webp']
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      if (Array.isArray(config.resolve.alias))
        config.resolve.alias.push({ name: 'msw/browser', alias: false });
      else config.resolve.alias['msw/browser'] = false;
    } else {
      if (Array.isArray(config.resolve.alias))
        config.resolve.alias.push({ name: 'msw/node', alias: false });
      else config.resolve.alias['msw/node'] = false;
    }
    return config;
  },
  pwa: withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true
  })
};

export default nextConfig;
