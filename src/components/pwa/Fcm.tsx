import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

const app = initializeApp(firebaseConfig);

export const clickPushHandler = () => {
  Notification.requestPermission().then((permission) => {
    if (permission !== 'granted') {
      console.log('푸시 거부됨');
    } else {
      console.log('푸시 승인됨');
    }
  });
};

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY;

export const getTokenHandler = async () => {
  const messaging = getMessaging(app);
  return await getToken(messaging, {
    vapidKey: VAPID_KEY
  })
    .then(async (currentToken) => {
      if (!currentToken) {
        console.error('토큰 생성 불가');
      } else {
        return currentToken;
      }
    })
    .catch((error) => {
      console.error('token error', error);
    });
};
