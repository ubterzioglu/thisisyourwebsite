import { turso } from '../lib/tursoClient.js';

// One-time migration endpoint for Turso (create status table + seed demo rows)
// Protect with STATUS_MIGRATE_SECRET (env)
export default async function handler(req, res) {
  const secretEnv = process.env.STATUS_MIGRATE_SECRET;
  const provided =
    (req.headers['x-migrate-secret'] || req.headers['x-migration-secret'] || '').toString() ||
    (req.query?.secret || '').toString();
  const replace =
    String(req.query?.replace || '').toLowerCase() === '1' ||
    String(req.query?.replace || '').toLowerCase() === 'true';

  if (!secretEnv) {
    return res.status(500).json({ error: 'STATUS_MIGRATE_SECRET is missing' });
  }

  if (!provided || provided !== secretEnv) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // If replace=1, drop and recreate the table to ensure CHECK constraint supports 0..5
    // (SQLite cannot alter CHECK constraints in-place reliably).
    if (replace) {
      await turso.execute(`DROP TABLE IF EXISTS status;`);
    }

    // Create table + index
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        site_url TEXT,
        status INTEGER NOT NULL CHECK (status BETWEEN 0 AND 5),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );
    `);

    // If table existed before this change, add the column safely (SQLite supports ADD COLUMN).
    try {
      const cols = await turso.execute(`PRAGMA table_info(status);`);
      const hasSiteUrl = (cols.rows || []).some((r) => String(r.name) === 'site_url');
      if (!hasSiteUrl) {
        await turso.execute(`ALTER TABLE status ADD COLUMN site_url TEXT;`);
      }
    } catch (e) {
      console.warn('status migrate: site_url ensure failed (non-fatal):', e);
    }

    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_status_full_name ON status(full_name);
    `);

    // Seed only if empty
    const countRs = await turso.execute(`SELECT COUNT(1) AS c FROM status;`);
    const c = Number(countRs.rows?.[0]?.c ?? 0);
    const seeds = [
      ['Akın Özkan', 0],
      ['Aydın Serhat Onay', 0],
      ['Ahmet Şengül', 0],
      ['Duygu Yılmaz Hancılar', 0],
      ['Habil Kaynak', 0],
      ['Serdar Güven', 0],
      ['Ömer Sakarya', 0],
      ['Halil İbrahim Bayezit', 0],
      ['Begüm Kodalak Bilik', 0],
      ['Kasım Hanik', 0],
      ['Evrim Eriş', 0],
      ['Yusuf Yalçınkaya', 0],
      ['Yusuf Altan', 0],
      ['Uğur Aşcı', 0],
      ['Mehmet Coşkun', 0],
      ['Fatih Uslu', 0],
      ['Veysel Cenk Karakuz', 0],
      ['Alpaslan Arınç', 0],
      ['Oğuzhan Dirice', 0],
      ['Nazli Kocak', 0]
    ];

    let replaced = false;
    if (replace) replaced = true;

    const shouldSeed = replaced || c === 0;
    if (shouldSeed) {
      for (const [fullName, status] of seeds) {
        await turso.execute({
          sql: `INSERT INTO status (full_name, status) VALUES (?, ?);`,
          args: [fullName, status]
        });
      }
    }

    return res.status(200).json({
      ok: true,
      seeded: (replace || c === 0),
      replaced,
      existing_rows_before: c,
      inserted_rows: (replace || c === 0) ? seeds.length : 0
    });
  } catch (err) {
    console.error('Status migrate error:', err);
    return res.status(500).json({ error: 'Migration failed', details: err.message });
  }
}

