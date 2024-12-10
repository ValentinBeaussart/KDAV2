import type { APIRoute } from 'astro';
import { deleteMatch, updateMatch, getMatch } from '../../../lib/db/matches';
import { updateMatchPlayers } from '../../../lib/db/match-players';
import { updateStandings, updatePlayerStats, revertStandings } from '../../../lib/db/utils/match';
import type { MatchPlayer } from '../../../lib/db/types';

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const id = parseInt(params.id!);
    const currentMatch = await getMatch(id);
    
    if (!currentMatch) {
      return new Response(JSON.stringify({ error: 'Match not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const matchData = await request.json();

    // If match is being completed or uncompleted, handle standings
    if (currentMatch.is_completed !== matchData.is_completed) {
      if (matchData.is_completed) {
        await updateStandings({
          ...currentMatch,
          ...matchData,
          is_completed: true
        });
      } else {
        await revertStandings(currentMatch);
      }
    }

    // Update match
    const updatedMatch = await updateMatch(id, {
      date: matchData.date,
      time: matchData.time,
      location: matchData.location,
      opponent_name: matchData.opponent_name,
      opponent_club_id: matchData.match_type === 'MCDO_POOL' ? matchData.opponent_club_id : null,
      opponent_logo: matchData.opponent_logo,
      home_score: matchData.home_score,
      away_score: matchData.away_score,
      is_completed: matchData.is_completed,
      match_type: matchData.match_type,
      competition_round: matchData.competition_round,
      lineup_image: matchData.lineup_image
    });

    // Update match players if provided
    if (matchData.players) {
      const matchPlayers: MatchPlayer[] = matchData.players.map(player => ({
        match_id: id,
        player_id: player.player_id,
        goals: player.goals || 0,
        assists: player.assists || 0
      }));

      await updateMatchPlayers(id, matchPlayers);

      // Update player stats if match is completed
      if (matchData.is_completed && !currentMatch.is_completed) {
        await updatePlayerStats(id, matchData.players);
      }
    }

    return new Response(JSON.stringify(updatedMatch), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating match:', error);
    return new Response(JSON.stringify({ 
      error: 'Error updating match',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = parseInt(params.id!);
    const match = await getMatch(id);
    
    if (!match) {
      return new Response(JSON.stringify({ error: 'Match not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If match was completed, revert standings
    if (match.is_completed) {
      await revertStandings(match);
    }

    const result = await deleteMatch(id);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting match:', error);
    return new Response(JSON.stringify({ 
      error: 'Error deleting match',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
