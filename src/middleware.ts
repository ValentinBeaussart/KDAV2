import { defineMiddleware } from 'astro:middleware';

// Empty middleware - authentication removed
export const onRequest = defineMiddleware(async (context, next) => {
  return next();
});