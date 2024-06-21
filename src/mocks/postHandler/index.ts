import { http, HttpResponse } from 'msw';
import { MOCK_POSTDETAIL_DATA } from './mocks';

export const postHandlers = [
  /* ----- 글 상세 데이터 가져오기 api ----- */
  http.get(`https://joo-api.store/posts/39`, () => {
    return HttpResponse.json(MOCK_POSTDETAIL_DATA);
  })
];
