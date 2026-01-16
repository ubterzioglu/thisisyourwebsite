import { turso } from '../lib/tursoClient.js';

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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const qRaw = String(req.query?.q || '').trim();
  if (qRaw.length < 2) {
    return res.status(200).json({ results: [], hint: 'En az 2 karakter yazın.' });
  }

  try {
    const q = normalizeTrForSearch(qRaw);

    // Turkish-insensitive search for common letters (ı/i, ü/u, ş/s, ğ/g, ç/c, ö/o)
    // We normalize DB values via nested REPLACE + LOWER (SQLite doesn't have built-in TR collation).
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
        SELECT id, full_name, status, updated_at
        FROM status
        WHERE ${normalizedFullNameSql} LIKE '%' || ? || '%'
        ORDER BY updated_at DESC
        LIMIT 10
      `,
      args: [q]
    });

    const results = (rs.rows || []).map((row) => ({
      id: row.id,
      masked_name: maskName(row.full_name),
      status: statusLabel(row.status),
      updated_at: row.updated_at || null
    }));

    return res.status(200).json({ results });
  } catch (err) {
    console.error('Status search error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

