import { supabase } from './connection';
import type { Player } from './types';

export const createPlayer = async (player: Omit<Player, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert({
        name: player.name,
        number: player.number,
        position: player.position,
        photo: player.photo || '/player.webp',
        appearances: player.appearances || 0,
        goals: player.goals || 0,
        assists: player.assists || 0,
        season_id: player.season_id // ✅ Ajout du season_id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating player:', error);
    throw error;
  }
};

export const getPlayers = async (season_id: number) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select()
      .eq('season_id', season_id) // ✅ Filtrer par saison
      .order('number');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting players:', error);
    throw error;
  }
};

export const getPlayer = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting player:', error);
    throw error;
  }
};

export const updatePlayer = async (id: number, player: Partial<Player>) => {
  try {
    // On empêche la modification de `season_id` pour éviter des incohérences
    const { season_id, ...allowedUpdates } = player; 

    const { data, error } = await supabase
      .from('players')
      .update(allowedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
};

export const deletePlayer = async (id: number) => {
  try {
    const { error: matchPlayerError } = await supabase
      .from('match_players')
      .delete()
      .eq('player_id', id);

    if (matchPlayerError) throw matchPlayerError;

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
};
