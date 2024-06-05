import { http, HttpResponse } from 'msw';

import {
  MOCK_COMMUNITY_NOTIFICATION_DATA,
  MOCK_RESOULVATION_NOTIFICATION_DATA
} from './mocks';

export const notificationHandler = [
  /* ----- 예약 알림 전송 api ----- */
  http.get(`/notification/resoulvation`, () => {
    return HttpResponse.json(MOCK_RESOULVATION_NOTIFICATION_DATA);
  }),

  /* ----- 커뮤니티 알림 내역 api ----- */
  http.get(`/notification/community`, () => {
    return HttpResponse.json(MOCK_COMMUNITY_NOTIFICATION_DATA);
  })
];
