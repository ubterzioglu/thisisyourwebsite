function isAuthenticated(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('admin_session=valid');
}

export default async function handler(req, res) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ ok: false });
  }
  return res.status(200).json({ ok: true });
}

