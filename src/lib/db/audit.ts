import { db } from './connection';
import { runTransaction } from './utils';

export const auditDatabase = async () => {
  try {
    const tables = ['clubs', 'players', 'matches', 'match_players', 'news'];
    const issues = [];

    // Check table existence and structure
    for (const table of tables) {
      const result = await db.execute({
        sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        args: [table]
      });
      
      if (result.rows.length === 0) {
        issues.push(`Missing table: ${table}`);
      }
    }

    // Check for KDA club
    const kdaResult = await db.execute({
      sql: 'SELECT * FROM clubs WHERE id = 1'
    });
    
    if (kdaResult.rows.length === 0) {
      issues.push('Missing KDA club record');
      
      // Auto-fix: Insert KDA club
      await db.execute({
        sql: `INSERT INTO clubs (id, name, logo) VALUES (1, 'KDA Sporting Club', '/kda.jpg')`
      });
    }

    // Check referential integrity
    const integrityIssues = await runTransaction([
      {
        sql: `
          SELECT match_id, player_id FROM match_players mp
          WHERE NOT EXISTS (SELECT 1 FROM matches m WHERE m.id = mp.match_id)
          OR NOT EXISTS (SELECT 1 FROM players p WHERE p.id = mp.player_id)
        `
      }
    ]);

    if (integrityIssues.rows?.length > 0) {
      issues.push('Found orphaned match_players records');
    }

    return {
      success: issues.length === 0,
      issues
    };
  } catch (error) {
    console.error('Error during database audit:', error);
    throw error;
  }
};