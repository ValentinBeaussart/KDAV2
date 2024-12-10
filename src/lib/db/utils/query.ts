import { supabase } from '../connection';
import type { Database } from '../types';
import { handleDatabaseError } from './errors';

type TableName = keyof Database['public']['Tables'];

export const select = async <T>(
  table: TableName,
  query: {
    columns?: string;
    eq?: Record<string, any>;
    order?: Record<string, any>;
    limit?: number;
  } = {}
) => {
  try {
    let queryBuilder = supabase
      .from(table)
      .select(query.columns || '*');

    if (query.eq) {
      Object.entries(query.eq).forEach(([column, value]) => {
        queryBuilder = queryBuilder.eq(column, value);
      });
    }

    if (query.order) {
      Object.entries(query.order).forEach(([column, direction]) => {
        queryBuilder = queryBuilder.order(column, { ascending: direction === 'asc' });
      });
    }

    if (query.limit) {
      queryBuilder = queryBuilder.limit(query.limit);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data as T[];
  } catch (error) {
    handleDatabaseError(error, `selecting from ${table}`);
  }
};

export const insert = async <T>(
  table: TableName,
  data: Record<string, any>
) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  } catch (error) {
    handleDatabaseError(error, `inserting into ${table}`);
  }
};

export const update = async <T>(
  table: TableName,
  id: number,
  data: Record<string, any>
) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  } catch (error) {
    handleDatabaseError(error, `updating ${table}`);
  }
};

export const remove = async (
  table: TableName,
  id: number
) => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    handleDatabaseError(error, `deleting from ${table}`);
  }
};