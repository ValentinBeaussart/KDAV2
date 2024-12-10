import { fetchApi } from './fetch';
import type { Player } from '../types';

export async function getPlayers() {
  return fetchApi<Player[]>('/api/players');
}

export async function getPlayer(id: number) {
  return fetchApi<Player>(`/api/players/${id}`);
}

export async function updatePlayer(id: number, data: Partial<Player>) {
  return fetchApi<Player>(`/api/players/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}