import type { Player } from './types';
import { readJsonFile, writeJsonFile, getNextId } from './storage';
import { updatePlayerStats } from './utils/stats';

export const getPlayers = async (): Promise<Player[]> => {
  return await readJsonFile('players.json');
};

export const getPlayer = async (id: number): Promise<Player | undefined> => {
  const players = await getPlayers();
  return players.find(p => p.id === id);
};

export const createPlayer = async (player: Omit<Player, 'id' | 'appearances' | 'goals' | 'assists'>): Promise<Player> => {
  const players = await getPlayers();
  const newPlayer = {
    ...player,
    id: await getNextId('players.json'),
    appearances: 0,
    goals: 0,
    assists: 0
  };
  
  players.push(newPlayer);
  await writeJsonFile('players.json', players);
  return newPlayer;
};

export const updatePlayer = async (id: number, updates: Partial<Player>): Promise<Player | null> => {
  const players = await getPlayers();
  const index = players.findIndex(p => p.id === id);
  if (index === -1) return null;

  players[index] = {
    ...players[index],
    ...updates
  };

  await writeJsonFile('players.json', players);
  return players[index];
};

export const deletePlayer = async (id: number): Promise<boolean> => {
  // Vérifier si le joueur existe
  const players = await getPlayers();
  const index = players.findIndex(p => p.id === id);
  if (index === -1) return false;

  // Récupérer les matchs du joueur
  const matchPlayers = await readJsonFile('match_players.json');
  const playerMatches = matchPlayers.filter(mp => mp.player_id === id);

  // Supprimer les statistiques du joueur des matchs
  const filteredMatchPlayers = matchPlayers.filter(mp => mp.player_id !== id);
  await writeJsonFile('match_players.json', filteredMatchPlayers);

  // Supprimer le joueur
  players.splice(index, 1);
  await writeJsonFile('players.json', players);

  return true;
};

export const resetPlayerStats = async (playerId: number): Promise<boolean> => {
  const player = await getPlayer(playerId);
  if (!player) return false;

  // Réinitialiser les stats du joueur
  await updatePlayer(playerId, {
    appearances: 0,
    goals: 0,
    assists: 0
  });

  return true;
};
