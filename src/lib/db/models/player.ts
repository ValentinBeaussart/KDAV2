import { supabase } from '../connection';
import type { Player } from '../types';

export class PlayerModel {
  async create(player: Omit<Player, 'id'>) {
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
  }

  async getAll() {
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
  }

  async getById(id: number) {
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
  }

  async update(id: number, player: Partial<Player>) {
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
  }

  async delete(id: number) {
    try {
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
  }

  async getTopScorers(limit = 3) {
    try {
      const { data, error } = await supabase
        .from('players')
        .select()
        .order('goals', { ascending: false })
        .order('appearances', { ascending: true })
        .order('assists', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting top scorers:', error);
      throw error;
    }
  }
}

export const playerModel = new PlayerModel();
