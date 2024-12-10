import { BaseModel } from './base';
import type { NewsArticle } from '../types';

export class NewsModel extends BaseModel<NewsArticle> {
  constructor() {
    super('news');
  }

  async findPublished() {
    return this.findAll(
      { published: true },
      { orderBy: 'date.desc' }
    );
  }

  async findRecent(limit = 5) {
    return this.findAll(
      { published: true },
      { orderBy: 'date.desc', limit }
    );
  }

  async publish(id: number) {
    return this.update(id, {
      published: true,
      date: new Date().toISOString()
    });
  }

  async unpublish(id: number) {
    return this.update(id, { published: false });
  }
}

export const newsModel = new NewsModel();