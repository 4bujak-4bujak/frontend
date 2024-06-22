import { http, HttpResponse } from 'msw';

export const mainErrorHandlers = [
  http.get(`https://joo-api.store/branches/27/available-count`, () => {
    return new HttpResponse('Not found', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  })
];
