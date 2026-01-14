let token = null;
let formConfig = null;

// Form configuration - 20 questions
const getFormConfig = () => ({
  questions: [
    // Yes/No Questions (5)
    { id: 'q1', type: 'boolean', label: 'Profesyonel bir fotoğrafınız var mı?' },
    { id: 'q2', type: 'boolean', label: 'İletişim formu istiyor musunuz?' },
    { id: 'q3', type: 'boolean', label: 'Sosyal medya bağlantıları eklenmeli mi?' },
    { id: 'q4', type: 'boolean', label: 'Portföyünüz var mı?' },
    { id: 'q5', type: 'boolean', label: 'Referanslar eklenmeli mi?' },
    
    // Single Choice (5)
    { id: 'q6', type: 'single', label: 'Ana sektör', options: [
      { value: 'tech', label: 'Teknoloji' },
      { value: 'design', label: 'Tasarım' },
      { value: 'marketing', label: 'Pazarlama' },
      { value: 'education', label: 'Eğitim' },
      { value: 'other', label: 'Diğer' }
    ]},
    { id: 'q7', type: 'single', label: 'Tercih edilen renk paleti', options: [
      { value: 'minimal', label: 'Minimal (Siyah/Beyaz)' },
      { value: 'vibrant', label: 'Canlı' },
      { value: 'pastel', label: 'Pastel' }
    ]},
    { id: 'q8', type: 'single', label: 'İçerik odağı', options: [
      { value: 'services', label: 'Hizmetler' },
      { value: 'portfolio', label: 'Portföy' },
      { value: 'about', label: 'Hakkımda' }
    ]},
    { id: 'q9', type: 'single', label: 'Üslup', options: [
      { value: 'professional', label: 'Profesyonel' },
      { value: 'friendly', label: 'Samimi' },
      { value: 'creative', label: 'Yaratıcı' }
    ]},
    { id: 'q10', type: 'single', label: 'Çağrı tipi', options: [
      { value: 'contact', label: 'İletişime Geçin' },
      { value: 'view', label: 'Portföyü Görüntüle' },
      { value: 'hire', label: 'Beni İşe Alın' }
    ]},
    
    // Multi Choice (4)
    { id: 'q11', type: 'multi', label: 'Öne çıkarılacak beceriler', options: [
      { value: 'coding', label: 'Kodlama' },
      { value: 'design', label: 'UI/UX Tasarımı' },
      { value: 'writing', label: 'İçerik Yazımı' },
      { value: 'strategy', label: 'Strateji' },
      { value: 'leadership', label: 'Liderlik' }
    ]},
    { id: 'q12', type: 'multi', label: 'Sosyal platformlar', options: [
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'twitter', label: 'Twitter/X' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'github', label: 'GitHub' }
    ]},
    { id: 'q13', type: 'multi', label: 'İçerik bölümleri', options: [
      { value: 'about', label: 'Hakkımda' },
      { value: 'experience', label: 'Deneyim' },
      { value: 'projects', label: 'Projeler' },
      { value: 'contact', label: 'İletişim' }
    ]},
    { id: 'q14', type: 'multi', label: 'Diller (web sitesi için)', options: [
      { value: 'tr', label: 'Türkçe' },
      { value: 'en', label: 'İngilizce' }
    ]},
    
    // Short Text (5)
    { id: 'q15', type: 'text', label: 'Ad Soyad' },
    { id: 'q16', type: 'text', label: 'Profesyonel Unvan' },
    { id: 'q17', type: 'text', label: 'E-posta' },
    { id: 'q18', type: 'text', label: 'Konum' },
    { id: 'q19', type: 'text', label: 'Şu Anki Şirket (varsa)' },
    
    // Long Text (1)
    { id: 'q20', type: 'textarea', label: 'Profesyonel Özet ve Hakkınızda' }
  ]
});

// Generate form HTML
function generateFormHTML(config) {
  return config.questions.map(q => {
    switch(q.type) {
      case 'boolean':
        return `
          <div class="form-group">
            <label>${q.label}</label>
            <div class="radio-group">
              <label><input type="radio" name="${q.id}" value="true" required> Evet</label>
              <label><input type="radio" name="${q.id}" value="false" required> Hayır</label>
            </div>
          </div>
        `;
        
      case 'single':
        const singleOptions = q.options.map(opt => 
          `<option value="${opt.value}">${opt.label}</option>`
        ).join('');
        return `
          <div class="form-group">
            <label>${q.label}</label>
            <select name="${q.id}" required>
              <option value="">Seçiniz...</option>
              ${singleOptions}
            </select>
          </div>
        `;
        
      case 'multi':
        const multiOptions = q.options.map(opt => 
          `<label><input type="checkbox" name="${q.id}" value="${opt.value}"> ${opt.label}</label>`
        ).join('');
        return `
          <div class="form-group">
            <label>${q.label}</label>
            <div class="checkbox-group">
              ${multiOptions}
            </div>
          </div>
        `;
        
      case 'text':
        return `
          <div class="form-group">
            <label>${q.label}</label>
            <input type="${q.id === 'q17' ? 'email' : 'text'}" name="${q.id}" required />
          </div>
        `;
        
      case 'textarea':
        return `
          <div class="form-group">
            <label>${q.label}</label>
            <textarea name="${q.id}" required placeholder="Kendinizi, kariyerinizi, deneyimlerinizi ve hedeflerinizi kısaca anlatın..."></textarea>
          </div>
        `;
        
      default:
        return '';
    }
  }).join('');
}

// Validate token and load form
async function validateToken() {
  const urlParams = new URLSearchParams(window.location.search);
  token = urlParams.get('token');
  
  if (!token) {
    document.getElementById('form-loading').textContent = 'Geçersiz token';
    return;
  }
  
  try {
    const response = await fetch(`/api/apply/validate?token=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Geçersiz token');
    
    const data = await response.json();
    if (!data.valid) throw new Error('Geçersiz token');
    
    formConfig = getFormConfig();
    
    // Inject form
    document.getElementById('form-fields').innerHTML = generateFormHTML(formConfig);
    document.getElementById('form-loading').style.display = 'none';
    document.getElementById('apply-form').style.display = 'block';
  } catch (error) {
    document.getElementById('form-loading').textContent = 'Geçersiz veya süresi dolmuş token. Lütfen doğru linki kullandığınızdan emin olun.';
    console.error('Token validation error:', error);
  }
}

// Submit form
async function submitForm(formData) {
  const answers = {};
  
  // Process form data
  for (let [key, value] of formData.entries()) {
    if (answers[key]) {
      // Handle multi-select
      if (Array.isArray(answers[key])) {
        answers[key].push(value);
      } else {
        answers[key] = [answers[key], value];
      }
    } else {
      answers[key] = value;
    }
  }
  
  try {
    const response = await fetch('/api/apply/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, answers })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Gönderim başarısız');
    }
    
    const result = await response.json();
    
    // Show thank you screen
    document.getElementById('apply-form').style.display = 'none';
    document.getElementById('thank-you').style.display = 'block';
    
    // Set summary
    document.getElementById('summary-text').textContent = result.customer_summary_tr;
    
    // Copy button
    document.getElementById('copy-summary').onclick = () => {
      const text = result.customer_summary_tr;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copy-summary');
        const originalText = btn.textContent;
        btn.textContent = 'Kopyalandı!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      });
    };
    
  } catch (error) {
    alert('Gönderim başarısız: ' + error.message);
    console.error(error);
  }
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
  
  // Form submission
  document.getElementById('apply-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    submitForm(formData);
  });
  
  // Validate token
  validateToken();
});
