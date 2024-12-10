import { getClub, updateClub } from './clubs';

export const updateStandings = async (
  homeTeamId: number,
  awayTeamId: number | null,
  homeScore: number,
  awayScore: number
) => {
  // Update home team (KDA)
  const homeTeam = await getClub(homeTeamId);
  if (homeTeam) {
    const homeStats = {
      played: Math.max(0, homeTeam.played + (homeScore >= 0 ? 1 : -1)),
      goals_for: Math.max(0, homeTeam.goals_for + homeScore),
      goals_against: Math.max(0, homeTeam.goals_against + awayScore)
    };

    if (homeScore > awayScore) {
      homeStats['won'] = Math.max(0, homeTeam.won + 1);
      homeStats['points'] = Math.max(0, homeTeam.points + 3);
    } else if (homeScore < awayScore) {
      homeStats['lost'] = Math.max(0, homeTeam.lost + 1);
    } else if (homeScore === awayScore) {
      homeStats['drawn'] = Math.max(0, homeTeam.drawn + 1);
      homeStats['points'] = Math.max(0, homeTeam.points + 1);
    } else {
      // Negative scores mean we're reverting a match
      if (homeTeam.won > 0) {
        homeStats['won'] = homeTeam.won - 1;
        homeStats['points'] = Math.max(0, homeTeam.points - 3);
      } else if (homeTeam.drawn > 0) {
        homeStats['drawn'] = homeTeam.drawn - 1;
        homeStats['points'] = Math.max(0, homeTeam.points - 1);
      } else if (homeTeam.lost > 0) {
        homeStats['lost'] = homeTeam.lost - 1;
      }
    }

    await updateClub(homeTeamId, homeStats);
  }

  // Update away team if it exists
  if (awayTeamId) {
    const awayTeam = await getClub(awayTeamId);
    if (awayTeam) {
      const awayStats = {
        played: Math.max(0, awayTeam.played + (awayScore >= 0 ? 1 : -1)),
        goals_for: Math.max(0, awayTeam.goals_for + awayScore),
        goals_against: Math.max(0, awayTeam.goals_against + homeScore)
      };

      if (awayScore > homeScore) {
        awayStats['won'] = Math.max(0, awayTeam.won + 1);
        awayStats['points'] = Math.max(0, awayTeam.points + 3);
      } else if (awayScore < homeScore) {
        awayStats['lost'] = Math.max(0, awayTeam.lost + 1);
      } else if (awayScore === homeScore) {
        awayStats['drawn'] = Math.max(0, awayTeam.drawn + 1);
        awayStats['points'] = Math.max(0, awayTeam.points + 1);
      } else {
        // Negative scores mean we're reverting a match
        if (awayTeam.won > 0) {
          awayStats['won'] = awayTeam.won - 1;
          awayStats['points'] = Math.max(0, awayTeam.points - 3);
        } else if (awayTeam.drawn > 0) {
          awayStats['drawn'] = awayTeam.drawn - 1;
          awayStats['points'] = Math.max(0, awayTeam.points - 1);
        } else if (awayTeam.lost > 0) {
          awayStats['lost'] = awayTeam.lost - 1;
        }
      }

      await updateClub(awayTeamId, awayStats);
    }
  }
};