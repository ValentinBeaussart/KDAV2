import type { APIRoute } from 'astro';
import { createPlayer } from '../../../lib/db/players';

export const POST: APIRoute = async ({ request }) => {
  try {
    const player = await request.json();
    
    // Validate required fields
    if (!player.name || !player.number || !player.position) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await createPlayer({
      name: player.name,
      number: player.number,
      position: player.position,
      photo: player.photo || '/player.webp',
      appearances: 0,
      goals: 0,
      assists: 0
    });
    
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating player:', error);
    return new Response(JSON.stringify({ 
      error: 'Error creating player',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};