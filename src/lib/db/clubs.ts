import { supabase } from './connection';
import type { Club } from './types';

export const createClub = async (club: Omit<Club, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .insert({
        name: club.name,
        logo: club.logo || null,
        season_id: club.season_id, // Ajout du season_id
        played: club.played || 0,
        won: club.won || 0,
        drawn: club.drawn || 0,
        lost: club.lost || 0,
        goals_for: club.goals_for || 0,
        goals_against: club.goals_against || 0,
        points: club.points || 0,
        is_mcdo_pool: club.is_mcdo_pool || false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating club:', error);
    throw error;
  }
};

export const getClubs = async (season_id: number) => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select()
      .eq('season_id', season_id) // Filtrer par saison
      .order('points', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting clubs:', error);
    throw error;
  }
};

export const getMcDoClubs = async (season_id: number) => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select()
      .eq('is_mcdo_pool', true)
      .eq('season_id', season_id) // Filtrer par saison
      .order('points', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting McDo clubs:', error);
    throw error;
  }
};

export const getClub = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting club:', error);
    throw error;
  }
};

export const updateClub = async (id: number, club: Partial<Club>) => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .update(club)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating club:', error);
    throw error;
  }
};

export const deleteClub = async (id: number) => {
  try {
    if (id === 1) {
      throw new Error('Cannot delete KDA club');
    }

    const { error } = await supabase
      .from('clubs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting club:', error);
    throw error;
  }
};
