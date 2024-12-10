import { fetchApi } from './fetch';
import type { Match, MatchPlayer } from '../types';

export async function getMatch(id: number) {
  return fetchApi<Match>(`/api/matches/${id}`);
}

export async function getMatchPlayers(matchId: number) {
  return fetchApi<MatchPlayer[]>(`/api/matches/${matchId}/players`);
}

export async function updateMatch(id: number, data: Partial<Match>) {
  return fetchApi<Match>(`/api/matches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMatch(id: number) {
  return fetchApi(`/api/matches/${id}`, {
    method: 'DELETE',
  });
}