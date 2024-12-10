export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export const handleDatabaseError = (error: unknown, context: string): never => {
  console.error(`Database error in ${context}:`, error);
  
  if (error instanceof DatabaseError) {
    throw error;
  }
  
  throw new DatabaseError(
    `An error occurred while ${context}`,
    undefined,
    error
  );
};