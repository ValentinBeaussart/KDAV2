import type { MiddlewareResponseHandler } from 'astro';

export const auth: MiddlewareResponseHandler = async ({ request }, next) => {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/admin')) {
    return next();
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"'
      }
    });
  }

  const [type, credentials] = authHeader.split(' ');
  if (type !== 'Basic') {
    return new Response('Unauthorized', { status: 401 });
  }

  const [username, password] = atob(credentials).split(':');
  if (username !== import.meta.env.ADMIN_USERNAME || 
      password !== import.meta.env.ADMIN_PASSWORD) {
    return new Response('Unauthorized', { status: 401 });
  }

  return next();
};