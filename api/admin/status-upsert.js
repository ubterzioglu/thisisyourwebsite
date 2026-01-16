import { turso } from '../../lib/tursoClient.js';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('admin_session=valid');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id, full_name, status, site_url } = req.body || {};
  const fullName = String(full_name || '').trim();
  const s = Number(status);
  const rawUrl = typeof site_url === 'string' ? site_url.trim() : '';
  const siteUrl = rawUrl && /^https?:\/\//i.test(rawUrl) ? rawUrl : null;

  if (!fullName) {
    return res.status(400).json({ error: 'full_name is required' });
  }
  if (!Number.isInteger(s) || s < 0 || s > 5) {
    return res.status(400).json({ error: 'status must be 0..5' });
  }

  try {
    if (id) {
      await turso.execute({
        sql: `UPDATE status SET full_name = ?, site_url = ?, status = ?, updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ','now')) WHERE id = ?;`,
        args: [fullName, siteUrl, s, Number(id)]
      });
      return res.status(200).json({ ok: true, updated: true });
    }

    await turso.execute({
      sql: `INSERT INTO status (full_name, site_url, status) VALUES (?, ?, ?);`,
      args: [fullName, siteUrl, s]
    });
    return res.status(200).json({ ok: true, created: true });
  } catch (err) {
    console.error('Admin status upsert error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

