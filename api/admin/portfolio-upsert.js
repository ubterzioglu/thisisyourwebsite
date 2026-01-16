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

function toNullableString(v) {
  const s = String(v ?? '').trim();
  return s ? s : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = req.body || {};
  const id = body.id !== undefined && body.id !== null && String(body.id).trim() !== '' ? Number(body.id) : null;
  const title = String(body.title ?? '').trim();
  const subtitle = toNullableString(body.subtitle);
  const description = toNullableString(body.description);
  const imageUrl = toNullableString(body.image_url);
  const previewUrl = toNullableString(body.preview_url);
  const repoUrl = toNullableString(body.repo_url);
  const tags = toNullableString(body.tags); // comma separated string
  const sortOrder = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0;
  const isPublished = String(body.is_published ?? '').toLowerCase() === '1' || String(body.is_published ?? '').toLowerCase() === 'true';

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  try {
    await ensurePortfolioTable();

    if (id && Number.isInteger(id) && id > 0) {
      await turso.execute({
        sql: `
          UPDATE portfolio_items
          SET title = ?, subtitle = ?, description = ?, image_url = ?, preview_url = ?, repo_url = ?, tags = ?,
              sort_order = ?, is_published = ?,
              updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
          WHERE id = ?;
        `,
        args: [title, subtitle, description, imageUrl, previewUrl, repoUrl, tags, sortOrder, isPublished ? 1 : 0, id]
      });
      return res.status(200).json({ ok: true, updated: true });
    }

    await turso.execute({
      sql: `
        INSERT INTO portfolio_items (title, subtitle, description, image_url, preview_url, repo_url, tags, sort_order, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      args: [title, subtitle, description, imageUrl, previewUrl, repoUrl, tags, sortOrder, isPublished ? 1 : 0]
    });

    return res.status(200).json({ ok: true, created: true });
  } catch (err) {
    console.error('Admin portfolio upsert error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

