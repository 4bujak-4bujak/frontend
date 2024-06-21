import { authHandlers } from './authHandler';
import { questionHandlers } from './questionHandler';
import { notificationHandler } from './notificationHandler';
import { postHandlers } from './postHandler';

export const handlers = [
  ...authHandlers,
  ...questionHandlers,
  ...notificationHandler,
  ...postHandlers
];
