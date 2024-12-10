import type { MatchPlayer } from './types';
import { readJsonFile, writeJsonFile } from './storage';
import { updatePlayerStats } from './utils/stats';

export const getMatchPlayers = async (matchId: number): Promise<MatchPlayer[]> => {
  const matchPlayers = await readJsonFile('match_players.json');
  return matchPlayers.filter(mp => mp.match_id === matchId);
};

export const addPlayerToMatch = async (matchPlayer: MatchPlayer): Promise<void> => {
  const matchPlayers = await readJsonFile('match_players.json');
  matchPlayers.push(matchPlayer);
  await writeJsonFile('match_players.json', matchPlayers);
};

export const updateMatchPlayers = async (matchId: number, newPlayers: MatchPlayer[]): Promise<void> => {
  try {
    const matchPlayers = await readJsonFile('match_players.json');
    const oldPlayers = matchPlayers.filter(mp => mp.match_id === matchId);
    
    // First, revert stats for old players if they exist
    for (const oldPlayer of oldPlayers) {
      await updatePlayerStats(oldPlayer.player_id, {
        appearances: -1,
        goals: -(oldPlayer.goals || 0),
        assists: -(oldPlayer.assists || 0)
      });
    }
    
    // Remove old players from the match
    const filteredPlayers = matchPlayers.filter(mp => mp.match_id !== matchId);
    
    // Add new players and update their stats
    for (const newPlayer of newPlayers) {
      await updatePlayerStats(newPlayer.player_id, {
        appearances: 1,
        goals: newPlayer.goals || 0,
        assists: newPlayer.assists || 0
      });
    }
    
    // Save updated match players
    await writeJsonFile('match_players.json', [...filteredPlayers, ...newPlayers]);
  } catch (error) {
    console.error('Error updating match players:', error);
    throw error;
  }
};

export const removePlayerFromMatch = async (matchId: number, playerId: number): Promise<void> => {
  const matchPlayers = await readJsonFile('match_players.json');
  const playerMatch = matchPlayers.find(mp => mp.match_id === matchId && mp.player_id === playerId);
  
  if (playerMatch) {
    // Revert player stats
    await updatePlayerStats(playerId, {
      appearances: -1,
      goals: -(playerMatch.goals || 0),
      assists: -(playerMatch.assists || 0)
    });
    
    // Remove player from match
    const filteredPlayers = matchPlayers.filter(mp => !(mp.match_id === matchId && mp.player_id === playerId));
    await writeJsonFile('match_players.json', filteredPlayers);
  }
};
