// Wizard logic for 20 questions + long text
import { QUESTIONS, buildUserSummary } from './config/questions.js';

// Generate slug (base64url, browser-compatible)
function generateSlug() {
  const array = new Uint8Array(18);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

let currentStep = 0;
let answers = {};
let longText = '';
let publicSlug = null;
let photoFile = null;
let cvFile = null;

// Get slug from URL or generate new one
function getSlug() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (slug) return slug;
  
  // Generate new slug
  const newSlug = generateSlug();
  // Update URL without page reload
  window.history.replaceState({}, '', `?slug=${newSlug}`);
  return newSlug;
}

// Initialize wizard
function initWizard() {
  publicSlug = getSlug();
  renderQuestion();
  updateProgress();
}

// Render current question
function renderQuestion() {
  const container = document.getElementById('question-container');
  const totalSteps = QUESTIONS.length + 6; // 1 intro + 20 questions + 1 long text + 1 photo + 1 CV + 1 summary + 1 revision info
  const step = currentStep;
  
  // Intro step (step 0)
  if (step === 0) {
    container.innerHTML = `
      <h2 class="question-title">Kişisel Web Siteniz İçin Tasarım Tercihleri</h2>
      <div style="line-height: 1.8; color: #444; margin-bottom: 2rem;">
        <p style="margin-bottom: 1rem;">
          Bu form, CV'nizdeki bilgileri <strong>nasıl sunacağımızı</strong> belirlemek için hazırlanmıştır.
        </p>
        <p style="margin-bottom: 1rem;">
          İçerik sormuyoruz, sadece <strong>tasarım ve sunum tercihlerinizi</strong> alıyoruz.
        </p>
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem; border-radius: 8px; margin: 1.5rem 0;">
          <p style="margin: 0; font-weight: 600; color: #856404;">⚠️ Önemli:</p>
          <p style="margin: 0.5rem 0 0 0; color: #856404;">
            Bu formdaki sorular dışında <strong>ek soru sorulmayacak</strong>.<br>
            Yazı yazmak istersen, en sondaki <strong>Ek Notlar</strong> alanını kullanabilirsin.
          </p>
        </div>
        <p style="margin-top: 1.5rem; color: #666; font-size: 0.95rem;">
          Toplam <strong>20 soru</strong> + fotoğraf ve CV yükleme + özet sayfası
        </p>
      </div>
    `;
    return;
  }
  
  // Revision info step (after summary, before submit)
  if (step === QUESTIONS.length + 4) {
    container.innerHTML = `
      <h2 class="question-title">Revizyon Hakkınız</h2>
      <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 1rem; color: #1976d2; font-size: 1.25rem;">📝 3 Revizyon Hakkı</h3>
        <div style="line-height: 1.8; color: #444;">
          <p style="margin-bottom: 1rem;">
            Web siteniz hazır olduğunda, size özel bir <strong>revizyon linki</strong> göndereceğiz.
          </p>
          <p style="margin-bottom: 1rem;">
            Bu link üzerinden web sitenizde değişiklik yapmak istediğiniz noktaları belirtebilirsiniz.
          </p>
          <p style="margin: 0; font-weight: 600; color: #1976d2;">
            Toplam <strong>3 revizyon hakkınız</strong> bulunmaktadır.
          </p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 1.5rem;">
        <button id="reset-at-end" class="btn-nav btn-reset" style="margin-bottom: 1rem; display: inline-block;">🔄 Başa Dön</button>
        <p style="color: #666; margin-top: 1rem;">
          Formu göndermek için "Gönder" butonuna tıklayın.
        </p>
      </div>
    `;
    
    // Attach reset button event listener for end page
    setTimeout(() => {
      const resetBtn = document.getElementById('reset-at-end');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          resetWizard();
        });
      }
    }, 0);
    
    return;
  }
  
  // Summary step
  if (step === QUESTIONS.length + 3) {
    const userSummary = buildUserSummary(answers);
    container.innerHTML = `
      <h2 class="question-title">Özet</h2>
      <p style="margin-bottom: 1.5rem; color: #666;">
        Lütfen bilgilerinizi kontrol edin. Göndermek için "Gönder" butonuna tıklayın.
      </p>
      <div style="margin-bottom: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        ${photoFile ? '<div style="padding: 0.75rem 1.5rem; background: #d4edda; color: #155724; border-radius: 8px; font-weight: 600;">✅ Fotoğraf yüklendi!</div>' : ''}
        ${cvFile ? '<div style="padding: 0.75rem 1.5rem; background: #d4edda; color: #155724; border-radius: 8px; font-weight: 600;">✅ CV yüklendi!</div>' : ''}
      </div>
      <div style="background: #f9f9f9; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.25rem;">20 Soru Özeti:</h3>
        <div style="white-space: pre-line; line-height: 1.8; color: #444;">${userSummary || 'Özet bulunamadı'}</div>
      </div>
      ${longText ? `
        <div style="background: #fff3cd; border-radius: 12px; padding: 2rem; border-left: 4px solid #ffc107; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.25rem;">Sizin ek istekleriniz:</h3>
          <div style="white-space: pre-wrap; line-height: 1.8; color: #444;">${longText}</div>
        </div>
      ` : ''}
    `;
    return;
  }
  
  // CV upload step
  if (step === QUESTIONS.length + 2) {
    const fileSizeInfo = cvFile ? ` (${(cvFile.size / 1024 / 1024).toFixed(2)}MB)` : '';
    container.innerHTML = `
      <h2 class="question-title">CV Yükleme</h2>
      <p style="margin-bottom: 1rem; color: #666;">
        CV dosyanızı yükleyebilirsiniz (PDF tercihen, DOCX kabul edilir). İsteğe bağlıdır.
      </p>
      <p style="margin-bottom: 1.5rem; color: #ff9800; font-weight: 600; font-size: 0.9rem;">
        ⚠️ Maksimum dosya boyutu: 4MB
      </p>
      <input 
        type="file" 
        id="cv-input" 
        accept=".pdf,.docx,.doc"
        style="width: 100%; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 1rem;"
      />
      ${cvFile ? `<p style="margin-top: 1rem; color: #32cd32; font-weight: 600;">✅ ${cvFile.name}${fileSizeInfo}</p>` : ''}
    `;
    return;
  }
  
  // Photo upload step
  if (step === QUESTIONS.length + 1) {
    const fileSizeInfo = photoFile ? ` (${(photoFile.size / 1024 / 1024).toFixed(2)}MB)` : '';
    container.innerHTML = `
      <h2 class="question-title">Fotoğraf Yükleme</h2>
      <p style="margin-bottom: 1rem; color: #666;">
        Profil fotoğrafınızı yükleyebilirsiniz (JPG, PNG, WEBP). İsteğe bağlıdır.
      </p>
      <p style="margin-bottom: 1.5rem; color: #ff9800; font-weight: 600; font-size: 0.9rem;">
        ⚠️ Maksimum dosya boyutu: 4MB
      </p>
      <input 
        type="file" 
        id="photo-input" 
        accept="image/jpeg,image/png,image/webp"
        style="width: 100%; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 1rem;"
      />
      ${photoFile ? `<p style="margin-top: 1rem; color: #32cd32; font-weight: 600;">✅ ${photoFile.name}${fileSizeInfo}</p>` : ''}
    `;
    return;
  }
  
  // Long text step
  if (step === QUESTIONS.length) {
    container.innerHTML = `
      <h2 class="question-title">Ek Notlarınız</h2>
      <p style="margin-bottom: 1.5rem; color: #666;">
        Web siteniz hakkında eklemek istediğiniz notlar, özel istekler veya detaylar:
      </p>
      <textarea 
        id="long-text-input" 
        class="textarea-input" 
        placeholder="İsteğe bağlı olarak ek notlarınızı buraya yazabilirsiniz..."
      >${longText}</textarea>
    `;
    document.getElementById('long-text-input').value = longText;
    return;
  }
  
  const question = QUESTIONS[step - 1]; // step 0 is intro, so questions start from step 1
  let html = `<h2 class="question-title">${question.question}</h2>`;
  
  if (question.type === 'text') {
    html += `
      <input 
        type="text" 
        id="answer-input" 
        class="text-input" 
        value="${answers[question.id] || ''}"
        placeholder="Cevabınızı yazın..."
      />
    `;
  } else if (question.type === 'yesno') {
    html += `
      <div class="answer-options">
        <button class="option-button ${answers[question.id] === 'true' ? 'selected' : ''}" 
                data-value="true">
          Evet
        </button>
        <button class="option-button ${answers[question.id] === 'false' ? 'selected' : ''}" 
                data-value="false">
          Hayır
        </button>
      </div>
    `;
  } else if (question.type === 'single') {
    html += '<div class="answer-options">';
    question.options.forEach(option => {
      const selected = answers[question.id] === option ? 'selected' : '';
      html += `
        <button class="option-button ${selected}" data-value="${option}">
          ${option}
        </button>
      `;
    });
    html += '</div>';
  } else if (question.type === 'multi') {
    html += '<div class="answer-options">';
    const selectedValues = answers[question.id] || [];
    question.options.forEach(option => {
      const isSelected = Array.isArray(selectedValues) && selectedValues.includes(option);
      html += `
        <label class="option-checkbox ${isSelected ? 'selected' : ''}">
          <input type="checkbox" value="${option}" ${isSelected ? 'checked' : ''} />
          <span>${option}</span>
        </label>
      `;
    });
    html += '</div>';
  }
  
  container.innerHTML = html;
  
  // Attach event listeners
  attachEventListeners();
}

function attachEventListeners() {
  const step = currentStep;
  
  // Intro step - no input needed
  if (step === 0) {
    return;
  }
  
  // Revision info step - no input needed
  if (step === QUESTIONS.length + 4) {
    return;
  }
  
  // Summary step - no input needed
  if (step === QUESTIONS.length + 3) {
    return;
  }
  
  // CV upload step
  if (step === QUESTIONS.length + 2) {
    const input = document.getElementById('cv-input');
    if (input) {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0] || null;
        if (file) {
          // Dosya boyutu kontrolü: 4MB limit (Vercel Serverless Functions için)
          const maxSize = 4 * 1024 * 1024; // 4MB
          if (file.size > maxSize) {
            alert(`CV dosyası çok büyük! Maksimum dosya boyutu: 4MB\nSeçilen dosya: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            e.target.value = ''; // Dosya seçimini temizle
            cvFile = null;
          } else {
            cvFile = file;
          }
        } else {
          cvFile = null;
        }
        // Re-render to show file name
        renderQuestion();
      });
    }
    return;
  }
  
  // Photo upload step
  if (step === QUESTIONS.length + 1) {
    const input = document.getElementById('photo-input');
    if (input) {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0] || null;
        if (file) {
          // Dosya boyutu kontrolü: 4MB limit (Vercel Serverless Functions için)
          const maxSize = 4 * 1024 * 1024; // 4MB
          if (file.size > maxSize) {
            alert(`Fotoğraf dosyası çok büyük! Maksimum dosya boyutu: 4MB\nSeçilen dosya: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            e.target.value = ''; // Dosya seçimini temizle
            photoFile = null;
          } else {
            photoFile = file;
          }
        } else {
          photoFile = null;
        }
        // Re-render to show file name
        renderQuestion();
      });
    }
    return;
  }
  
  if (step === QUESTIONS.length) {
    // Long text step
    const input = document.getElementById('long-text-input');
    if (input) {
      input.addEventListener('input', (e) => {
        longText = e.target.value;
      });
    }
    return;
  }
  
  const question = QUESTIONS[step - 1]; // step 0 is intro, so questions start from step 1
  
  if (question.type === 'text') {
    const input = document.getElementById('answer-input');
    if (input) {
      input.value = answers[question.id] || '';
      input.addEventListener('input', (e) => {
        answers[question.id] = e.target.value;
      });
    }
  } else if (question.type === 'yesno' || question.type === 'single') {
    document.querySelectorAll('.option-button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[question.id] = btn.dataset.value;
        
        // Otomatik olarak bir sonraki soruya geç (kısa delay ile)
        const totalSteps = QUESTIONS.length + 6;
        if (currentStep < totalSteps - 1) {
          setTimeout(() => {
            currentStep++;
            renderQuestion();
            updateProgress();
          }, 400); // 400ms delay - kullanıcı seçimini görebilsin
        }
      });
    });
  } else if (question.type === 'multi') {
    document.querySelectorAll('.option-checkbox input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const selected = Array.from(document.querySelectorAll('.option-checkbox input[type="checkbox"]:checked'))
          .map(cb => cb.value);
        answers[question.id] = selected;
        
        // Update visual state
        document.querySelectorAll('.option-checkbox').forEach(label => {
          const cb = label.querySelector('input[type="checkbox"]');
          if (cb.checked) {
            label.classList.add('selected');
          } else {
            label.classList.remove('selected');
          }
        });
      });
    });
  }
}

function updateProgress() {
  const totalSteps = QUESTIONS.length + 6; // 1 intro + 20 questions + 1 long text + 1 photo + 1 CV + 1 summary + 1 revision info
  const progress = ((currentStep + 1) / totalSteps) * 100;
  document.getElementById('progress-fill').style.width = `${progress}%`;
  
  let progressText = '';
  if (currentStep === 0) {
    progressText = 'Başlangıç';
  } else if (currentStep === QUESTIONS.length) {
    progressText = 'Ek Notlar';
  } else if (currentStep === QUESTIONS.length + 1) {
    progressText = 'Fotoğraf Yükleme';
  } else if (currentStep === QUESTIONS.length + 2) {
    progressText = 'CV Yükleme';
  } else if (currentStep === QUESTIONS.length + 3) {
    progressText = 'Özet';
  } else if (currentStep === QUESTIONS.length + 4) {
    progressText = 'Revizyon Bilgisi';
  } else {
    progressText = `Soru ${currentStep} / ${QUESTIONS.length}`;
  }
  document.getElementById('progress-text').textContent = progressText;
  
  // Show/hide back and reset buttons
  document.getElementById('btn-back').style.display = currentStep > 0 ? 'block' : 'none';
  document.getElementById('btn-reset').style.display = currentStep > 0 ? 'block' : 'none';
  
  // Update next/finish button
  const nextBtn = document.getElementById('btn-next');
  if (currentStep === totalSteps - 1) {
    nextBtn.textContent = '📧 Gönder';
    nextBtn.className = 'btn-nav btn-finish';
  } else if (currentStep === 0) {
    nextBtn.textContent = 'Başla →';
    nextBtn.className = 'btn-nav btn-next';
  } else {
    nextBtn.textContent = 'İleri →';
    nextBtn.className = 'btn-nav btn-next';
  }
}

// Reset wizard function
function resetWizard() {
  if (confirm('Tüm cevaplarınız silinecek ve başa döneceksiniz. Emin misiniz?')) {
    currentStep = 0;
    answers = {};
    longText = '';
    photoFile = null;
    cvFile = null;
    
    // Generate new slug
    publicSlug = generateSlug();
    window.history.replaceState({}, '', `?slug=${publicSlug}`);
    
    renderQuestion();
    updateProgress();
  }
}

// Navigation
document.getElementById('btn-reset').addEventListener('click', () => {
  resetWizard();
});

document.getElementById('btn-back').addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    renderQuestion();
    updateProgress();
  }
});

document.getElementById('btn-next').addEventListener('click', async () => {
  const totalSteps = QUESTIONS.length + 6; // 1 intro + 20 questions + 1 long text + 1 photo + 1 CV + 1 summary + 1 revision info
  
  if (currentStep < totalSteps - 1) {
    // Validate current step (optional - allow skipping)
    currentStep++;
    renderQuestion();
    updateProgress();
  } else {
    // Finish: submit (on revision info page)
    await submitWizard();
  }
});

// Get content type from filename
function getContentTypeFromFilename(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const contentTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Submit wizard
async function submitWizard() {
  const btnNext = document.getElementById('btn-next');
  btnNext.disabled = true;
  btnNext.textContent = 'Gönderiliyor...';
  
  try {
    // Build summary
    const userSummary = buildUserSummary(answers);
    
    // Prepare attachments
    const attachments = [];
    const maxSize = 4 * 1024 * 1024; // 4MB limit (Vercel Serverless Functions için)
    
    // Convert photo to base64 if exists
    if (photoFile) {
      if (photoFile.size > maxSize) {
        throw new Error(`Fotoğraf dosyası çok büyük! Maksimum: 4MB, Seçilen: ${(photoFile.size / 1024 / 1024).toFixed(2)}MB`);
      }
      console.log('Converting photo to base64:', photoFile.name, photoFile.type, photoFile.size);
      const photoBase64 = await fileToBase64(photoFile);
      console.log('Photo base64 length:', photoBase64.length);
      attachments.push({
        filename: photoFile.name,
        content: photoBase64,
        contentType: photoFile.type || getContentTypeFromFilename(photoFile.name)
      });
    }
    
    // Convert CV to base64 if exists
    if (cvFile) {
      if (cvFile.size > maxSize) {
        throw new Error(`CV dosyası çok büyük! Maksimum: 4MB, Seçilen: ${(cvFile.size / 1024 / 1024).toFixed(2)}MB`);
      }
      console.log('Converting CV to base64:', cvFile.name, cvFile.type, cvFile.size);
      const cvBase64 = await fileToBase64(cvFile);
      console.log('CV base64 length:', cvBase64.length);
      attachments.push({
        filename: cvFile.name,
        content: cvBase64,
        contentType: cvFile.type || getContentTypeFromFilename(cvFile.name)
      });
    }
    
    console.log('Total attachments:', attachments.length);
    
    // Send email (wizard verilerini email olarak gönder)
    let emailBody = `Yeni Wizard Gönderimi\n\nSlug: ${publicSlug}\n\n`;
    if (photoFile) emailBody += `✅ Fotoğraf yüklendi: ${photoFile.name}\n`;
    if (cvFile) emailBody += `✅ CV yüklendi: ${cvFile.name}\n`;
    emailBody += `\n20 Soru Özeti:\n${userSummary || 'Özet bulunamadı'}\n\n`;
    const emailMessage = longText ? `${emailBody}Sizin ek istekleriniz:\n${longText}` : emailBody;
    
    const requestBody = {
      name: 'Wizard Form',
      email: 'wizard@thisisyour.website',
      subject: `Yeni Wizard Gönderimi - ${publicSlug}`,
      message: emailMessage,
      attachments: attachments
    };
    
    console.log('Sending request with attachments:', attachments.length);
    console.log('Request body size:', JSON.stringify(requestBody).length);
    
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Email gönderilemedi');
    }
    
    // Email başarıyla gönderildi
    alert('Formunuz başarıyla gönderildi! Teşekkürler.');
    
    // Redirect to result page (veya ana sayfaya)
    window.location.href = `result.html?slug=${publicSlug}`;
  } catch (error) {
    console.error('Submit error:', error);
    alert('Bir hata oluştu: ' + error.message + '\nLütfen tekrar deneyin.');
    btnNext.disabled = false;
    btnNext.textContent = '✅ Bitir';
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWizard);
} else {
  initWizard();
}
