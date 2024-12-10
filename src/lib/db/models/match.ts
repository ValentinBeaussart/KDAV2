import { BaseModel } from './base';
import type { Match } from '../types';
import { playerModel } from './player';
import { matchPlayerModel } from './match-player';

export class MatchModel extends BaseModel<Match> {
  constructor() {
    super('matches');
  }

  async findUpcoming() {
    return this.findAll(
      { is_completed: false },
      { orderBy: 'date.asc,time.asc' }
    );
  }

  async findCompleted() {
    return this.findAll(
      { is_completed: true },
      { orderBy: 'date.desc,time.desc' }
    );
  }

  async complete(id: number, result: {
    home_score: number;
    away_score: number;
    player_stats: Array<{
      player_id: number;
      goals: number;
      assists: number;
    }>;
  }) {
    // Update match result
    const match = await this.update(id, {
      home_score: result.home_score,
      away_score: result.away_score,
      is_completed: true
    });

    if (!match) return null;

    // Update player stats
    for (const stats of result.player_stats) {
      const player = await playerModel.findById(stats.player_id);
      if (player) {
        await playerModel.updateStats(player.id, {
          appearances: player.appearances + 1,
          goals: player.goals + stats.goals,
          assists: player.assists + stats.assists
        });

        await matchPlayerModel.create({
          match_id: id,
          player_id: player.id,
          goals: stats.goals,
          assists: stats.assists
        });
      }
    }

    return match;
  }
}

export const matchModel = new MatchModel();