import { turso } from '../lib/tursoClient.js';

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

  const slug = String(req.query?.slug || '').trim();
  if (!slug) {
    return res.status(400).json({ error: 'slug is required' });
  }

  try {
    await ensureWizardTable();
    const rs = await turso.execute({
      sql: `
        SELECT id, public_slug, full_name, answers_json, long_text, created_at, updated_at
        FROM wizard_submissions
        WHERE public_slug = ?
        LIMIT 1
      `,
      args: [slug]
    });

    const row = rs.rows?.[0];
    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }

    let answers = null;
    try {
      answers = row.answers_json ? JSON.parse(row.answers_json) : null;
    } catch {
      answers = null;
    }

    return res.status(200).json({
      id: row.id,
      full_name: row.full_name || null,
      created_at: row.created_at || null,
      updated_at: row.updated_at || null,
      long_text: row.long_text || null,
      answers: answers && typeof answers === 'object' ? answers : null
    });
  } catch (err) {
    console.error('Wizard public error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

