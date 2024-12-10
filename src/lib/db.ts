import { initDb, supabase } from './db/connection';

// Initialize the database
await initDb();

// Export everything from the database modules
export * from './db/types';
export * from './db/clubs';
export * from './db/players';
export * from './db/matches';
export * from './db/match-players';
export * from './db/news';

// Export the database connection
export { supabase };
