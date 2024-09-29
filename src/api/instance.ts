import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

import { getCookie, removeCookie, setCookie } from '@utils/cookies';
import logOnDev from '@utils/logOnDev';
// import jwtDecode from 'jwt-decode';
import { updateRefresh } from './refresh/tokenRefresh.api';

// import { UseRouter } from '@/hook/UseRouter';

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*'
  },
  timeout: 3000
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getCookie('token') as string;
    if (config && config.headers) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (process.env.NODE_ENV === 'development') {
      const { method, url } = config;
      logOnDev(`🚀 [API] ${method?.toUpperCase()} ${url} | Request`);
    }
    return config;
  },
  (error: AxiosError | Error): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError | Error): Promise<any> => {
    if (process.env.NODE_ENV === 'development') {
      if (axios.isAxiosError(error) && error.config) {
        const { message } = error;
        const { method, url } = error.config as InternalAxiosRequestConfig;
        const { status, statusText } = error.response as AxiosResponse;

        logOnDev(
          `🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${statusText} | ${message}`
        );
        // 1. refresh 요청을 보내기 위한 거니까 '/auth/refresh' 요청에서 실패한게 아니어야함
        if ((status == 401 || status == 419) && url !== '/reissue') {
          console.log('error', url);
          try {
            const refreshResponse = await updateRefresh();

            if (
              refreshResponse &&
              typeof refreshResponse.data.data.accessToken === 'string'
            ) {
              const token = refreshResponse.data.data.accessToken;
              setCookie('token', token);
              error.config.headers.Authorization = `Bearer ${token}`;
              console.log(`리프레쉬 로직 작동  ${token}`);
              return instance.request(error.config);
            } else {
              throw new Error('Refresh token is null');
            }
          } catch (refreshError) {
            removeCookie('refreshToken');

            // window.location.href = '/';
            return Promise.reject(refreshError);
          }
        } else {
          logOnDev(`🚨 [API] | Error ${error.message}`);
        }
      }
      return Promise.reject(error);
    }
  }
);
