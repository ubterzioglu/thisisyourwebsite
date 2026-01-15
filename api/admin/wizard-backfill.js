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

function parseBackfill(raw) {
  const text = String(raw || '');

  const slugMatch = text.match(/^\s*Slug:\s*([A-Za-z0-9_-]+)\s*$/mi);
  const slug = slugMatch?.[1] || '';

  const fullNameMatch = text.match(/^\s*Ad Soyad:\s*(.+)\s*$/mi);
  const fullName = (fullNameMatch?.[1] || '').trim();

  const photoMatch = text.match(/^\s*✅\s*Fotoğraf yüklendi:\s*(.+)\s*$/mi);
  const cvMatch = text.match(/^\s*✅\s*CV yüklendi:\s*(.+)\s*$/mi);
  // CV/Photo storage is intentionally "parked" for now (not persisted to DB).
  void photoMatch;
  void cvMatch;

  // Extract summary block
  let summaryText = '';
  const startIdx = text.search(/20\s*Soru\s*Özeti\s*:/i);
  if (startIdx >= 0) {
    const afterStart = text.slice(startIdx).split(/20\s*Soru\s*Özeti\s*:/i)[1] ?? '';
    const endSplit = afterStart.split(/Sizin\s*ek\s*istekleriniz\s*:/i);
    summaryText = (endSplit[0] || '').trim();
  }

  // Extract long text block
  let longText = '';
  const longIdx = text.search(/Sizin\s*ek\s*istekleriniz\s*:/i);
  if (longIdx >= 0) {
    longText = text.slice(longIdx).split(/Sizin\s*ek\s*istekleriniz\s*:/i)[1]?.trim() || '';
  }

  const answersJsonObject = {
    source: 'email_backfill',
    parsed_at: new Date().toISOString(),
    summary_text: summaryText,
    raw_email_text: text
  };

  return { slug, fullName, longText, answersJsonObject };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const rawText = String(req.body?.raw_text || '').trim();
  if (!rawText) {
    return res.status(400).json({ error: 'raw_text is required' });
  }

  const parsed = parseBackfill(rawText);
  if (!parsed.slug) {
    return res.status(400).json({ error: 'Slug not found in raw_text' });
  }

  try {
    await ensureWizardTable();

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
      args: [
        parsed.slug,
        parsed.fullName || null,
        JSON.stringify(parsed.answersJsonObject),
        parsed.longText || null,
        null
      ]
    });

    return res.status(200).json({ ok: true, slug: parsed.slug });
  } catch (err) {
    console.error('Admin wizard backfill error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

