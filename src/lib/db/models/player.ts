import { BaseModel } from './base';
import type { Player } from '../types';

export class PlayerModel extends BaseModel<Player> {
  constructor() {
    super('players');
  }

  async findByNumber(number: number) {
    return this.findAll({ number });
  }

  async updateStats(id: number, stats: {
    appearances?: number;
    goals?: number;
    assists?: number;
  }) {
    return this.update(id, stats);
  }

  async getTopScorers(limit = 5) {
    return this.findAll(undefined, {
      orderBy: 'goals.desc',
      limit
    });
  }
}

export const playerModel = new PlayerModel();