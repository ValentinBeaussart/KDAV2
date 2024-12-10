export interface Match {
  id?: number;
  date: string;
  time: string;
  location: string;
  opponent_name: string;
  opponent_logo?: string;
  home_score?: number;
  away_score?: number;
  is_completed: boolean;
}

export interface Player {
  id?: number;
  name: string;
  number: number;
  position: string;
  photo?: string;
}

export interface MatchPlayer {
  match_id: number;
  player_id: number;
  goals?: number;
  assists?: number;
}