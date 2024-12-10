import type { Match, Club, MatchPlayer } from '../types';
import { readJsonFile, writeJsonFile } from '../storage';

// Met à jour les stats d'un joueur
export const updatePlayerStats = async (playerId: number, stats: { 
  appearances?: number;
  goals?: number;
  assists?: number;
}) => {
  try {
    const players = await readJsonFile('players.json');
    const playerIndex = players.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) return;

    const player = players[playerIndex];
    
    if (stats.appearances !== undefined) {
      player.appearances = Math.max(0, (player.appearances || 0) + stats.appearances);
    }
    if (stats.goals !== undefined) {
      player.goals = Math.max(0, (player.goals || 0) + stats.goals);
    }
    if (stats.assists !== undefined) {
      player.assists = Math.max(0, (player.assists || 0) + stats.assists);
    }

    players[playerIndex] = player;
    await writeJsonFile('players.json', players);
  } catch (error) {
    console.error('Error updating player stats:', error);
    throw error;
  }
};

// Met à jour les stats d'un club
export const updateClubStats = async (clubId: number, stats: {
  played?: number;
  won?: number;
  drawn?: number;
  lost?: number;
  goals_for?: number;
  goals_against?: number;
  points?: number;
}) => {
  try {
    const clubs = await readJsonFile('clubs.json');
    const clubIndex = clubs.findIndex(c => c.id === clubId);
    
    if (clubIndex === -1) return;

    const club = clubs[clubIndex];
    
    if (stats.played !== undefined) {
      club.played = Math.max(0, (club.played || 0) + stats.played);
    }
    if (stats.won !== undefined) {
      club.won = Math.max(0, (club.won || 0) + stats.won);
    }
    if (stats.drawn !== undefined) {
      club.drawn = Math.max(0, (club.drawn || 0) + stats.drawn);
    }
    if (stats.lost !== undefined) {
      club.lost = Math.max(0, (club.lost || 0) + stats.lost);
    }
    if (stats.goals_for !== undefined) {
      club.goals_for = Math.max(0, (club.goals_for || 0) + stats.goals_for);
    }
    if (stats.goals_against !== undefined) {
      club.goals_against = Math.max(0, (club.goals_against || 0) + stats.goals_against);
    }
    if (stats.points !== undefined) {
      club.points = Math.max(0, (club.points || 0) + stats.points);
    }

    clubs[clubIndex] = club;
    await writeJsonFile('clubs.json', clubs);
  } catch (error) {
    console.error('Error updating club stats:', error);
    throw error;
  }
};

// Met à jour les stats pour un match
export const updateMatchStats = async (match: Match, isCompleting: boolean) => {
  try {
    if (!match.is_completed) return;

    // Only update standings for championship matches
    if (match.match_type === 'MCDO_POOL' && match.home_score !== undefined && match.away_score !== undefined) {
      const multiplier = isCompleting ? 1 : -1;

      // Stats for KDA (always club_id 1)
      const kdaStats = {
        played: 1 * multiplier,
        goals_for: match.home_score * multiplier,
        goals_against: match.away_score * multiplier
      };

      if (match.home_score > match.away_score) {
        kdaStats['won'] = 1 * multiplier;
        kdaStats['points'] = 3 * multiplier;
      } else if (match.home_score < match.away_score) {
        kdaStats['lost'] = 1 * multiplier;
      } else {
        kdaStats['drawn'] = 1 * multiplier;
        kdaStats['points'] = 1 * multiplier;
      }

      await updateClubStats(1, kdaStats);

      // Update opponent stats if available
      if (match.opponent_club_id) {
        const opponentStats = {
          played: 1 * multiplier,
          goals_for: match.away_score * multiplier,
          goals_against: match.home_score * multiplier
        };

        if (match.home_score < match.away_score) {
          opponentStats['won'] = 1 * multiplier;
          opponentStats['points'] = 3 * multiplier;
        } else if (match.home_score > match.away_score) {
          opponentStats['lost'] = 1 * multiplier;
        } else {
          opponentStats['drawn'] = 1 * multiplier;
          opponentStats['points'] = 1 * multiplier;
        }

        await updateClubStats(match.opponent_club_id, opponentStats);
      }
    }
  } catch (error) {
    console.error('Error updating match stats:', error);
    throw error;
  }
};
