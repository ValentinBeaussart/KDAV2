import { 
  buildSelectQuery, 
  buildInsertQuery, 
  buildUpdateQuery, 
  buildDeleteQuery 
} from '../utils/query-builder';
import { handleDatabaseError } from '../utils/error-handler';
import type { Database } from '../types';

export class BaseModel<T extends { id: number }> {
  constructor(
    protected readonly table: keyof Database['public']['Tables']
  ) {}

  async findAll(params?: Record<string, unknown>) {
    try {
      const { data, error } = await buildSelectQuery(this.table, params);
      
      if (error) throw error;
      return data as T[];
    } catch (error) {
      handleDatabaseError(error, `fetching ${this.table}`);
    }
  }

  async findById(id: number) {
    try {
      const { data, error } = await buildSelectQuery(this.table, { id });
      
      if (error) throw error;
      return data?.[0] as T | undefined;
    } catch (error) {
      handleDatabaseError(error, `fetching ${this.table} by id`);
    }
  }

  async create(data: Omit<T, 'id'>) {
    try {
      const { data: result, error } = await buildInsertQuery(this.table, data);
      
      if (error) throw error;
      return result as T;
    } catch (error) {
      handleDatabaseError(error, `creating ${this.table}`);
    }
  }

  async update(id: number, data: Partial<T>) {
    try {
      const { data: result, error } = await buildUpdateQuery(this.table, id, data);
      
      if (error) throw error;
      return result as T;
    } catch (error) {
      handleDatabaseError(error, `updating ${this.table}`);
    }
  }

  async delete(id: number) {
    try {
      const { error } = await buildDeleteQuery(this.table, id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, `deleting ${this.table}`);
    }
  }
}