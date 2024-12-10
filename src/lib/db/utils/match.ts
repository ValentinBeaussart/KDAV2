import { supabase } from '../connection';
import type { Match, Club } from '../types';
import { getClub, updateClub } from '../clubs';
import { getPlayer, updatePlayer } from '../players';

export async function updateStandings(match: Match) {
  if (match.match_type !== 'MCDO_POOL' || !match.is_completed) {
    return;
  }

  // Get KDA club
  const kda = await getClub(1);
  if (!kda) throw new Error('KDA club not found');

  // Get opponent club
  if (!match.opponent_club_id) throw new Error('Opponent club not found');
  const opponent = await getClub(match.opponent_club_id);
  if (!opponent) throw new Error('Opponent club not found');

  // Update KDA stats
  const kdaStats = calculateClubStats(kda, match.home_score!, match.away_score!, true);
  await updateClub(1, kdaStats);

  // Update opponent stats
  const opponentStats = calculateClubStats(opponent, match.away_score!, match.home_score!, false);
  await updateClub(match.opponent_club_id, opponentStats);
}

function calculateClubStats(
  club: Club, 
  goalsFor: number, 
  goalsAgainst: number, 
  isHome: boolean
) {
  const won = goalsFor > goalsAgainst ? 1 : 0;
  const drawn = goalsFor === goalsAgainst ? 1 : 0;
  const lost = goalsFor < goalsAgainst ? 1 : 0;

  return {
    played: club.played + 1,
    won: club.won + won,
    drawn: club.drawn + drawn,
    lost: club.lost + lost,
    goals_for: club.goals_for + goalsFor,
    goals_against: club.goals_against + goalsAgainst,
    points: club.points + (won * 3 + drawn)
  };
}

export async function updatePlayerStats(
  matchId: number, 
  players: Array<{ player_id: number; goals: number; assists: number; }>
) {
  for (const playerStats of players) {
    const player = await getPlayer(playerStats.player_id);
    if (!player) continue;

    await updatePlayer(player.id, {
      appearances: player.appearances + 1,
      goals: player.goals + playerStats.goals,
      assists: player.assists + playerStats.assists
    });
  }
}

export async function revertStandings(match: Match) {
  if (match.match_type !== 'MCDO_POOL' || !match.is_completed) {
    return;
  }

  // Get KDA club
  const kda = await getClub(1);
  if (!kda) throw new Error('KDA club not found');

  // Get opponent club
  if (!match.opponent_club_id) throw new Error('Opponent club not found');
  const opponent = await getClub(match.opponent_club_id);
  if (!opponent) throw new Error('Opponent club not found');

  // Revert KDA stats
  const kdaStats = revertClubStats(kda, match.home_score!, match.away_score!, true);
  await updateClub(1, kdaStats);

  // Revert opponent stats
  const opponentStats = revertClubStats(opponent, match.away_score!, match.home_score!, false);
  await updateClub(match.opponent_club_id, opponentStats);
}

function revertClubStats(
  club: Club, 
  goalsFor: number, 
  goalsAgainst: number, 
  isHome: boolean
) {
  const won = goalsFor > goalsAgainst ? 1 : 0;
  const drawn = goalsFor === goalsAgainst ? 1 : 0;
  const lost = goalsFor < goalsAgainst ? 1 : 0;

  return {
    played: club.played - 1,
    won: club.won - won,
    drawn: club.drawn - drawn,
    lost: club.lost - lost,
    goals_for: club.goals_for - goalsFor,
    goals_against: club.goals_against - goalsAgainst,
    points: club.points - (won * 3 + drawn)
  };
}
