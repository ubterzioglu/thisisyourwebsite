async function loadPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="loading">Yükleniyor...</div>';

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

      const title = item.title || '';
      const subtitle = item.subtitle || '';
      const desc = item.description || '';
      const img = item.image_url || '';
      const url = item.preview_url || '';
      const tagsRaw = (item.tags || '').trim();
      const tags = tagsRaw
        ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean).slice(0, 6)
        : [];

      const imageHtml = img
        ? `<img class="portfolio-cover" src="${img}" alt="${title}" loading="lazy" />`
        : `<div class="portfolio-cover placeholder"></div>`;

      const tagsHtml = tags.length
        ? `<div class="portfolio-tags">${tags.map(t => `<span class="portfolio-tag">${t}</span>`).join('')}</div>`
        : '';

      const linkHtml = url
        ? `<a class="portfolio-link" href="${url}" target="_blank" rel="noopener noreferrer">Preview →</a>`
        : `<span class="portfolio-link disabled">Preview yok</span>`;

      card.innerHTML = `
        ${imageHtml}
        <div class="portfolio-body">
          <h3 class="portfolio-title">${title}</h3>
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

