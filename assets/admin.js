let isAdmin = false;
let queueItems = [];
let statusRows = [];
let wizardRows = [];
let portfolioRows = [];
let wizardQuestionsCache = null;

async function loadWizardQuestionMap() {
  if (wizardQuestionsCache) return wizardQuestionsCache;
  try {
    const res = await fetch('/config/questions.map.json', { cache: 'no-store' });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) throw new Error('Bad response');
    wizardQuestionsCache = data;
    return wizardQuestionsCache;
  } catch (e) {
    console.warn('Wizard question map load failed:', e);
    wizardQuestionsCache = { order: [], labels: {} };
    return wizardQuestionsCache;
  }
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatAnswerValue(v) {
  if (Array.isArray(v)) return v.filter(Boolean).join(', ');
  if (v === true) return 'Evet';
  if (v === false) return 'Hayır';
  if (v === 'true') return 'Evet';
  if (v === 'false') return 'Hayır';
  if (v === null || v === undefined) return '';
  return String(v);
}

// Check admin status
async function checkAdminStatus() {
  try {
    const response = await fetch('/api/admin/ping', {
      credentials: 'include'
    });
    if (response.ok) {
      isAdmin = true;
      showAdminDashboard();
      // Queue endpoints may be optional; keep best-effort
      loadQueue();
      loadStatus();
      loadWizardSubmissions();
      loadPortfolio();
    }
  } catch (error) {
    console.log('Giriş yapılmamış');
  }
}

// Login
async function login(password) {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      credentials: 'include'
    });
    
    if (response.ok) {
      isAdmin = true;
      showAdminDashboard();
      loadQueue();
      loadStatus();
      loadWizardSubmissions();
      loadPortfolio();
    } else {
      const errorEl = document.getElementById('login-error');
      errorEl.textContent = 'Geçersiz şifre';
      errorEl.style.display = 'block';
    }
  } catch (error) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = 'Giriş başarısız';
    errorEl.style.display = 'block';
  }
}

async function loadPortfolio() {
  try {
    const response = await fetch('/api/admin/portfolio', { credentials: 'include' });
    if (!response.ok) throw new Error('Portfolio listesi alınamadı');
    const data = await response.json().catch(() => ({}));
    portfolioRows = data?.rows || [];
    renderPortfolioTable();
  } catch (e) {
    console.error('Portfolio load error:', e);
    const tbody = document.getElementById('portfolio-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Portfolyo yüklenemedi.</td></tr>';
    }
  }
}

function renderPortfolioTable() {
  const tbody = document.getElementById('portfolio-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!portfolioRows.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Kayıt yok.</td></tr>';
    return;
  }

  portfolioRows.forEach((r) => {
    const tr = document.createElement('tr');
    const isPub = Number(r.is_published) === 1 ? '✅' : '—';
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.title || ''}</td>
      <td>${isPub}</td>
      <td>${Number(r.sort_order ?? 0)}</td>
      <td>${r.updated_at ? new Date(r.updated_at).toLocaleString('tr-TR') : '-'}</td>
      <td>
        <button class="btn secondary portfolio-edit-btn" data-id="${r.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Düzenle</button>
        <button class="btn secondary portfolio-delete-btn" data-id="${r.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-left: 0.5rem;">Sil</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.portfolio-edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const row = portfolioRows.find(x => Number(x.id) === id);
      if (!row) return;
      document.getElementById('portfolio-id').value = row.id;
      document.getElementById('portfolio-title').value = row.title || '';
      document.getElementById('portfolio-subtitle').value = row.subtitle || '';
      document.getElementById('portfolio-description').value = row.description || '';
      document.getElementById('portfolio-image-url').value = row.image_url || '';
      document.getElementById('portfolio-preview-url').value = row.preview_url || '';
      document.getElementById('portfolio-tags').value = row.tags || '';
      document.getElementById('portfolio-sort-order').value = String(Number(row.sort_order ?? 0));
      document.getElementById('portfolio-published').checked = Number(row.is_published) === 1;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.portfolio-delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      const row = portfolioRows.find(x => Number(x.id) === id);
      const label = row?.title ? `${row.title} (ID ${id})` : `ID ${id}`;
      if (!confirm(`Bu portfolyo kaydını silmek istiyor musun?\n\n${label}`)) return;
      try {
        const res = await fetch('/api/admin/portfolio-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Silme başarısız');
        await loadPortfolio();
      } catch (e) {
        alert('Silme başarısız: ' + e.message);
      }
    });
  });
}

async function upsertPortfolio() {
  const id = document.getElementById('portfolio-id').value || null;
  const title = (document.getElementById('portfolio-title').value || '').trim();
  const subtitle = (document.getElementById('portfolio-subtitle').value || '').trim();
  const description = (document.getElementById('portfolio-description').value || '').trim();
  const image_url = (document.getElementById('portfolio-image-url').value || '').trim();
  const preview_url = (document.getElementById('portfolio-preview-url').value || '').trim();
  const tags = (document.getElementById('portfolio-tags').value || '').trim();
  const sort_order = Number(document.getElementById('portfolio-sort-order').value || 0);
  const is_published = document.getElementById('portfolio-published').checked ? 1 : 0;

  if (!title) {
    alert('Başlık gerekli');
    return;
  }

  try {
    const response = await fetch('/api/admin/portfolio-upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id,
        title,
        subtitle,
        description,
        image_url,
        preview_url,
        tags,
        sort_order,
        is_published
      })
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Kaydetme başarısız');
    }
    clearPortfolioForm();
    await loadPortfolio();
  } catch (e) {
    console.error('Portfolio upsert error:', e);
    alert('Kaydetme başarısız: ' + e.message);
  }
}

function clearPortfolioForm() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('portfolio-id', '');
  set('portfolio-title', '');
  set('portfolio-subtitle', '');
  set('portfolio-description', '');
  set('portfolio-image-url', '');
  set('portfolio-preview-url', '');
  set('portfolio-tags', '');
  set('portfolio-sort-order', '0');
  const cb = document.getElementById('portfolio-published');
  if (cb) cb.checked = false;
}

// Logout
async function logout() {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });
    isAdmin = false;
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('admin-password').value = '';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Show admin dashboard
function showAdminDashboard() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'block';
  document.getElementById('logout-btn').style.display = 'block';
}

function getStatusTextV2(n) {
  const v = Number(n);
  switch (v) {
    case 0: return '0 - Sıradasın! Yakında seninle iletişime geçeceğiz!';
    case 1: return '1 - Yorum yapıldı sıra bizde! Mesaj atacağız!';
    case 2: return '2 - Mesaj atıldı formu doldurman gerekiyor!';
    case 3: return '3 - Formu doldurdun siteni oluşturuyoruz!';
    case 4: return '4 - Siten hazır. Revizyon isteği bekleniyor.';
    case 5: return '5 - Her şey tamamlandı! Hayırlı olsun!';
    default: return String(n ?? '');
  }
}

async function loadStatus() {
  try {
    const response = await fetch('/api/admin/status', { credentials: 'include' });
    if (!response.ok) throw new Error('Status listesi alınamadı');
    const data = await response.json();
    statusRows = data?.rows || [];
    renderStatusTable();
  } catch (e) {
    console.error('Status load error:', e);
    const tbody = document.getElementById('status-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Status yüklenemedi.</td></tr>';
    }
  }
}

async function loadWizardSubmissions() {
  try {
    const response = await fetch('/api/admin/wizard-submissions', { credentials: 'include' });
    if (!response.ok) throw new Error('Wizard listesi alınamadı');
    const data = await response.json();
    wizardRows = data?.rows || [];
    renderWizardTable();
  } catch (e) {
    console.error('Wizard load error:', e);
    const tbody = document.getElementById('wizard-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Wizard kayıtları yüklenemedi.</td></tr>';
    }
  }
}

function renderWizardTable() {
  const tbody = document.getElementById('wizard-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!wizardRows.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Kayıt yok.</td></tr>';
    return;
  }

  wizardRows.forEach((r) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.id}</td>
      <td><code style="font-weight:800;">${r.public_slug || ''}</code></td>
      <td>${r.full_name || '-'}</td>
      <td>${r.updated_at ? new Date(r.updated_at).toLocaleString('tr-TR') : '-'}</td>
      <td>
        <button class="btn secondary wizard-detail-btn" data-id="${r.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Detay</button>
        <button class="btn secondary wizard-delete-btn" data-id="${r.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-left: 0.5rem;">Sil</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.wizard-detail-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      await viewWizardSubmission(id);
    });
  });

  document.querySelectorAll('.wizard-delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      const row = wizardRows.find(x => Number(x.id) === id);
      const label = row?.full_name ? `${row.full_name} (${row.public_slug || ''})` : (row?.public_slug || `ID ${id}`);
      if (!confirm(`Bu wizard kaydını silmek istiyor musun?\n\n${label}`)) return;
      try {
        const res = await fetch('/api/admin/wizard-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Silme başarısız');
        await loadWizardSubmissions();
      } catch (e) {
        alert('Silme başarısız: ' + e.message);
      }
    });
  });
}

async function viewWizardSubmission(id) {
  const modal = document.getElementById('item-modal');
  const titleEl = document.getElementById('modal-title');
  const contentEl = document.getElementById('modal-content');
  if (!modal || !titleEl || !contentEl) return;

  titleEl.textContent = 'Wizard Detayı';
  contentEl.innerHTML = `<div class="loading">Yükleniyor...</div>`;
  modal.style.display = 'block';

  try {
    const res = await fetch(`/api/admin/wizard-submission?id=${encodeURIComponent(String(id))}`, { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Detay alınamadı');
    const row = data.row || {};

    let answersObj = null;
    try { answersObj = row.answers_json ? JSON.parse(row.answers_json) : null; } catch {}

    const longText = row.long_text || '';
    const qmap = await loadWizardQuestionMap();
    const labels = qmap?.labels || {};
    const order = Array.isArray(qmap?.order) ? qmap.order : [];

    const renderAnswersHuman = (answers) => {
      if (!answers || typeof answers !== 'object') return 'yok';
      const seen = new Set();
      const lines = [];

      const pushKey = (k) => {
        if (!Object.prototype.hasOwnProperty.call(answers, k)) return;
        seen.add(k);
        const questionText = labels[k] || k;
        const val = formatAnswerValue(answers[k]);
        if (!val) return;
        lines.push(
          `<div style="padding:0.6rem 0.75rem; border:1px solid rgba(255,149,0,0.22); border-radius:12px; background: rgba(255,149,0,0.06);">` +
          `<div style="font-weight:800; margin-bottom:0.25rem;">${escapeHtml(questionText)}</div>` +
          `<div style="opacity:0.95;">${escapeHtml(val)}</div>` +
          `</div>`
        );
      };

      order.forEach(pushKey);
      Object.keys(answers).forEach((k) => { if (!seen.has(k)) pushKey(k); });

      return lines.length
        ? `<div style="display:grid; gap:0.6rem;">${lines.join('')}</div>`
        : 'yok';
    };

    contentEl.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr; gap: 0.75rem;">
        <div><strong>ID:</strong> ${row.id}</div>
        <div><strong>Slug:</strong> <code>${row.public_slug || ''}</code></div>
        <div><strong>Ad Soyad:</strong> ${row.full_name || '-'}</div>
        <div><strong>Created:</strong> ${row.created_at ? new Date(row.created_at).toLocaleString('tr-TR') : '-'}</div>
        <div><strong>Updated:</strong> ${row.updated_at ? new Date(row.updated_at).toLocaleString('tr-TR') : '-'}</div>
        <div><strong>Ek Notlar:</strong> <pre style="white-space: pre-wrap; background:#000; color:#fff; padding:1rem; border-radius:12px; overflow:auto;">${longText || 'yok'}</pre></div>
        <div><strong>Cevaplar:</strong> ${renderAnswersHuman(answersObj)}</div>
      </div>
    `;
  } catch (e) {
    contentEl.innerHTML = `<div class="status error" style="display:block;">Hata: ${e.message}</div>`;
  }
}

function renderStatusTable() {
  const tbody = document.getElementById('status-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!statusRows.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Kayıt yok.</td></tr>';
    return;
  }

  statusRows.forEach((r) => {
    const tr = document.createElement('tr');
    const link = r.site_url ? String(r.site_url) : '';
    const linkCell = link
      ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="color:#FF9500; font-weight:800;">☑️</a>`
      : '—';
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.full_name}</td>
      <td style="text-align:center;">${linkCell}</td>
      <td>${getStatusTextV2(r.status)}</td>
      <td>${r.updated_at ? new Date(r.updated_at).toLocaleString('tr-TR') : '-'}</td>
      <td>
        <button class="btn secondary status-edit-btn" data-id="${r.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Düzenle</button>
        <button class="btn secondary status-delete-btn" data-id="${r.id}" style="padding: 0.5rem 1rem; font-size: 0.9rem; margin-left: 0.5rem;">Sil</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.status-edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const row = statusRows.find(x => Number(x.id) === id);
      if (!row) return;
      document.getElementById('status-id').value = row.id;
      document.getElementById('status-full-name').value = row.full_name || '';
      document.getElementById('status-site-url').value = row.site_url || 'portfolio.html';
      document.getElementById('status-value').value = String(row.status ?? 0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.status-delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      const row = statusRows.find(x => Number(x.id) === id);
      const label = row?.full_name ? `${row.full_name} (ID ${id})` : `ID ${id}`;
      if (!confirm(`Bu status kaydını silmek istiyor musun?\n\n${label}`)) return;
      try {
        const res = await fetch('/api/admin/status-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ id })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Silme başarısız');
        await loadStatus();
      } catch (e) {
        alert('Silme başarısız: ' + e.message);
      }
    });
  });
}

async function upsertStatus() {
  const id = document.getElementById('status-id').value || null;
  const fullName = (document.getElementById('status-full-name').value || '').trim();
  const siteUrl = (document.getElementById('status-site-url')?.value || '').trim();
  const statusVal = Number(document.getElementById('status-value').value || 1);
  if (!fullName) {
    alert('Ad Soyad gerekli');
    return;
  }
  try {
    const response = await fetch('/api/admin/status-upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, full_name: fullName, site_url: siteUrl || null, status: statusVal })
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Kaydetme başarısız');
    }
    clearStatusForm();
    await loadStatus();
  } catch (e) {
    console.error('Status upsert error:', e);
    alert('Kaydetme başarısız: ' + e.message);
  }
}

function clearStatusForm() {
  document.getElementById('status-id').value = '';
  document.getElementById('status-full-name').value = '';
  const su = document.getElementById('status-site-url');
  if (su) su.value = 'portfolio.html';
  document.getElementById('status-value').value = '0';
}

// Load queue items
async function loadQueue() {
  try {
    const response = await fetch('/api/admin/queue?admin=1', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        isAdmin = false;
        showLogin();
        return;
      }
      // Queue endpoints may not be deployed (this project migrated away from Supabase queue).
      // In that case: don't block admin panel with popups.
      if (response.status === 404) {
        const tbody = document.getElementById('queue-table-body');
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Sıra (queue) şu an kapalı / aktif değil.</td></tr>';
        }
        return;
      }
      throw new Error('Sıra yüklenemedi');
    }
    
    queueItems = await response.json();
    
    const tbody = document.getElementById('queue-table-body');
    tbody.innerHTML = '';
    
    if (queueItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Henüz sıra öğesi yok.</td></tr>';
      return;
    }
    
    queueItems.forEach(item => {
      const row = document.createElement('tr');
      
      const statusOptions = ['INVITED', 'SUBMITTED', 'IN_PROGRESS', 'DELIVERED']
        .map(s => `<option value="${s}" ${item.status === s ? 'selected' : ''}>${getStatusText(s)}</option>`)
        .join('');
      
      const consentOptions = ['PUBLIC', 'ANONYMIZED', 'PRIVATE']
        .map(c => `<option value="${c}" ${item.consent_showcase === c ? 'selected' : ''}>${getConsentText(c)}</option>`)
        .join('');
      
      row.innerHTML = `
        <td><input type="number" value="${item.order_index}" style="width: 60px; padding: 0.5rem;" data-id="${item.id}" data-field="order_index" /></td>
        <td><input type="text" value="${item.display_name || ''}" style="width: 150px; padding: 0.5rem;" data-id="${item.id}" data-field="display_name" /></td>
        <td><input type="text" value="${item.display_role || ''}" style="width: 120px; padding: 0.5rem;" data-id="${item.id}" data-field="display_role" /></td>
        <td>
          <select style="padding: 0.5rem;" data-id="${item.id}" data-field="status">
            ${statusOptions}
          </select>
        </td>
        <td>
          <select style="padding: 0.5rem;" data-id="${item.id}" data-field="consent_showcase">
            ${consentOptions}
          </select>
        </td>
        <td>
          <button class="btn secondary view-btn" data-id="${item.id}" style="margin-right: 0.5rem; padding: 0.5rem 1rem; font-size: 0.9rem;">Detay</button>
          <button class="btn secondary link-btn" data-token="${item.token}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Link</button>
        </td>
      `;
      
      tbody.appendChild(row);
    });
    
    // Add event listeners for inline editing
    tbody.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const field = e.target.dataset.field;
        const value = e.target.value;
        updateQueueItem(id, { [field]: value });
      });
    });
    
    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => viewItem(btn.dataset.id));
    });
    
    // Link buttons
    document.querySelectorAll('.link-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const token = btn.dataset.token;
        const url = `${window.location.origin}/apply.html?token=${token}`;
        navigator.clipboard.writeText(url);
        btn.textContent = 'Kopyalandı!';
        setTimeout(() => {
          btn.textContent = 'Link';
        }, 2000);
      });
    });
  } catch (error) {
    console.error('Sıra yükleme hatası:', error);
    // Keep admin usable; avoid noisy popups.
    const tbody = document.getElementById('queue-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Sıra yüklenemedi.</td></tr>';
    }
  }
}

function getStatusText(status) {
  const statuses = {
    'INVITED': 'Davet Edildi',
    'SUBMITTED': 'Gönderildi',
    'IN_PROGRESS': 'Devam Ediyor',
    'DELIVERED': 'Teslim Edildi'
  };
  return statuses[status] || status;
}

function getConsentText(consent) {
  const consents = {
    'PUBLIC': 'Herkese Açık',
    'ANONYMIZED': 'Anonim',
    'PRIVATE': 'Gizli'
  };
  return consents[consent] || consent;
}

// Update queue item
async function updateQueueItem(id, updates) {
  try {
    const response = await fetch('/api/admin/queue/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Güncelleme başarısız');
    
    // Reload queue
    await loadQueue();
  } catch (error) {
    console.error('Güncelleme hatası:', error);
    alert('Güncelleme başarısız');
  }
}

// Create new queue item
async function createQueueItem() {
  const name = prompt('Görünen İsim:');
  if (!name) return;
  
  const role = prompt('Rol (opsiyonel):') || null;
  const consent = confirm('Herkese açık showcase\'de gösterilsin mi?') 
    ? (confirm('Anonim olarak mı gösterilsin?') ? 'ANONYMIZED' : 'PUBLIC')
    : 'PRIVATE';
  
  try {
    const response = await fetch('/api/admin/queue/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        display_name: name, 
        display_role: role, 
        consent_showcase: consent 
      }),
      credentials: 'include'
    });
    
    if (response.ok) {
      loadQueue();
    } else {
      alert('Oluşturma başarısız');
    }
  } catch (error) {
    alert('Oluşturma başarısız');
    console.error(error);
  }
}

// View item details
async function viewItem(id) {
  const item = queueItems.find(i => i.id === id);
  if (!item) return;
  
  const modal = document.getElementById('item-modal');
  const modalContent = document.getElementById('modal-content');
  
  modalContent.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h3>Genel Bilgiler</h3>
      <p><strong>İsim:</strong> ${item.display_name}</p>
      <p><strong>Rol:</strong> ${item.display_role || '-'}</p>
      <p><strong>Durum:</strong> ${getStatusText(item.status)}</p>
      <p><strong>Token:</strong> <code>${item.token}</code></p>
    </div>
  `;
  
  // Load submission if exists
  try {
    const response = await fetch(`/api/admin/submission?id=${id}`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      const submission = await response.json();
      
      modalContent.innerHTML += `
        <div style="margin-bottom: 1.5rem;">
          <h3>Gönderim Detayları</h3>
          <p><strong>Gönderim Tarihi:</strong> ${new Date(submission.submitted_at).toLocaleString('tr-TR')}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <h3>Müşteri Özeti</h3>
          <div style="background: var(--card-bg-light); padding: 1rem; border-radius: 8px; white-space: pre-wrap;">
            ${submission.customer_summary_tr || 'Özet henüz oluşturulmamış'}
          </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <h3>AI JSON Payload</h3>
          <button id="copy-ai-json" class="btn secondary" style="margin-bottom: 0.5rem;">AI JSON'u Kopyala</button>
          <pre style="background: var(--card-bg-light); padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.9rem;">
${JSON.stringify(submission.ai_payload_json, null, 2)}
          </pre>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <h3>Ham Cevaplar</h3>
          <pre style="background: var(--card-bg-light); padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.9rem;">
${JSON.stringify(submission.answers_json, null, 2)}
          </pre>
        </div>
      `;
      
      document.getElementById('copy-ai-json').addEventListener('click', () => {
        navigator.clipboard.writeText(JSON.stringify(submission.ai_payload_json, null, 2));
        const btn = document.getElementById('copy-ai-json');
        const originalText = btn.textContent;
        btn.textContent = 'Kopyalandı!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      });
    }
  } catch (error) {
    modalContent.innerHTML += '<p>Gönderim bulunamadı.</p>';
  }
  
  // Delivery section
  if (item.status === 'DELIVERED' || item.status === 'IN_PROGRESS') {
    modalContent.innerHTML += `
      <div style="margin-bottom: 1.5rem;">
        <h3>Teslimat Bilgileri</h3>
        <div class="form-group">
          <label>Site URL:</label>
          <input type="text" id="site-url" value="${item.site_url || ''}" style="width: 100%; padding: 0.5rem;" />
        </div>
        <div class="form-group">
          <label>Repo URL (opsiyonel):</label>
          <input type="text" id="repo-url" value="${item.repo_url || ''}" style="width: 100%; padding: 0.5rem;" />
        </div>
        <button id="save-delivery" class="btn primary">Teslimat Bilgilerini Kaydet</button>
      </div>
    `;
    
    document.getElementById('save-delivery').addEventListener('click', async () => {
      const siteUrl = document.getElementById('site-url').value;
      const repoUrl = document.getElementById('repo-url').value;
      
      await updateQueueItem(id, { 
        site_url: siteUrl,
        repo_url: repoUrl,
        status: 'DELIVERED'
      });
      
      modal.style.display = 'none';
      loadQueue();
    });
  }
  
  modal.style.display = 'block';
}

// Show login
function showLogin() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const ADMIN_CLASS = 'admin-orange';
  const savedTheme = localStorage.getItem('admin_theme') || 'dark';

  const applyTheme = (theme) => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    document.body.classList.add(ADMIN_CLASS);
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  };
  
  let currentTheme = savedTheme;
  themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('admin_theme', newTheme);
    currentTheme = newTheme;
  });

  applyTheme(savedTheme);
  
  // Login button
  document.getElementById('login-btn').addEventListener('click', () => {
    const password = document.getElementById('admin-password').value;
    if (password) {
      login(password);
    }
  });
  
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', logout);
  
  // Create item button
  document.getElementById('create-item-btn').addEventListener('click', createQueueItem);

  // Portfolio buttons
  const portfolioSaveBtn = document.getElementById('portfolio-save-btn');
  const portfolioClearBtn = document.getElementById('portfolio-clear-btn');
  if (portfolioSaveBtn) portfolioSaveBtn.addEventListener('click', upsertPortfolio);
  if (portfolioClearBtn) portfolioClearBtn.addEventListener('click', clearPortfolioForm);

  // Status buttons
  const statusSaveBtn = document.getElementById('status-save-btn');
  const statusClearBtn = document.getElementById('status-clear-btn');
  if (statusSaveBtn) statusSaveBtn.addEventListener('click', upsertStatus);
  if (statusClearBtn) statusClearBtn.addEventListener('click', clearStatusForm);

  // Wizard backfill (paste old email content -> store)
  const backfillBtn = document.getElementById('wizard-backfill-btn');
  const backfillClear = document.getElementById('wizard-backfill-clear');
  const backfillInput = document.getElementById('wizard-backfill-input');
  if (backfillClear && backfillInput) {
    backfillClear.addEventListener('click', () => {
      backfillInput.value = '';
    });
  }
  if (backfillBtn && backfillInput) {
    backfillBtn.addEventListener('click', async () => {
      const rawText = (backfillInput.value || '').trim();
      if (!rawText) {
        alert('Mail içeriğini yapıştır.');
        return;
      }
      backfillBtn.disabled = true;
      const oldText = backfillBtn.textContent;
      backfillBtn.textContent = 'Kaydediliyor...';
      try {
        const res = await fetch('/api/admin/wizard-backfill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ raw_text: rawText })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Kaydetme başarısız');
        backfillInput.value = '';
        await loadWizardSubmissions();
        alert(`Kaydedildi: ${data.slug || 'ok'}`);
      } catch (e) {
        alert('Hata: ' + e.message);
      } finally {
        backfillBtn.disabled = false;
        backfillBtn.textContent = oldText || 'Mail’den Kaydet';
      }
    });
  }
  
  // Close modal
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('item-modal').style.display = 'none';
  });
  
  // Check admin status on load
  checkAdminStatus();
});
