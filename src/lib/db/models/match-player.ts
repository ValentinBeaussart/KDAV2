import { BaseModel } from './base';
import type { MatchPlayer } from '../types';

export class MatchPlayerModel extends BaseModel<MatchPlayer> {
  constructor() {
    super('match_players');
  }

  async findByMatch(matchId: number) {
    return this.findAll({ match_id: matchId });
  }

  async findByPlayer(playerId: number) {
    return this.findAll({ player_id: playerId });
  }

  async updateStats(matchId: number, playerId: number, stats: {
    goals?: number;
    assists?: number;
  }) {
    const matchPlayer = await this.findAll({
      match_id: matchId,
      player_id: playerId
    });

    if (!matchPlayer?.[0]) return null;

    return this.update(matchPlayer[0].id, stats);
  }
}

export const matchPlayerModel = new MatchPlayerModel();