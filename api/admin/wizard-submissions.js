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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await ensureWizardTable();

    const rs = await turso.execute({
      sql: `
        SELECT id, public_slug, full_name, created_at, updated_at
        FROM wizard_submissions
        ORDER BY updated_at DESC
        LIMIT 200
      `,
      args: []
    });

    return res.status(200).json({ rows: rs.rows || [] });
  } catch (err) {
    console.error('Admin wizard submissions list error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

