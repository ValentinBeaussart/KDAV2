import { db } from './db';
import type { Match } from './types';

export const createMatch = async (match: Match) => {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO matches (
          date, time, location, opponent_name, opponent_logo,
          home_score, away_score, is_completed
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        match.date,
        match.time,
        match.location,
        match.opponent_name,
        match.opponent_logo || null,
        match.home_score || null,
        match.away_score || null,
        match.is_completed ? 1 : 0
      ]
    });
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const getMatches = async () => {
  try {
    const result = await db.execute(`
      SELECT 
        id,
        date,
        time,
        location,
        'KDA Sporting Club' as home_team_name,
        '/kda.jpg' as home_team_logo,
        opponent_name as away_team_name,
        COALESCE(opponent_logo, '/kda.jpg') as away_team_logo,
        home_score,
        away_score,
        is_completed
      FROM matches
      ORDER BY date DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

// ... autres fonctions de matches