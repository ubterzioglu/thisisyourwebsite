async function loadPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="loading">Yükleniyor...</div>';

  const borderPalette = [
    '#00A8FF', // blue
    '#32CD32', // green
    '#FF9500', // orange
    '#9D4EDD', // purple
    '#FFD700', // yellow
    '#ff4d6d', // pink-red
    '#00c2a8'  // teal
  ];

  const pickBorderColor = (seed) => {
    const s = String(seed ?? '');
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
    const idx = Math.abs(h) % borderPalette.length;
    return borderPalette[idx];
  };

  try {
    const res = await fetch('/api/portfolio');
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Portfolio yüklenemedi');

    const items = data.items || [];
    if (!items.length) {
      grid.innerHTML = '<p style="text-align:center;">Henüz portfolyo öğesi yok.</p>';
      return;
    }

    grid.innerHTML = '';
    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'card portfolio-card';
      card.style.borderColor = pickBorderColor(item.id || item.title);

      const title = item.title || '';
      const subtitle = item.subtitle || '';
      const desc = item.description || '';
      const img = item.image_url || '';
      const url = item.preview_url || '';
      const tagsRaw = (item.tags || '').trim();
      const tags = tagsRaw
        ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean).slice(0, 6)
        : [];

      // Special case for 'Kasım Hanik' to get a different random image
      let seedRaw = title || 'placeholder';
      if (typeof seedRaw === 'string' && seedRaw.toLowerCase().includes('kasım hanik')) {
        seedRaw += '-v2';
      }
      const seed = encodeURIComponent(seedRaw);
      const placeholderUrl = `https://picsum.photos/seed/${seed}/600/400`;
      const imageHtml = img
        ? `<img class="portfolio-cover" src="${img}" alt="${title}" loading="lazy" />`
        : `<img class="portfolio-cover" src="${placeholderUrl}" alt="${title}" loading="lazy" />`;

      const tagsHtml = tags.length
        ? `<div class="portfolio-tags">${tags.map(t => `<span class="portfolio-tag">${t}</span>`).join('')}</div>`
        : '';

      const linkHtml = url
        ? `<a class="portfolio-link" href="${url}" target="_blank" rel="noopener noreferrer">Sayfaya Git →</a>`
        : `<span class="portfolio-link disabled">Link yok</span>`;

      card.innerHTML = `
        ${imageHtml}
        <div class="portfolio-body">
          <p class="portfolio-name">${title}</p>
          ${subtitle ? `<p class="portfolio-subtitle">${subtitle}</p>` : ''}
          ${desc ? `<p class="portfolio-desc">${desc}</p>` : ''}
          ${tagsHtml}
          <div class="portfolio-actions">
            ${linkHtml}
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (e) {
    console.error('Portfolio load error:', e);
    grid.innerHTML = `<p style="text-align:center;">Portfolyo yüklenemedi: ${e.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPortfolio();
});

