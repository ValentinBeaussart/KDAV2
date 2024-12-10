import type { Player } from '../data/types';
import { players } from '../data';

// In-memory storage for players
let playersData = [...players];
let nextPlayerId = Math.max(...players.map(p => p.id)) + 1;

export const getPlayers = () => playersData;

export const getPlayer = (id: number) =>
  playersData.find(p => p.id === id);

export const createPlayer = (player: Omit<Player, 'id'>) => {
  const newPlayer = {
    ...player,
    id: nextPlayerId++
  };
  playersData.push(newPlayer);
  return newPlayer;
};

export const updatePlayer = (id: number, player: Partial<Player>) => {
  const index = playersData.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  playersData[index] = {
    ...playersData[index],
    ...player
  };
  return playersData[index];
};

export const deletePlayer = (id: number) => {
  const index = playersData.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  playersData.splice(index, 1);
  return true;
};