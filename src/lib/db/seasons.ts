import { supabase } from './connection';
import type { Season } from './types';

export const createSeason = async (season: Omit<Season, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .insert({
        start_year: season.start_year,
        end_year: season.end_year
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating season:', error);
    throw error;
  }
};

export const getSeasons = async () => {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .select()
      .order('start_year', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting seasons:', error);
    throw error;
  }
};

export const getSeason = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting season:', error);
    throw error;
  }
};

export const deleteSeason = async (id: number) => {
  try {
    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting season:', error);
    throw error;
  }
};
