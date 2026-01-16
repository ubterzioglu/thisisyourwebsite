import { turso } from './tursoClient.js';

// Ensure `status` table exists and has the newer optional columns.
// Safe to call on every request (idempotent).
export async function ensureStatusTable() {
  // Create (new installs)
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      site_url TEXT,
      status INTEGER NOT NULL CHECK (status BETWEEN 0 AND 5),
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `);

  // Existing installs: add missing columns safely.
  try {
    const cols = await turso.execute(`PRAGMA table_info(status);`);
    const hasSiteUrl = (cols.rows || []).some((r) => String(r.name) === 'site_url');
    if (!hasSiteUrl) {
      await turso.execute(`ALTER TABLE status ADD COLUMN site_url TEXT;`);
    }
  } catch (e) {
    // Non-fatal: if table doesn't exist or PRAGMA fails, the main query will error and show logs.
    console.warn('ensureStatusTable: schema check failed (non-fatal):', e);
  }

  await turso.execute(`CREATE INDEX IF NOT EXISTS idx_status_full_name ON status(full_name);`);
}

