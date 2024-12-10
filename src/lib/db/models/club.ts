import { BaseModel } from './base';
import type { Club } from '../types';

export class ClubModel extends BaseModel<Club> {
  constructor() {
    super('clubs');
  }

  async findByName(name: string) {
    return this.findAll({ name });
  }

  async updateStats(id: number, stats: {
    played?: number;
    won?: number;
    drawn?: number;
    lost?: number;
    goals_for?: number;
    goals_against?: number;
    points?: number;
  }) {
    return this.update(id, stats);
  }

  override async delete(id: number) {
    // Prevent deleting KDA club
    if (id === 1) {
      throw new Error('Cannot delete KDA club');
    }
    return super.delete(id);
  }
}

export const clubModel = new ClubModel();