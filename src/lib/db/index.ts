// Export all database models
export * from './clubs';
export * from './players';
export * from './matches';
export * from './match-players';
export * from './news';
export * from './utils/match';
export * from './utils/match-stats';

// Initialize database connection
import { initDb } from './connection';
await initDb();
