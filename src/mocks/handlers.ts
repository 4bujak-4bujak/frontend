import { authHandlers } from './authHandler';
import { questionHandlers } from './questionHandler';
import { notificationHandler } from './notificationHandler';
import { postHandlers } from './postHandler';
import { mainErrorHandlers } from './mainPageHandler';

export const handlers = [
  ...authHandlers,
  ...questionHandlers,
  ...notificationHandler,
  ...postHandlers,
  ...mainErrorHandlers
];
