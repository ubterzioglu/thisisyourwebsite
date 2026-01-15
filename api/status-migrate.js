import { turso } from '../lib/tursoClient.js';

// One-time migration endpoint for Turso (create status table + seed demo rows)
// Protect with STATUS_MIGRATE_SECRET (env)
export default async function handler(req, res) {
  const secretEnv = process.env.STATUS_MIGRATE_SECRET;
  const provided =
    (req.headers['x-migrate-secret'] || req.headers['x-migration-secret'] || '').toString() ||
    (req.query?.secret || '').toString();

  if (!secretEnv) {
    return res.status(500).json({ error: 'STATUS_MIGRATE_SECRET is missing' });
  }

  if (!provided || provided !== secretEnv) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Create table + index
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        status INTEGER NOT NULL CHECK (status BETWEEN 1 AND 5),
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );
    `);

    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_status_full_name ON status(full_name);
    `);

    // Seed only if empty
    const countRs = await turso.execute(`SELECT COUNT(1) AS c FROM status;`);
    const c = Number(countRs.rows?.[0]?.c ?? 0);
    if (c === 0) {
      const seeds = [
        ['Ahmet Yılmaz', 1],
        ['Elif Kaya', 2],
        ['Mehmet Demir', 3],
        ['Zeynep Şahin', 4],
        ['Mert Çelik', 5],
        ['Ayşe Arslan', 1],
        ['Can Öztürk', 2],
        ['Deniz Koç', 3],
        ['Ece Aydın', 4],
        ['Burak Kılıç', 5]
      ];

      for (const [fullName, status] of seeds) {
        await turso.execute({
          sql: `INSERT INTO status (full_name, status) VALUES (?, ?);`,
          args: [fullName, status]
        });
      }
    }

    return res.status(200).json({
      ok: true,
      seeded: c === 0,
      existing_rows_before: c
    });
  } catch (err) {
    console.error('Status migrate error:', err);
    return res.status(500).json({ error: 'Migration failed', details: err.message });
  }
}

