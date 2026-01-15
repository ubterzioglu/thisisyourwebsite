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

  const id = Number(req.body?.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    await turso.execute({ sql: `DELETE FROM status WHERE id = ?;`, args: [id] });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Admin status delete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

