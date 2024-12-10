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
        assists: player.assists || 0
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

export const getPlayers = async () => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select()
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
    const { data, error } = await supabase
      .from('players')
      .update(player)
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
    // First delete related match_players records
    const { error: matchPlayerError } = await supabase
      .from('match_players')
      .delete()
      .eq('player_id', id);

    if (matchPlayerError) throw matchPlayerError;

    // Then delete the player
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