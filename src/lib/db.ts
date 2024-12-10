import { initDb, db } from './db/connection';

// Initialize the database
await initDb();

// Re-export everything from the database modules
export * from './db/types';
export * from './db/clubs';
export * from './db/players';
export * from './db/matches';
export * from './db/match-players';

// Export the database connection
export { db };