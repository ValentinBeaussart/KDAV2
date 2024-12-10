export interface Database {
  public: {
    Tables: {
      clubs: {
        Row: Club;
        Insert: Omit<Club, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Club, 'id' | 'created_at' | 'updated_at'>>;
      };
      players: {
        Row: Player;
        Insert: Omit<Player, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Player, 'id' | 'created_at' | 'updated_at'>>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Match, 'id' | 'created_at' | 'updated_at'>>;
      };
      match_players: {
        Row: MatchPlayer;
        Insert: Omit<MatchPlayer, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MatchPlayer, 'created_at' | 'updated_at'>>;
      };
      news: {
        Row: NewsArticle;
        Insert: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export interface Club {
  id: number;
  name: string;
  logo?: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
  is_mcdo_pool: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  photo?: string | null;
  appearances: number;
  goals: number;
  assists: number;
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  id: number;
  date: string;
  time: string;
  location: string;
  opponent_name: string;
  opponent_logo?: string | null;
  opponent_club_id?: number | null;
  home_score?: number | null;
  away_score?: number | null;
  is_completed: boolean;
  match_type: string;
  competition_round?: string | null;
  lineup_image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MatchPlayer {
  match_id: number;
  player_id: number;
  goals: number;
  assists: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: string | null;
  date: string;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}