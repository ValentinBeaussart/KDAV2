import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

// Ensure data directory exists
const ensureDataDir = async () => {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
};

// Generic function to read JSON file
export const readJsonFile = async <T>(filename: string): Promise<T[]> => {
  try {
    await ensureDataDir();
    const filePath = join(DATA_DIR, filename);
    if (!existsSync(filePath)) {
      await writeFile(filePath, '[]', 'utf-8');
      return [];
    }
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// Generic function to write JSON file
export const writeJsonFile = async <T>(filename: string, data: T[]): Promise<void> => {
  try {
    await ensureDataDir();
    await writeFile(
      join(DATA_DIR, filename),
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
};

// Get next ID for a collection
export const getNextId = async (filename: string): Promise<number> => {
  const items = await readJsonFile(filename);
  return items.length > 0 
    ? Math.max(...items.map(item => (item as any).id)) + 1 
    : 1;
};