import { supabase } from '../connection';
import type { Match } from '../types';

export class MatchModel {
  async create(match: Omit<Match, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          date: match.date,
          time: match.time,
          location: match.location,
          opponent_name: match.opponent_name,
          opponent_club_id: match.opponent_club_id,
          opponent_logo: match.opponent_logo,
          home_score: match.home_score || null,
          away_score: match.away_score || null,
          is_completed: match.is_completed || false,
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
  }

  async getAll() {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          opponent_club:clubs(*)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting matches:', error);
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          opponent_club:clubs(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting match:', error);
      throw error;
    }
  }

  async update(id: number, match: Partial<Match>) {
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
  }

  async delete(id: number) {
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
  }
}

export const matchModel = new MatchModel();
