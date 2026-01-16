import { turso } from '../lib/tursoClient.js';
import { ensureStatusTable } from '../lib/ensureStatusTable.js';

function normalizeTrForSearch(input) {
  return String(input || '')
    .trim()
    // Normalize diacritics (ü -> u, ş -> s, etc.)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Turkish dotless i
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

function statusLabel(status) {
  const n = Number(status);
  switch (n) {
    case 0:
      return 'Sıradasın! Yakında seninle iletişime geçeceğiz!';
    case 1:
      return 'Yorum yapıldı sıra bizde! Mesaj atacağız!';
    case 2:
      return 'Mesaj atıldı formu doldurman gerekiyor!';
    case 3:
      return 'Formu doldurdun siteni oluşturuyoruz!';
    case 4:
      return 'Siten hazır. Revizyon isteği bekleniyor.';
    case 5:
      return 'Her şey tamamlandı! Hayırlı olsun!';
    default:
      return 'Bilinmiyor';
  }
}

function safeSiteUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('/')) return raw;
  if (/^[a-z0-9._-]+\.html$/i.test(raw)) return raw;
  return null;
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
    // Best-effort schema ensure; do not fail the request if this throws.
    await ensureStatusTable().catch(() => {});

    // Detect if column exists; if not, query without it (prevents "no such column" 500s).
    let hasSiteUrl = false;
    try {
      const cols = await turso.execute(`PRAGMA table_info(status);`);
      hasSiteUrl = (cols.rows || []).some((r) => String(r.name) === 'site_url');
    } catch {}

    const q = normalizeTrForSearch(qRaw);

    // Robust approach: fetch a capped set and filter in JS (TR-insensitive).
    const rs = await turso.execute({
      sql: `
        SELECT id, full_name, ${hasSiteUrl ? 'site_url,' : ''} status, updated_at
        FROM status
        ORDER BY updated_at DESC
        LIMIT 500
      `,
      args: []
    });

    const results = (rs.rows || [])
      .filter((row) => normalizeTrForSearch(row.full_name).includes(q))
      .slice(0, 10)
      .map((row) => ({
        id: row.id,
        masked_name: maskName(row.full_name),
        status: statusLabel(row.status),
        site_url: safeSiteUrl(hasSiteUrl ? row.site_url : null),
        updated_at: row.updated_at || null
      }));

    return res.status(200).json({ results });
  } catch (err) {
    console.error('Status search error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

