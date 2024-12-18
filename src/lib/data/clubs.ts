import type { Club } from './types';
import { readJsonFile, writeJsonFile, getNextId } from './storage';

// Ensure KDA exists
const ensureKDAExists = async () => {
  const clubs = await readJsonFile<Club>('clubs.json');
  if (clubs.length === 0) {
    const kda: Club = {
      id: 1,
      name: "KDA Sporting Club",
      logo: "/kda.jpg",
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
      points: 0
    };
    await writeJsonFile('clubs.json', [kda]);
    return [kda];
  }
  return clubs;
};

export const getClubs = async (): Promise<Club[]> => {
  return await ensureKDAExists();
};

export const getClub = async (id: number): Promise<Club | undefined> => {
  const clubs = await getClubs();
  return clubs.find(c => c.id === id);
};

export const createClub = async (club: Omit<Club, 'id' | 'played' | 'won' | 'drawn' | 'lost' | 'goals_for' | 'goals_against' | 'points'>): Promise<Club> => {
  const clubs = await getClubs();
  const newClub = {
    ...club,
    id: await getNextId('clubs.json'),
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goals_for: 0,
    goals_against: 0,
    points: 0
  };
  
  clubs.push(newClub);
  await writeJsonFile('clubs.json', clubs);
  return newClub;
};

export const updateClub = async (id: number, updates: Partial<Club>): Promise<Club | null> => {
  const clubs = await getClubs();
  const index = clubs.findIndex(c => c.id === id);
  if (index === -1) return null;

  // Prevent updating stats directly
  const { played, won, drawn, lost, goals_for, goals_against, points, ...allowedUpdates } = updates;

  clubs[index] = {
    ...clubs[index],
    ...allowedUpdates
  };

  await writeJsonFile('clubs.json', clubs);
  return clubs[index];
};

export const deleteClub = async (id: number): Promise<boolean> => {
  // Prevent deleting KDA
  if (id === 1) return false;
  
  const clubs = await getClubs();
  const index = clubs.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  clubs.splice(index, 1);
  await writeJsonFile('clubs.json', clubs);
  return true;
};
