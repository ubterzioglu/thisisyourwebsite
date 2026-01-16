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
  await turso.execute(`CREATE INDEX IF NOT EXISTS idx_wizard_full_name ON wizard_submissions(full_name);`);
}

function normalizeTrForSearch(input) {
  return String(input || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .toLowerCase();
}

function maskName(displayName) {
  const raw = String(displayName || '').trim();
  if (!raw) return '';
  const parts = raw.split(/\s+/).filter(Boolean);
  const maskPart = (p) => {
    const first = p.substring(0, 1);
    return `${first}*****`;
  };
  if (parts.length === 1) return maskPart(parts[0]);
  return `${maskPart(parts[0])} ${maskPart(parts[parts.length - 1])}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const qRaw = String(req.query?.q || '').trim();
  if (qRaw.length < 2) {
    return res.status(200).json({ results: [], hint: 'En az 2 karakter yazın.' });
  }

  try {
    await ensureWizardTable();
    const q = normalizeTrForSearch(qRaw);

    const normalizedFullNameSql =
      `lower(` +
      `replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(` +
      `full_name,` +
      `'İ','i'),` +
      `'I','i'),` +
      `'ı','i'),` +
      `'Ş','s'),` +
      `'ş','s'),` +
      `'Ğ','g'),` +
      `'ğ','g'),` +
      `'Ü','u'),` +
      `'ü','u'),` +
      `'Ö','o'),` +
      `'ö','o')` +
      `)` +
      `)`;

    const rs = await turso.execute({
      sql: `
        SELECT id, public_slug, full_name, updated_at
        FROM wizard_submissions
        WHERE full_name IS NOT NULL
          AND ${normalizedFullNameSql} LIKE '%' || ? || '%'
        ORDER BY updated_at DESC
        LIMIT 10
      `,
      args: [q]
    });

    const results = (rs.rows || []).map((row) => ({
      id: row.id,
      masked_name: maskName(row.full_name),
      slug: row.public_slug,
      updated_at: row.updated_at || null
    }));

    return res.status(200).json({ results });
  } catch (err) {
    console.error('Wizard search error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

