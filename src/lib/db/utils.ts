export const buildUpdateQuery = (
  table: string,
  updates: Record<string, any>,
  excludeKeys: string[] = ['id']
): { sql: string; values: any[] } => {
  const updateEntries = Object.entries(updates)
    .filter(([key]) => !excludeKeys.includes(key));

  if (updateEntries.length === 0) {
    throw new Error('No valid fields to update');
  }

  const setClauses = updateEntries
    .map(([key]) => `${key} = ?`)
    .join(', ');

  const values = updateEntries.map(([_, value]) => value);

  return {
    sql: `UPDATE ${table} SET ${setClauses} WHERE id = ?`,
    values
  };
};

export const buildInsertQuery = (
  table: string,
  data: Record<string, any>,
  excludeKeys: string[] = ['id']
): { sql: string; values: any[] } => {
  const insertEntries = Object.entries(data)
    .filter(([key]) => !excludeKeys.includes(key));

  if (insertEntries.length === 0) {
    throw new Error('No valid fields to insert');
  }

  const columns = insertEntries.map(([key]) => key).join(', ');
  const placeholders = insertEntries.map(() => '?').join(', ');
  const values = insertEntries.map(([_, value]) => value);

  return {
    sql: `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
    values
  };
};

export const validateId = (id: any): number => {
  const numId = Number(id);
  if (isNaN(numId) || numId < 1) {
    throw new Error('Invalid ID');
  }
  return numId;
};