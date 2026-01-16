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
  await turso.execute(`CREATE INDEX IF NOT EXISTS idx_portfolio_is_published ON portfolio_items(is_published);`);
  await turso.execute(`CREATE INDEX IF NOT EXISTS idx_portfolio_sort_order ON portfolio_items(sort_order);`);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await ensurePortfolioTable();
    const rs = await turso.execute({
      sql: `
        SELECT id, title, subtitle, description, image_url, preview_url, repo_url, tags, sort_order, is_published, created_at, updated_at
        FROM portfolio_items
        ORDER BY updated_at DESC
        LIMIT 500
      `,
      args: []
    });
    return res.status(200).json({ rows: rs.rows || [] });
  } catch (err) {
    console.error('Admin portfolio list error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

