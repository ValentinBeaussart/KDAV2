import type { APIRoute } from 'astro';
import { createNewsArticle } from '../../../lib/db/news';

export const POST: APIRoute = async ({ request }) => {
  try {
    const article = await request.json();
    
    // Validate required fields
    if (!article.title || !article.summary || !article.content) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await createNewsArticle(article);
    
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return new Response(JSON.stringify({ 
      error: 'Error creating article',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};