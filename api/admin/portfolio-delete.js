import { turso } from '../../lib/tursoClient.js';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('admin_session=valid');
}

async function ensurePortfolioTable() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      image_url TEXT,
      preview_url TEXT,
      repo_url TEXT,
      tags TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = Number(req.body?.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    await ensurePortfolioTable();
    await turso.execute({ sql: `DELETE FROM portfolio_items WHERE id = ?;`, args: [id] });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Admin portfolio delete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

