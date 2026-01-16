import { turso } from '../../lib/tursoClient.js';

function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('admin_session=valid');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const rs = await turso.execute({
      sql: `
        SELECT id, full_name, site_url, status, created_at, updated_at
        FROM status
        ORDER BY updated_at DESC
        LIMIT 200
      `,
      args: []
    });
    return res.status(200).json({ rows: rs.rows || [] });
  } catch (err) {
    console.error('Admin status list error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

