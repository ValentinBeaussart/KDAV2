import { supabase } from './connection';
import type { Match } from './types';

export const createMatch = async (match: Omit<Match, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .insert({
        date: match.date,
        time: match.time,
        location: match.location,
        opponent_name: match.opponent_name,
        opponent_logo: match.opponent_logo || null,
        opponent_club_id: match.opponent_club_id,
        home_score: match.home_score || null,
        away_score: match.away_score || null,
        is_completed: match.is_completed,
        match_type: match.match_type,
        competition_round: match.competition_round || null,
        lineup_image: match.lineup_image || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

export const getMatches = async () => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        date,
        time,
        location,
        opponent_name,
        opponent_logo,
        opponent_club_id,
        home_score,
        away_score,
        is_completed,
        match_type,
        competition_round,
        lineup_image
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

export const getMatch = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting match:', error);
    throw error;
  }
};

export const updateMatch = async (id: number, match: Partial<Match>) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .update(match)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating match:', error);
    throw error;
  }
};

export const deleteMatch = async (id: number) => {
  try {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};