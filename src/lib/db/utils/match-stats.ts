import { supabase } from '../connection';
import { getPlayer, updatePlayer } from '../players';
import { getClub, updateClub } from '../clubs';
import type { Match } from '../types';

export async function updateMatchStats(match: Match) {
  if (!match.is_completed) return;

  // Update player stats
  const { data: matchPlayers, error: matchPlayersError } = await supabase
    .from('match_players')
    .select('*')
    .eq('match_id', match.id);

  if (matchPlayersError) throw matchPlayersError;

  for (const mp of matchPlayers) {
    const player = await getPlayer(mp.player_id);
    if (!player) continue;

    await updatePlayer(player.id, {
      appearances: player.appearances + 1,
      goals: player.goals + (mp.goals || 0),
      assists: player.assists + (mp.assists || 0)
    });
  }

  // Update club stats if it's a championship match
  if (match.match_type === 'MCDO_POOL' && match.opponent_club_id) {
    const kda = await getClub(1);
    const opponent = await getClub(match.opponent_club_id);

    if (!kda || !opponent) return;

    // Update KDA stats
    const kdaPoints = match.home_score > match.away_score ? 3 : 
                     match.home_score === match.away_score ? 1 : 0;
    
    await updateClub(1, {
      played: kda.played + 1,
      won: kda.won + (match.home_score > match.away_score ? 1 : 0),
      drawn: kda.drawn + (match.home_score === match.away_score ? 1 : 0),
      lost: kda.lost + (match.home_score < match.away_score ? 1 : 0),
      goals_for: kda.goals_for + match.home_score,
      goals_against: kda.goals_against + match.away_score,
      points: kda.points + kdaPoints
    });

    // Update opponent stats
    const opponentPoints = match.away_score > match.home_score ? 3 :
                          match.away_score === match.home_score ? 1 : 0;

    await updateClub(match.opponent_club_id, {
      played: opponent.played + 1,
      won: opponent.won + (match.away_score > match.home_score ? 1 : 0),
      drawn: opponent.drawn + (match.away_score === match.home_score ? 1 : 0),
      lost: opponent.lost + (match.away_score < match.home_score ? 1 : 0),
      goals_for: opponent.goals_for + match.away_score,
      goals_against: opponent.goals_against + match.home_score,
      points: opponent.points + opponentPoints
    });
  }
}

export async function revertMatchStats(match: Match) {
  if (!match.is_completed) return;

  // Revert player stats
  const { data: matchPlayers, error: matchPlayersError } = await supabase
    .from('match_players')
    .select('*')
    .eq('match_id', match.id);

  if (matchPlayersError) throw matchPlayersError;

  for (const mp of matchPlayers) {
    const player = await getPlayer(mp.player_id);
    if (!player) continue;

    await updatePlayer(player.id, {
      appearances: Math.max(0, player.appearances - 1),
      goals: Math.max(0, player.goals - (mp.goals || 0)),
      assists: Math.max(0, player.assists - (mp.assists || 0))
    });
  }

  // Revert club stats if it's a championship match
  if (match.match_type === 'MCDO_POOL' && match.opponent_club_id) {
    const kda = await getClub(1);
    const opponent = await getClub(match.opponent_club_id);

    if (!kda || !opponent) return;

    // Revert KDA stats
    const kdaPoints = match.home_score > match.away_score ? 3 : 
                     match.home_score === match.away_score ? 1 : 0;
    
    await updateClub(1, {
      played: Math.max(0, kda.played - 1),
      won: Math.max(0, kda.won - (match.home_score > match.away_score ? 1 : 0)),
      drawn: Math.max(0, kda.drawn - (match.home_score === match.away_score ? 1 : 0)),
      lost: Math.max(0, kda.lost - (match.home_score < match.away_score ? 1 : 0)),
      goals_for: Math.max(0, kda.goals_for - match.home_score),
      goals_against: Math.max(0, kda.goals_against - match.away_score),
      points: Math.max(0, kda.points - kdaPoints)
    });

    // Revert opponent stats
    const opponentPoints = match.away_score > match.home_score ? 3 :
                          match.away_score === match.home_score ? 1 : 0;

    await updateClub(match.opponent_club_id, {
      played: Math.max(0, opponent.played - 1),
      won: Math.max(0, opponent.won - (match.away_score > match.home_score ? 1 : 0)),
      drawn: Math.max(0, opponent.drawn - (match.away_score === match.home_score ? 1 : 0)),
      lost: Math.max(0, opponent.lost - (match.away_score < match.home_score ? 1 : 0)),
      goals_for: Math.max(0, opponent.goals_for - match.away_score),
      goals_against: Math.max(0, opponent.goals_against - match.home_score),
      points: Math.max(0, opponent.points - opponentPoints)
    });
  }
}
