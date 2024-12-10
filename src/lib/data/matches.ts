import type { Match } from './types';
import { readJsonFile, writeJsonFile, getNextId } from './storage';
import { updateMatchStats } from './utils/stats';
import { getClub } from './clubs';
import { getMatchPlayers } from './match-players';
import { updatePlayerStats } from './utils/stats';

export const getMatches = async (): Promise<Match[]> => {
  const matches = await readJsonFile<Match>('matches.json');
  
  // Enrich matches with club logos for championship matches
  const enrichedMatches = await Promise.all(matches.map(async match => {
    if (match.match_type === 'MCDO_POOL') {
      // Find club by its ID for matches that have opponent_club_id
      if (match.opponent_club_id) {
        const opponentClub = await getClub(match.opponent_club_id);
        if (opponentClub) {
          match.opponent_logo = opponentClub.logo;
        }
      }
      // For older matches without opponent_club_id, try to find by name
      else {
        const clubs = await readJsonFile('clubs.json');
        const opponentClub = clubs.find(c => c.name.trim() === match.opponent_name.trim());
        if (opponentClub) {
          match.opponent_club_id = opponentClub.id;
          match.opponent_logo = opponentClub.logo;
        }
      }
    }
    return match;
  }));
  
  return enrichedMatches;
};

export const getMatch = async (id: number): Promise<Match | undefined> => {
  const matches = await getMatches();
  return matches.find(m => m.id === id);
};

export const createMatch = async (match: Omit<Match, 'id'>): Promise<Match> => {
  const matches = await getMatches();
  
  // If it's a championship match, get club info
  let opponent_logo = match.opponent_logo;
  if (match.match_type === 'MCDO_POOL' && match.opponent_club_id) {
    const opponentClub = await getClub(match.opponent_club_id);
    if (opponentClub) {
      opponent_logo = opponentClub.logo;
    }
  }

  const newMatch = {
    ...match,
    opponent_logo,
    id: await getNextId('matches.json')
  };
  
  matches.push(newMatch);
  await writeJsonFile('matches.json', matches);

  // If the match is completed, update stats
  if (newMatch.is_completed) {
    await updateMatchStats(newMatch, true);
  }

  return newMatch;
};

export const updateMatch = async (id: number, updates: Partial<Match>): Promise<Match | null> => {
  const matches = await getMatches();
  const index = matches.findIndex(m => m.id === id);
  if (index === -1) return null;

  const oldMatch = matches[index];
  
  // If it's a championship match, get club info
  let opponent_logo = updates.opponent_logo;
  if (updates.match_type === 'MCDO_POOL' && updates.opponent_club_id) {
    const opponentClub = await getClub(updates.opponent_club_id);
    if (opponentClub) {
      opponent_logo = opponentClub.logo;
    }
  }

  const newMatch = {
    ...oldMatch,
    ...updates,
    opponent_logo,
    lineup_image: updates.lineup_image || oldMatch.lineup_image
  };

  // Update stats if necessary
  if (!oldMatch.is_completed && newMatch.is_completed) {
    await updateMatchStats(newMatch, true);
  } else if (oldMatch.is_completed && !newMatch.is_completed) {
    await updateMatchStats(oldMatch, false);
  } else if (oldMatch.is_completed && newMatch.is_completed && 
            (oldMatch.home_score !== newMatch.home_score || 
             oldMatch.away_score !== newMatch.away_score)) {
    // If scores changed, revert old stats and apply new ones
    await updateMatchStats(oldMatch, false);
    await updateMatchStats(newMatch, true);
  }

  matches[index] = newMatch;
  await writeJsonFile('matches.json', matches);
  return newMatch;
};

export const deleteMatch = async (id: number): Promise<boolean> => {
  try {
    const matches = await readJsonFile<Match>('matches.json');
    const matchIndex = matches.findIndex(m => m.id === id);
    
    if (matchIndex === -1) return false;
    
    const match = matches[matchIndex];
    
    // If the match was completed, we need to revert the stats
    if (match.is_completed) {
      // Revert match stats (this will handle club standings)
      await updateMatchStats(match, false);
      
      // Get all players from this match and revert their stats
      const matchPlayers = await getMatchPlayers(id);
      for (const mp of matchPlayers) {
        await updatePlayerStats(mp.player_id, {
          appearances: -1,
          goals: -(mp.goals || 0),
          assists: -(mp.assists || 0)
        });
      }
    }
    
    // Remove match players
    const matchPlayersData = await readJsonFile('match_players.json');
    const updatedMatchPlayers = matchPlayersData.filter(mp => mp.match_id !== id);
    await writeJsonFile('match_players.json', updatedMatchPlayers);
    
    // Remove the match
    matches.splice(matchIndex, 1);
    await writeJsonFile('matches.json', matches);
    
    return true;
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};
