import { supabase } from './connection';
import type { MatchPlayer } from './types';

export const addPlayerToMatch = async (matchPlayer: MatchPlayer) => {
  try {
    const { data, error } = await supabase
      .from('match_players')
      .insert({
        match_id: matchPlayer.match_id,
        player_id: matchPlayer.player_id,
        goals: matchPlayer.goals || 0,
        assists: matchPlayer.assists || 0,
        season_id: matchPlayer.season_id // ✅ Ajout du season_id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding player to match:', error);
    throw error;
  }
};

export const getMatchPlayers = async (matchId: number) => {
  try {
    const { data, error } = await supabase
      .from('match_players')
      .select(`
        *,
        players (
          id,
          name,
          number,
          position,
          photo,
          season_id
        )
      `)
      .eq('match_id', matchId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting match players:', error);
    throw error;
  }
};

export const updateMatchPlayers = async (matchId: number, players: MatchPlayer[]) => {
  try {
    // First delete existing match players
    const { error: deleteError } = await supabase
      .from('match_players')
      .delete()
      .eq('match_id', matchId);

    if (deleteError) throw deleteError;

    // Then insert new match players
    if (players.length > 0) {
      const { error: insertError } = await supabase
        .from('match_players')
        .insert(players);

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error('Error updating match players:', error);
    throw error;
  }
};