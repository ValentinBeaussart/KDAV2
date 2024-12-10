import type { APIRoute } from 'astro';
import { createClub } from '../../../lib/db/clubs';

export const POST: APIRoute = async ({ request }) => {
  try {
    const club = await request.json();
    
    // Validate required fields
    if (!club.name) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await createClub({
      name: club.name,
      logo: club.logo,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
      points: 0,
      is_mcdo_pool: club.is_mcdo_pool
    });
    
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating club:', error);
    return new Response(JSON.stringify({ 
      error: 'Error creating club',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};