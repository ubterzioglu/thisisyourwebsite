let isAdmin = false;
let queueItems = [];

// Check admin status
async function checkAdminStatus() {
  try {
    const response = await fetch('/api/admin/queue?admin=1', {
      credentials: 'include'
    });
    if (response.ok) {
      isAdmin = true;
      showAdminDashboard();
      loadQueue();
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
    alert('Sıra yüklenirken bir hata oluştu');
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
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.className = `theme-${savedTheme}`;
  themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';
  
  let currentTheme = savedTheme;
  themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = `theme-${newTheme}`;
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    currentTheme = newTheme;
  });
  
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
  
  // Close modal
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('item-modal').style.display = 'none';
  });
  
  // Check admin status on load
  checkAdminStatus();
});
