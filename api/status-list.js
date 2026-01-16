import { turso } from '../lib/tursoClient.js';
import { ensureStatusTable } from '../lib/ensureStatusTable.js';

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

function safeHttpUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) return null;
  return /^https?:\/\//i.test(raw) ? raw : null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await ensureStatusTable();
    const rs = await turso.execute({
      sql: `
        SELECT id, full_name, site_url, status, updated_at
        FROM status
        ORDER BY updated_at DESC
        LIMIT 200
      `,
      args: []
    });

    const results = (rs.rows || []).map((row) => ({
      id: row.id,
      masked_name: maskName(row.full_name),
      status: statusLabel(row.status),
      site_url: safeHttpUrl(row.site_url),
      updated_at: row.updated_at || null
    }));

    return res.status(200).json({ results });
  } catch (err) {
    console.error('Status list error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

