export const schema = `
  CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo TEXT,
    played INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    drawn INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    number TEXT NOT NULL,
    position TEXT NOT NULL,
    photo TEXT,
    appearances INTEGER DEFAULT 0,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    opponent_name TEXT NOT NULL,
    opponent_logo TEXT,
    opponent_club_id INTEGER,
    home_score INTEGER,
    away_score INTEGER,
    is_completed BOOLEAN DEFAULT 0,
    match_type TEXT NOT NULL,
    competition_round TEXT,
    lineup_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opponent_club_id) REFERENCES clubs(id)
  );

  CREATE TABLE IF NOT EXISTS match_players (
    match_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (match_id, player_id),
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    date TEXT NOT NULL,
    published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Triggers to update updated_at timestamp
  CREATE TRIGGER IF NOT EXISTS clubs_update_timestamp 
  AFTER UPDATE ON clubs
  BEGIN
    UPDATE clubs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS players_update_timestamp 
  AFTER UPDATE ON players
  BEGIN
    UPDATE players SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS matches_update_timestamp 
  AFTER UPDATE ON matches
  BEGIN
    UPDATE matches SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS match_players_update_timestamp 
  AFTER UPDATE ON match_players
  BEGIN
    UPDATE match_players SET updated_at = CURRENT_TIMESTAMP 
    WHERE match_id = NEW.match_id AND player_id = NEW.player_id;
  END;

  CREATE TRIGGER IF NOT EXISTS news_update_timestamp 
  AFTER UPDATE ON news
  BEGIN
    UPDATE news SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
`;

export const initialData = `
  INSERT OR IGNORE INTO clubs (id, name, logo)
  VALUES (1, 'KDA Sporting Club', '/kda.jpg');
`;
