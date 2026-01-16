import { turso } from '../lib/tursoClient.js';

// One-time migration endpoint for Turso (create portfolio_items table)
// Protect with PORTFOLIO_MIGRATE_SECRET (env)
export default async function handler(req, res) {
  const secretEnv = process.env.PORTFOLIO_MIGRATE_SECRET;
  const provided =
    (req.headers['x-migrate-secret'] || req.headers['x-migration-secret'] || '').toString() ||
    (req.query?.secret || '').toString();
  const replace =
    String(req.query?.replace || '').toLowerCase() === '1' ||
    String(req.query?.replace || '').toLowerCase() === 'true';

  if (!secretEnv) {
    return res.status(500).json({ error: 'PORTFOLIO_MIGRATE_SECRET is missing' });
  }
  if (!provided || provided !== secretEnv) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (replace) {
      await turso.execute(`DROP TABLE IF EXISTS portfolio_items;`);
    }

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

    return res.status(200).json({ ok: true, replaced: !!replace });
  } catch (err) {
    console.error('Portfolio migrate error:', err);
    return res.status(500).json({ error: 'Migration failed', details: err.message });
  }
}

