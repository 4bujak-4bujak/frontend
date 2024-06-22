import { http, HttpResponse } from 'msw';

export const postHandlers = [
  /* ----- 글 상세 데이터 가져오기 api ----- */
  http.get(`https://joo-api.store/posts/25`, () => {
    return HttpResponse.json('Not found', {
      status: 404
    });
  })
];
