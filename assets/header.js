// Shared compact header + menu (off-canvas) for all pages except home.
// Injects markup + behaviors; relies on CSS in assets/styles.css.

function isHomePath(pathname) {
  const p = String(pathname || '/');
  return p === '/' || p.endsWith('/index.html') || p.endsWith('\\index.html');
}

function isEnPath(pathname) {
  return String(pathname || '').includes('/en/');
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildMenuItems({ isEn }) {
  // Keep this small + high-signal; menu should not feel like it "takes over" the page.
  if (isEn) {
    return [
      { label: 'Home', href: 'index.html' },
      { label: 'Where am I?', href: 'welcome.html' },
      { label: 'I want a page!', href: 'yes.html' },
      { label: 'Check status', href: 'status.html' },
      { label: 'See the process', href: 'progress.html' },
      { label: 'Portfolio', href: 'portfolio.html' },
      { label: 'Contact', href: 'contact.html' },
      { label: 'Why?', href: 'why.html' }
    ];
  }

  return [
    { label: 'Ana Sayfa', href: 'index.html' },
    { label: 'Burası neresi?', href: 'welcome.html' },
    { label: 'Sayfa istiyorum!', href: 'yes.html' },
    { label: 'Durum Sorgula', href: 'status.html' },
    { label: 'Süreci Gör', href: 'progress.html' },
    { label: 'Portfolyo', href: 'portfolio.html' },
    { label: 'İletişim', href: 'contact.html' },
    { label: 'Neden?', href: 'why.html' }
  ];
}

function injectHeader() {
  const pathname = window.location.pathname || '';
  if (isHomePath(pathname)) return;

  const isEn = isEnPath(pathname);
  const items = buildMenuItems({ isEn });

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <a class="site-header__brand" href="${isEn ? 'index.html' : 'index.html'}">
        ${escapeHtml('This is your website!')}
      </a>

      <button
        type="button"
        class="site-header__menu-btn"
        id="site-menu-open"
        aria-label="${escapeHtml(isEn ? 'Open menu' : 'Menüyü aç')}"
        aria-controls="site-menu-panel"
        aria-expanded="false"
      >Menü</button>
    </div>

    <div class="site-menu" id="site-menu" aria-hidden="true">
      <button type="button" class="site-menu__backdrop" id="site-menu-backdrop" tabindex="-1" aria-hidden="true"></button>

      <aside class="site-menu__panel" id="site-menu-panel" role="dialog" aria-modal="false" aria-label="${escapeHtml(isEn ? 'Menu' : 'Menü')}">
        <div class="site-menu__top">
          <button type="button" class="site-menu__close" id="site-menu-close">
            ${escapeHtml(isEn ? 'Close menu' : 'Menüyü Kapat')}
          </button>
        </div>

        <nav class="site-menu__nav" aria-label="${escapeHtml(isEn ? 'Site navigation' : 'Site menüsü')}">
          ${items
            .map(
              (it) => `
                <a class="site-menu__link" href="${escapeHtml(it.href)}">${escapeHtml(it.label)}</a>
              `
            )
            .join('')}
        </nav>
      </aside>
    </div>
  `;

  document.body.classList.add('with-site-header');
  document.body.insertBefore(header, document.body.firstChild);

  const menuRoot = header.querySelector('#site-menu');
  const openBtn = header.querySelector('#site-menu-open');
  const closeBtn = header.querySelector('#site-menu-close');
  const backdropBtn = header.querySelector('#site-menu-backdrop');

  const setOpen = (open) => {
    menuRoot.dataset.open = open ? '1' : '0';
    menuRoot.setAttribute('aria-hidden', open ? 'false' : 'true');
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open) {
      // Focus close for easy keyboard escape.
      setTimeout(() => closeBtn?.focus?.(), 0);
    }
  };

  const isOpen = () => menuRoot?.dataset?.open === '1';

  openBtn?.addEventListener('click', () => setOpen(!isOpen()));
  closeBtn?.addEventListener('click', () => setOpen(false));
  backdropBtn?.addEventListener('click', () => setOpen(false));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      setOpen(false);
      openBtn?.focus?.();
    }
  });

  // Close menu when navigating within the menu.
  header.querySelectorAll('.site-menu__link').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectHeader);
} else {
  injectHeader();
}

