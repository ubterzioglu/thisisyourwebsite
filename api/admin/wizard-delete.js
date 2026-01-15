import { turso } from '../../lib/tursoClient.js';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('admin_session=valid');
}

async function ensureWizardTable() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS wizard_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_slug TEXT NOT NULL UNIQUE,
      full_name TEXT,
      answers_json TEXT NOT NULL,
      long_text TEXT,
      attachments_json TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `);
  await turso.execute(`CREATE INDEX IF NOT EXISTS idx_wizard_public_slug ON wizard_submissions(public_slug);`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = req.body?.id !== undefined ? Number(req.body.id) : null;
  const slug = req.body?.slug ? String(req.body.slug).trim() : '';

  if ((!id || !Number.isInteger(id)) && !slug) {
    return res.status(400).json({ error: 'id or slug is required' });
  }

  try {
    await ensureWizardTable();
    if (slug) {
      await turso.execute({ sql: `DELETE FROM wizard_submissions WHERE public_slug = ?;`, args: [slug] });
    } else {
      await turso.execute({ sql: `DELETE FROM wizard_submissions WHERE id = ?;`, args: [id] });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Admin wizard delete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

