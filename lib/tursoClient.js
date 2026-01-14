// Turso (libSQL) Client Helper
import { createClient } from '@libsql/client';

const databaseUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl || !authToken) {
  throw new Error('Turso credentials are missing. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
}

export const tursoClient = createClient({
  url: databaseUrl,
  authToken: authToken
});

// Helper: Generate UUID-like ID (for SQLite compatibility)
import { randomUUID } from 'crypto';
export function generateId() {
  return randomUUID();
}

// Helper: Execute SQL query
export async function executeQuery(sql, params = []) {
  try {
    const result = await tursoClient.execute({ sql, args: params });
    return { data: result.rows, error: null };
  } catch (error) {
    console.error('Query error:', error);
    return { data: null, error };
  }
}

// Helper: Execute SQL query and return single row
export async function executeQuerySingle(sql, params = []) {
  const result = await executeQuery(sql, params);
  if (result.error) return result;
  return { data: result.data?.[0] || null, error: null };
}
