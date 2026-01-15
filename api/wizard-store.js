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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const publicSlug = String(body.public_slug || '').trim();
  const answers = body.answers ?? null;
  const fullName = String(body.full_name || '').trim() || null;
  const longText = typeof body.long_text === 'string' ? body.long_text : null;

  if (!publicSlug) {
    return res.status(400).json({ error: 'public_slug is required' });
  }
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'answers must be an object' });
  }

  try {
    await ensureWizardTable();

    const answersJson = JSON.stringify(answers);
    const attachmentsJson = null; // parked for now

    await turso.execute({
      sql: `
        INSERT INTO wizard_submissions (public_slug, full_name, answers_json, long_text, attachments_json)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(public_slug) DO UPDATE SET
          full_name = excluded.full_name,
          answers_json = excluded.answers_json,
          long_text = excluded.long_text,
          attachments_json = excluded.attachments_json,
          updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ','now'));
      `,
      args: [publicSlug, fullName, answersJson, longText, attachmentsJson]
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Wizard store error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

