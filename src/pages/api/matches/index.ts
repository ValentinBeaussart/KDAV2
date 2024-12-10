import type { APIRoute } from 'astro';
import { createMatch } from '../../../lib/db/matches';
import { addPlayerToMatch } from '../../../lib/db/match-players';

export const POST: APIRoute = async ({ request }) => {
  try {
    const matchData = await request.json();
    
    // Validate required fields
    if (!matchData.date || !matchData.time || !matchData.location || 
        !matchData.opponent_name || !matchData.match_type) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create match
    const match = await createMatch({
      date: matchData.date,
      time: matchData.time,
      location: matchData.location,
      opponent_name: matchData.opponent_name,
      opponent_club_id: matchData.match_type === 'MCDO_POOL' ? matchData.opponent_club_id : null,
      match_type: matchData.match_type,
      competition_round: matchData.competition_round || null,
      is_completed: false
    });

    if (!match) {
      throw new Error('Failed to create match');
    }

    // Add players to match if any were selected
    if (matchData.players?.length > 0) {
      for (const playerId of matchData.players) {
        await addPlayerToMatch({
          match_id: match.id,
          player_id: playerId,
          goals: 0,
          assists: 0
        });
      }
    }
    
    return new Response(JSON.stringify(match), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating match:', error);
    return new Response(JSON.stringify({ 
      error: 'Error creating match',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};