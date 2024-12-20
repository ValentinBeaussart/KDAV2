import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables
const supabaseUrl = "https://awadpdwwqabknvxoqgwa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YWRwZHd3cWFia252eG9xZ3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MjM4MDMsImV4cCI6MjA0OTM5OTgwM30.rMp0lZeHGL-7g_vv3UusNo_0SCscddJPtoxhiFC3pKU";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Initialize database and verify connection
export const initDb = async () => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Test connection
    const { data, error } = await supabase
      .from('clubs')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Check if KDA club exists
    const { data: kda, error: kdaError } = await supabase
      .from('clubs')
      .select()
      .eq('id', 1)
      .single();
    
    if (kdaError && kdaError.code !== 'PGRST116') {
      throw kdaError;
    }

    // Insert KDA club if it doesn't exist
    if (!kda) {
      const { error: insertError } = await supabase
        .from('clubs')
        .insert({
          id: 1,
          name: 'KDA Sporting Club',
          logo: '/kda.jpg',
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goals_for: 0,
          goals_against: 0,
          points: 0,
          is_mcdo_pool: true
        });
      
      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};