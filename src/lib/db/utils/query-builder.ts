import { supabase } from '../connection';
import type { Database } from '../types';

type TableName = keyof Database['public']['Tables'];
type QueryParams = Record<string, unknown>;

export const buildSelectQuery = (
  table: TableName,
  params?: QueryParams,
  options?: {
    select?: string[];
    orderBy?: string;
    limit?: number;
  }
) => {
  let query = supabase.from(table).select(options?.select?.join(',') || '*');

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query = query.eq(key, value);
      }
    });
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  return query;
};

export const buildInsertQuery = (
  table: TableName,
  data: QueryParams
) => {
  return supabase
    .from(table)
    .insert([data])
    .select()
    .single();
};

export const buildUpdateQuery = (
  table: TableName,
  id: number,
  data: QueryParams
) => {
  return supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();
};

export const buildDeleteQuery = (
  table: TableName,
  id: number
) => {
  return supabase
    .from(table)
    .delete()
    .eq('id', id);
};