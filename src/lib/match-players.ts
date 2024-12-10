import { db } from './db';
import type { MatchPlayer } from './types';

export const addPlayerToMatch = async (matchPlayer: MatchPlayer) => {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO match_players (match_id, player_id, goals, assists)
        VALUES (?, ?, ?, ?)
      `,
      args: [
        matchPlayer.match_id,
        matchPlayer.player_id,
        matchPlayer.goals || 0,
        matchPlayer.assists || 0
      ]
    });
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  } catch (error) {
    console.error('Error adding player to match:', error);
    throw error;
  }
};

// ... autres fonctions de match-players