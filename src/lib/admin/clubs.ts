import type { Club } from '../data/types';
import { clubs } from '../data';

// In-memory storage for clubs
let clubsData = [...clubs];
let nextClubId = Math.max(...clubs.map(c => c.id)) + 1;

export const getClubs = () => clubsData;

export const getClub = (id: number) =>
  clubsData.find(c => c.id === id);

export const createClub = (club: Omit<Club, 'id'>) => {
  const newClub = {
    ...club,
    id: nextClubId++
  };
  clubsData.push(newClub);
  return newClub;
};

export const updateClub = (id: number, club: Partial<Club>) => {
  const index = clubsData.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  clubsData[index] = {
    ...clubsData[index],
    ...club
  };
  return clubsData[index];
};

export const deleteClub = (id: number) => {
  const index = clubsData.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  clubsData.splice(index, 1);
  return true;
};