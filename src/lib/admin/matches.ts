import type { Match } from '../data/types';
import { matches } from '../data';
import { updatePlayer, getPlayer } from './players';

// In-memory storage for matches
let matchesData = [...matches];
let nextMatchId = Math.max(...matches.map(m => m.id)) + 1;

export const getMatches = () => matchesData;

export const getMatch = (id: number) => 
  matchesData.find(m => m.id === id);

export const createMatch = (match: Omit<Match, 'id'>) => {
  const newMatch = {
    ...match,
    id: nextMatchId++
  };
  matchesData.push(newMatch);
  return newMatch;
};

export const updateMatch = (id: number, match: Partial<Match>) => {
  const index = matchesData.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  const oldMatch = matchesData[index];
  const newMatch = {
    ...oldMatch,
    ...match
  };
  
  // Update player stats if match completion status changes
  if (!oldMatch.is_completed && newMatch.is_completed) {
    // Add appearances and stats for players in this match
    match.players?.forEach(playerId => {
      const player = getPlayer(playerId);
      if (player) {
        updatePlayer(playerId, {
          stats: {
            appearances: player.stats.appearances + 1,
            goals: player.stats.goals + (match.playerStats?.[playerId]?.goals || 0),
            assists: player.stats.assists + (match.playerStats?.[playerId]?.assists || 0)
          }
        });
      }
    });
  } else if (oldMatch.is_completed && !newMatch.is_completed) {
    // Remove appearances and stats for players in this match
    match.players?.forEach(playerId => {
      const player = getPlayer(playerId);
      if (player) {
        updatePlayer(playerId, {
          stats: {
            appearances: Math.max(0, player.stats.appearances - 1),
            goals: Math.max(0, player.stats.goals - (oldMatch.playerStats?.[playerId]?.goals || 0)),
            assists: Math.max(0, player.stats.assists - (oldMatch.playerStats?.[playerId]?.assists || 0))
          }
        });
      }
    });
  }
  
  matchesData[index] = newMatch;
  return newMatch;
};

export const deleteMatch = (id: number) => {
  const index = matchesData.findIndex(m => m.id === id);
  if (index === -1) return false;
  
  const match = matchesData[index];
  if (match.is_completed) {
    // Remove stats for players in this match
    match.players?.forEach(playerId => {
      const player = getPlayer(playerId);
      if (player) {
        updatePlayer(playerId, {
          stats: {
            appearances: Math.max(0, player.stats.appearances - 1),
            goals: Math.max(0, player.stats.goals - (match.playerStats?.[playerId]?.goals || 0)),
            assists: Math.max(0, player.stats.assists - (match.playerStats?.[playerId]?.assists || 0))
          }
        });
      }
    });
  }
  
  matchesData.splice(index, 1);
  return true;
};