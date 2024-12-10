import { db } from './db';
import type { Player } from './types';

// Fonctions pour les joueurs
export const createPlayer = async (player: Player) => {
  try {
    const result = await db.execute({
      sql: 'INSERT INTO players (name, number, position, photo) VALUES (?, ?, ?, ?)',
      args: [player.name, player.number, player.position, player.photo || '/player.webp']
    });
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  } catch (error) {
    console.error('Error creating player:', error);
    throw error;
  }
};

// ... autres fonctions de players