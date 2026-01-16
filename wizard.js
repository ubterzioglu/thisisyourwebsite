// Wizard logic for 20 questions + long text
import { QUESTIONS, buildUserSummary } from './config/questions.js';

// Format summary with bold labels
function formatSummaryWithBold(summary) {
  if (!summary) return '';
  return summary.split('\n').map(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const label = line.substring(0, colonIndex);
      const value = line.substring(colonIndex);
      return `<div style="margin-bottom: 0.5rem;"><strong>${label}</strong>${value}</div>`;
    }
    return `<div style="margin-bottom: 0.5rem;">${line}</div>`;
  }).join('');
}

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
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB per file
const MAX_TOTAL_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB total
const INTRO_STEP = 0;
const PHOTO_STEP = QUESTIONS.length + 1;
const CV_STEP = QUESTIONS.length + 2;
const LONG_TEXT_STEP = QUESTIONS.length + 3;
const SUMMARY_STEP = QUESTIONS.length + 4;
const TOTAL_STEPS = QUESTIONS.length + 5;

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
  const step = currentStep;
  
  // Color palette: blue, green, orange, purple, yellow
  const colors = ['#00A8FF', '#32CD32', '#FF9500', '#9D4EDD', '#FFD700'];
  
  // Reset container class - will be set per step
  container.className = 'question-card';
  
  // Intro step (step 0)
  if (step === INTRO_STEP) {
    container.className = 'question-card intro-card';
    container.innerHTML = `
      <h2 class="question-title intro-title" style="font-weight: 700; font-size: 0.9rem; margin-bottom: 1rem;">Kişisel Web Siteniz İçin Tasarım Tercihleri</h2>
      <div style="line-height: 1.6; color: #444; margin-bottom: 1rem; font-size: 0.9rem;">
        <p style="margin-bottom: 0.75rem; font-weight: normal;">
          Toplam Süre: 3 dk
        </p>
        <p style="margin-bottom: 0.75rem; font-weight: normal;">
          Bu form, kişisel web sayfanızın tasarımını şekillendirmek için hazırlanmıştır.
        </p>
        <p style="margin-bottom: 0.75rem; font-weight: normal;">
          İçerik sormuyoruz, sadece tasarım ve sunum tercihlerinizi alıyoruz.
        </p>
        <p style="margin-bottom: 0.75rem; font-weight: normal;">
          Bu formdaki sorular dışında ek soru sorulmayacaktır.
        </p>
        <p style="margin-bottom: 0.75rem; font-weight: normal;">
          İletmek istediğin notlar için en sondaki "Ek Notlar" alanını kullanabilirsiniz.
        </p>
        <p style="margin-top: 1rem; color: #666; font-weight: normal;">
          Toplam ${QUESTIONS.length} soru + Fotoğraf ve CV Yükleme + Sizden Ek Notlar
        </p>
      </div>
    `;
    return;
  }
  
  // Summary step
  if (step === SUMMARY_STEP) {
    const summaryColorIndex = (QUESTIONS.length + 4) % colors.length;
    const summaryBorderColor = colors[summaryColorIndex];
    container.style.border = `3px solid ${summaryBorderColor}`;
    const userSummary = buildUserSummary(answers);
    container.innerHTML = `
      <p style="margin-bottom: 1.5rem; color: #666;">
        Lütfen bilgilerinizi kontrol edin. Göndermek için "Gönder" butonuna tıklayın.
      </p>
      <div style="margin-bottom: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        ${photoFile ? '<div style="padding: 0.75rem 1.5rem; background: #d4edda; color: #155724; border-radius: 8px; font-weight: 600;">✅ Fotoğraf yüklendi!</div>' : ''}
        ${cvFile ? '<div style="padding: 0.75rem 1.5rem; background: #d4edda; color: #155724; border-radius: 8px; font-weight: 600;">✅ CV yüklendi!</div>' : ''}
      </div>
      <div style="background: #f9f9f9; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
        <div style="line-height: 1.8; color: #444;">${formatSummaryWithBold(userSummary) || 'Özet bulunamadı'}</div>
      </div>
      ${longText ? `
        <div style="background: #e3f2fd; border-radius: 12px; padding: 2rem; border-left: 4px solid #00A8FF; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 0.9rem; font-weight: 700;">Sizin ek istekleriniz:</h3>
          <div style="white-space: pre-wrap; line-height: 1.8; color: #444;">${longText}</div>
        </div>
      ` : `
        <div style="background: #f9f9f9; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 0.9rem; font-weight: 700;">Ek Notlar:</h3>
          <div style="color: #999; font-style: italic;">Ek not eklenmedi.</div>
        </div>
      `}
      <div style="background: #e6f4ea; border-radius: 12px; padding: 2rem; border-left: 4px solid #32CD32; margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 1rem; color: #333; font-size: 0.9rem; font-weight: 700;">3 Revizyon Hakkı</h3>
        <div style="line-height: 1.8; color: #444;">
          <p style="margin-bottom: 1rem;">
            Web siteniz hazır olduğunda, aşağıdaki linki kullanarak bize revizyon talebinde bulunabilirsiniz.
          </p>
          <p style="margin-bottom: 1rem;">
            Web sayfanızda değişiklik yapmak istediğiniz noktaları belirtebilirsiniz.
          </p>
          <p style="margin-bottom: 1rem; font-weight: 600;">
            Toplam <strong>3 revizyon hakkınız</strong> bulunmaktadır.
          </p>
          <a href="revision.html?slug=${publicSlug}" style="display: inline-block; padding: 0.5rem 0.9rem; background: white; color: #333; border: 2px solid #32CD32; border-radius: 10px; font-weight: 600; font-size: 0.85rem; text-decoration: none;">
            🔗 Revizyon Linki
          </a>
        </div>
      </div>
    `;
    return;
  }
  
  // CV upload step
  if (step === CV_STEP) {
    const cvColorIndex = (QUESTIONS.length + 2) % colors.length;
    const cvBorderColor = colors[cvColorIndex];
    container.style.border = `3px solid ${cvBorderColor}`;
    const fileSizeInfo = cvFile ? ` (${(cvFile.size / 1024 / 1024).toFixed(2)}MB)` : '';
    container.innerHTML = `
      <h2 class="question-title">CV Yükleme</h2>
      <p style="margin-bottom: 1rem; color: #666;">
        CV dosyanızı yükleyebilirsiniz (PDF tercihen, DOCX kabul edilir). İsteğe bağlıdır.
      </p>
      <p style="margin-bottom: 1.5rem; color: #ff9800; font-weight: 600; font-size: 0.9rem;">
        ⚠️ Maksimum dosya boyutu: 2MB (toplam 3MB)
      </p>
      <div class="file-upload">
        <input 
          type="file" 
          id="cv-input" 
          class="file-input-hidden"
          accept=".pdf,.docx,.doc"
        />
        <label for="cv-input" class="file-button" style="border-color: ${cvBorderColor};">
          📎 Dosya Seç
        </label>
        <span class="file-name">${cvFile ? `${cvFile.name}${fileSizeInfo}` : 'Dosya seçilmedi'}</span>
      </div>
    `;
    // Attach event listener immediately after rendering
    setTimeout(() => {
      const input = document.getElementById('cv-input');
      if (input) {
        input.addEventListener('change', (e) => {
          console.log('CV file input changed!', e.target.files);
          const file = e.target.files[0] || null;
          if (file) {
            console.log('CV file selected:', file.name, file.size);
            if (file.size > MAX_FILE_SIZE_BYTES) {
              alert(`CV dosyası çok büyük! Maksimum dosya boyutu: 2MB\nSeçilen dosya: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
              e.target.value = '';
              cvFile = null;
            } else if ((photoFile ? photoFile.size : 0) + file.size > MAX_TOTAL_FILE_SIZE_BYTES) {
              alert('Toplam dosya boyutu 3MB limitini aşıyor. Lütfen daha küçük dosyalar seçin.');
              e.target.value = '';
              cvFile = null;
            } else {
              cvFile = file;
              console.log('CV file assigned to cvFile variable:', cvFile.name);
            }
          } else {
            cvFile = null;
            console.log('CV file cleared');
          }
          renderQuestion();
        });
      }
    }, 0);
    return;
  }
  
  // Photo upload step
  if (step === PHOTO_STEP) {
    const photoColorIndex = (QUESTIONS.length + 1) % colors.length;
    const photoBorderColor = colors[photoColorIndex];
    container.style.border = `3px solid ${photoBorderColor}`;
    const fileSizeInfo = photoFile ? ` (${(photoFile.size / 1024 / 1024).toFixed(2)}MB)` : '';
    container.innerHTML = `
      <h2 class="question-title">Fotoğraf Yükleme</h2>
      <p style="margin-bottom: 1rem; color: #666;">
        Profil fotoğrafınızı yükleyebilirsiniz (JPG, PNG, WEBP). İsteğe bağlıdır.
      </p>
      <p style="margin-bottom: 1.5rem; color: #ff9800; font-weight: 600; font-size: 0.9rem;">
        ⚠️ Maksimum dosya boyutu: 2MB (toplam 3MB)
      </p>
      <div class="file-upload">
        <input 
          type="file" 
          id="photo-input" 
          class="file-input-hidden"
          accept="image/jpeg,image/png,image/webp"
        />
        <label for="photo-input" class="file-button" style="border-color: ${photoBorderColor};">
          📎 Dosya Seç
        </label>
        <span class="file-name">${photoFile ? `${photoFile.name}${fileSizeInfo}` : 'Dosya seçilmedi'}</span>
      </div>
    `;
    // Attach event listener immediately after rendering
    setTimeout(() => {
      const input = document.getElementById('photo-input');
      if (input) {
        input.addEventListener('change', (e) => {
          console.log('Photo file input changed!', e.target.files);
          const file = e.target.files[0] || null;
          if (file) {
            console.log('Photo file selected:', file.name, file.size);
            if (file.size > MAX_FILE_SIZE_BYTES) {
              alert(`Fotoğraf dosyası çok büyük! Maksimum dosya boyutu: 2MB\nSeçilen dosya: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
              e.target.value = '';
              photoFile = null;
            } else if (file.size + (cvFile ? cvFile.size : 0) > MAX_TOTAL_FILE_SIZE_BYTES) {
              alert('Toplam dosya boyutu 3MB limitini aşıyor. Lütfen daha küçük dosyalar seçin.');
              e.target.value = '';
              photoFile = null;
            } else {
              photoFile = file;
              console.log('Photo file assigned to photoFile variable:', photoFile.name);
            }
          } else {
            photoFile = null;
            console.log('Photo file cleared');
          }
          renderQuestion();
        });
      }
    }, 0);
    return;
  }
  
  // Long text step
  if (step === LONG_TEXT_STEP) {
    const longTextColorIndex = (QUESTIONS.length + 3) % colors.length;
    const longTextBorderColor = colors[longTextColorIndex];
    container.style.border = `3px solid ${longTextBorderColor}`;
    container.innerHTML = `
      <h2 class="question-title">Ek Notlarınız</h2>
      <p style="margin-bottom: 1.5rem; color: #666;">
        Web siteniz hakkında eklemek istediğiniz notlar, özel istekler veya detaylar:
      </p>
      <textarea 
        id="long-text-input" 
        class="textarea-input" 
        placeholder="İsteğe bağlı olarak ek notlarınızı buraya yazabilirsiniz..."
        style="border-color: ${longTextBorderColor}; background-color: white;"
      >${longText}</textarea>
    `;
    const input = document.getElementById('long-text-input');
    if (input) {
      // Ensure value is set and persisted across renders
      input.value = longText;
      input.addEventListener('input', (e) => {
        longText = e.target.value;
      });
    }
    return;
  }
  
  // Check if step is within questions range
  if (step < 1 || step > QUESTIONS.length) {
    console.error('Invalid step for question:', step, 'QUESTIONS.length:', QUESTIONS.length);
    return;
  }
  
  const question = QUESTIONS[step - 1]; // step 0 is intro, so questions start from step 1
  if (!question) {
    console.error('Question not found for step:', step);
    return;
  }
  
  // Apply color based on step number (cycle through 5 colors)
  const colorIndex = (step - 1) % colors.length;
  const borderColor = colors[colorIndex];
  container.style.border = `3px solid ${borderColor}`;
  
  let html = `<h2 class="question-title">${question.question}</h2>`;
  
  if (question.type === 'text') {
    html += `
      <input 
        type="text" 
        id="answer-input" 
        class="text-input" 
        value="${answers[question.id] || ''}"
        placeholder="Cevabınızı yazın..."
        style="border-color: ${borderColor};"
      />
    `;
  } else if (question.type === 'yesno') {
    const yesBorderColor = colors[colorIndex];
    const noBorderColor = colors[(colorIndex + 1) % colors.length];
    html += `
      <div class="answer-options">
        <button class="option-button ${answers[question.id] === 'true' ? 'selected' : ''}" 
                data-value="true"
                style="border-color: ${yesBorderColor};">
          Evet
        </button>
        <button class="option-button ${answers[question.id] === 'false' ? 'selected' : ''}" 
                data-value="false"
                style="border-color: ${noBorderColor};">
          Hayır
        </button>
      </div>
    `;
  } else if (question.type === 'single') {
    html += '<div class="answer-options">';
    question.options.forEach((option, index) => {
      const selected = answers[question.id] === option ? 'selected' : '';
      const optionColorIndex = (colorIndex + index) % colors.length;
      const optionBorderColor = colors[optionColorIndex];
      html += `
        <button class="option-button ${selected}" data-value="${option}" style="border-color: ${optionBorderColor};">
          ${option}
        </button>
      `;
    });
    html += '</div>';
  } else if (question.type === 'multi') {
    html += '<div class="answer-options">';
    const selectedValues = answers[question.id] || [];
    question.options.forEach((option, index) => {
      const isSelected = Array.isArray(selectedValues) && selectedValues.includes(option);
      const optionColorIndex = (colorIndex + index) % colors.length;
      const optionBorderColor = colors[optionColorIndex];
      html += `
        <label class="option-checkbox ${isSelected ? 'selected' : ''}" style="border-color: ${optionBorderColor};">
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
  if (step === INTRO_STEP) {
    return;
  }
  
  // Summary step - no input needed
  if (step === SUMMARY_STEP) {
    return;
  }
  
  // CV upload step
  if (step === CV_STEP) {
    const input = document.getElementById('cv-input');
    if (input) {
      input.addEventListener('change', (e) => {
        console.log('CV file input changed!', e.target.files);
        const file = e.target.files[0] || null;
        if (file) {
          console.log('CV file selected:', file.name, file.size);
          // Dosya boyutu kontrolü: 2MB limit (Vercel Serverless Functions için)
          if (file.size > MAX_FILE_SIZE_BYTES) {
            alert(`CV dosyası çok büyük! Maksimum dosya boyutu: 2MB\nSeçilen dosya: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            e.target.value = ''; // Dosya seçimini temizle
            cvFile = null;
          } else if ((photoFile ? photoFile.size : 0) + file.size > MAX_TOTAL_FILE_SIZE_BYTES) {
            alert('Toplam dosya boyutu 3MB limitini aşıyor. Lütfen daha küçük dosyalar seçin.');
            e.target.value = '';
            cvFile = null;
          } else {
            cvFile = file;
            console.log('CV file assigned to cvFile variable:', cvFile.name);
          }
        } else {
          cvFile = null;
          console.log('CV file cleared');
        }
        // Re-render to show file name
        renderQuestion();
      });
    }
    return;
  }
  
  // Photo upload step
  if (step === PHOTO_STEP) {
    const input = document.getElementById('photo-input');
    if (input) {
      input.addEventListener('change', (e) => {
        console.log('Photo file input changed!', e.target.files);
        const file = e.target.files[0] || null;
        if (file) {
          console.log('Photo file selected:', file.name, file.size);
          // Dosya boyutu kontrolü: 2MB limit (Vercel Serverless Functions için)
          if (file.size > MAX_FILE_SIZE_BYTES) {
            alert(`Fotoğraf dosyası çok büyük! Maksimum dosya boyutu: 2MB\nSeçilen dosya: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            e.target.value = ''; // Dosya seçimini temizle
            photoFile = null;
          } else if (file.size + (cvFile ? cvFile.size : 0) > MAX_TOTAL_FILE_SIZE_BYTES) {
            alert('Toplam dosya boyutu 3MB limitini aşıyor. Lütfen daha küçük dosyalar seçin.');
            e.target.value = '';
            photoFile = null;
          } else {
            photoFile = file;
            console.log('Photo file assigned to photoFile variable:', photoFile.name);
          }
        } else {
          photoFile = null;
          console.log('Photo file cleared');
        }
        // Re-render to show file name
        renderQuestion();
      });
    }
    return;
  }
  
  if (step === LONG_TEXT_STEP) {
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
        // Update button visibility based on answer
        updateProgress();
      });
    }
  } else if (question.type === 'yesno' || question.type === 'single') {
    document.querySelectorAll('.option-button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[question.id] = btn.dataset.value;
        
        // Otomatik olarak bir sonraki soruya geç (kısa delay ile)
        if (currentStep < TOTAL_STEPS - 1) {
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
        
        // Update button visibility based on answer
        updateProgress();
      });
    });
  }
}

// Helper function to check if current step is a question
function isCurrentStepAQuestion() {
  return currentStep >= 1 && currentStep <= QUESTIONS.length;
}

// Helper function to get current question
function getCurrentQuestion() {
  if (!isCurrentStepAQuestion()) return null;
  return QUESTIONS[currentStep - 1];
}

// Helper function to check if current question is answered
function isCurrentQuestionAnswered() {
  if (!isCurrentStepAQuestion()) return true; // Not a question, so "answered"
  const question = getCurrentQuestion();
  if (!question) return true;
  
  const answer = answers[question.id];
  if (question.type === 'multi') {
    return Array.isArray(answer) && answer.length > 0;
  } else if (question.type === 'text') {
    return answer !== undefined && answer !== null && answer.trim() !== '';
  } else {
    return answer !== undefined && answer !== null && answer !== '';
  }
}

function updateProgress() {
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  document.getElementById('progress-fill').style.width = `${progress}%`;
  
  let progressText = '';
  if (currentStep === INTRO_STEP) {
    progressText = 'Başlangıç';
  } else if (currentStep === PHOTO_STEP) {
    progressText = 'Fotoğraf Yükleme';
  } else if (currentStep === CV_STEP) {
    progressText = 'CV Yükleme';
  } else if (currentStep === LONG_TEXT_STEP) {
    progressText = 'Ek Notlar';
  } else if (currentStep === SUMMARY_STEP) {
    progressText = 'Özet';
  } else {
    progressText = `Soru ${currentStep} / ${QUESTIONS.length}`;
  }
  document.getElementById('progress-text').textContent = progressText;
  
  // Update nav container class for intro step
  const navContainer = document.querySelector('.wizard-nav');
  const homeBtn = document.getElementById('btn-home');
  if (currentStep === INTRO_STEP) {
    navContainer.classList.add('intro-nav');
    if (homeBtn) homeBtn.style.display = 'inline-flex';
  } else {
    navContainer.classList.remove('intro-nav');
    if (homeBtn) homeBtn.style.display = 'none';
  }
  
  // Show/hide back and reset buttons
  // Always show reset button after intro, always show back button after intro
  document.getElementById('btn-back').style.display = currentStep > 0 ? 'block' : 'none';
  document.getElementById('btn-reset').style.display = currentStep > 0 ? 'block' : 'none';
  
  // Update button text
  document.getElementById('btn-back').textContent = '⬅️ Geri';
  
  // Update next/finish button
  const nextBtn = document.getElementById('btn-next');
  if (currentStep === TOTAL_STEPS - 1) {
    nextBtn.textContent = '📧 Gönder';
    nextBtn.className = 'btn-nav btn-finish';
    nextBtn.style.display = 'block';
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
    nextBtn.style.cursor = 'pointer';
  } else if (currentStep === INTRO_STEP) {
    // Başla butonu - always active, separate from other buttons
    nextBtn.textContent = 'Başla ➡️';
    nextBtn.className = 'btn-nav btn-next btn-start';
    nextBtn.style.display = 'block';
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
    nextBtn.style.cursor = 'pointer';
  } else {
    // Check if current step is a question with auto-advance (single/yesno)
    const question = getCurrentQuestion();
    if (question && (question.type === 'single' || question.type === 'yesno')) {
      // Show button but greyed out for auto-advance questions
      nextBtn.textContent = 'İleri ➡️';
      nextBtn.className = 'btn-nav btn-next btn-disabled';
      nextBtn.style.display = 'block';
      nextBtn.disabled = true;
      nextBtn.style.opacity = '0.5';
      nextBtn.style.cursor = 'not-allowed';
    } else {
      // Show button for multi, text, and other steps
      nextBtn.textContent = 'İleri ➡️';
      nextBtn.className = 'btn-nav btn-next';
      nextBtn.style.display = 'block';
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
    }
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
  // Don't proceed if button is disabled
  const nextBtn = document.getElementById('btn-next');
  if (nextBtn.disabled) {
    return;
  }
  
  if (currentStep < TOTAL_STEPS - 1) {
    // Validate current step if it's a question (required)
    if (isCurrentStepAQuestion()) {
      if (!isCurrentQuestionAnswered()) {
        const question = getCurrentQuestion();
        alert(`Lütfen bu soruyu cevaplayın: ${question.question}`);
        return; // Don't advance if not answered
      }
    }
    
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
    // Debug: Check file variables
    console.log('=== SUBMIT DEBUG ===');
    console.log('photoFile:', photoFile);
    console.log('cvFile:', cvFile);
    console.log('photoFile type:', typeof photoFile);
    console.log('cvFile type:', typeof cvFile);
    
    // Build summary
    const userSummary = buildUserSummary(answers);
    const fullName = String(answers?.q24 || '').trim();

    // Load question labels for pretty email (best-effort, does not block send)
    async function loadQuestionMap() {
      try {
        const res = await fetch('/config/questions.map.json', { cache: 'no-store' });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) throw new Error('Bad response');
        return data;
      } catch (e) {
        console.warn('Question map load failed:', e);
        return { order: [], labels: {} };
      }
    }

    const escapeHtml = (s) => String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

    const formatAnswerValue = (v) => {
      if (Array.isArray(v)) return v.filter(Boolean).join(', ');
      if (v === true) return 'Evet';
      if (v === false) return 'Hayır';
      if (v === 'true') return 'Evet';
      if (v === 'false') return 'Hayır';
      if (v === null || v === undefined) return '';
      return String(v);
    };

    const buildWizardHtmlEmail = async ({ fullName, publicSlug, answers, longText, attachments }) => {
      const qmap = await loadQuestionMap();
      const labels = qmap?.labels || {};
      const order = Array.isArray(qmap?.order) ? qmap.order : [];

      const seen = new Set();
      const rows = [];
      const pushKey = (k) => {
        if (!Object.prototype.hasOwnProperty.call(answers, k)) return;
        seen.add(k);
        const label = labels[k] || k;
        const val = formatAnswerValue(answers[k]);
        if (!val) return;
        rows.push(`
          <div style="padding:12px 14px; border:1px solid rgba(0,0,0,0.08); border-radius:14px; background:#fafafa;">
            <div style="font-weight:700; margin-bottom:4px; color:#111;">${escapeHtml(label)}</div>
            <div style="color:#222; line-height:1.6;">${escapeHtml(val)}</div>
          </div>
        `);
      };

      order.forEach(pushKey);
      Object.keys(answers || {}).forEach((k) => { if (!seen.has(k)) pushKey(k); });

      const attachmentLines = (attachments || []).map(a => a?.filename).filter(Boolean);
      const attachmentsHtml = attachmentLines.length
        ? `<ul style="margin:6px 0 0; padding-left:18px;">${attachmentLines.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
        : `<div style="opacity:0.75;">Yok</div>`;

      const longTextHtml = (longText && String(longText).trim())
        ? `<div style="white-space:pre-wrap; background:#0b0b0b; color:#fff; padding:14px; border-radius:14px; line-height:1.6;">${escapeHtml(longText)}</div>`
        : `<div style="opacity:0.75;">Yok</div>`;

      return `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body style="margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif; background:#f4f6f8; color:#111;">
            <div style="max-width:760px; margin:0 auto; padding:20px;">
              <div style="background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.12); border:1px solid rgba(0,0,0,0.06);">
                <div style="padding:18px 18px 14px; background:linear-gradient(90deg,#00bfff,#32cd32,#ff8c00,#9d4edd,#ffd700);">
                  <div style="font-weight:900; color:#111; background:rgba(255,255,255,0.85); display:inline-block; padding:8px 12px; border-radius:12px;">
                    Yeni Sayfa Detayı
                  </div>
                </div>
                <div style="padding:18px;">
                  <div style="display:grid; gap:8px; margin-bottom:14px;">
                    <div><strong>Ad Soyad:</strong> ${escapeHtml(fullName || 'Yazılmadı')}</div>
                    <div><strong>Slug:</strong> <code style="font-weight:800;">${escapeHtml(publicSlug)}</code></div>
                  </div>

                  <div style="margin: 14px 0 18px; padding:14px; border-radius:14px; background:#eef6ff; border:1px solid rgba(0,0,0,0.06);">
                    <div style="font-weight:800; margin-bottom:6px;">Ekler</div>
                    ${attachmentsHtml}
                  </div>

                  <div style="margin: 0 0 18px;">
                    <div style="font-weight:900; margin:0 0 10px;">Cevaplar</div>
                    <div style="display:grid; gap:10px;">
                      ${rows.join('') || '<div style="opacity:0.75;">Yok</div>'}
                    </div>
                  </div>

                  <div style="margin: 0 0 10px;">
                    <div style="font-weight:900; margin:0 0 10px;">Ek Notlar</div>
                    ${longTextHtml}
                  </div>
                </div>
              </div>
              <div style="opacity:0.65; font-size:12px; margin-top:10px; text-align:center;">
                thisisyour.website
              </div>
            </div>
          </body>
        </html>
      `;
    };
    
    // Prepare attachments
    const attachments = [];
    
    // Convert photo to base64 if exists
    if (photoFile && photoFile instanceof File) {
      console.log('Photo file found:', photoFile.name, photoFile.size, photoFile.type);
      if (photoFile.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(`Fotoğraf dosyası çok büyük! Maksimum: 2MB, Seçilen: ${(photoFile.size / 1024 / 1024).toFixed(2)}MB`);
      }
      console.log('Converting photo to base64...');
      const photoBase64 = await fileToBase64(photoFile);
      console.log('Photo base64 length:', photoBase64.length);
      attachments.push({
        filename: photoFile.name,
        content: photoBase64,
        contentType: photoFile.type || getContentTypeFromFilename(photoFile.name)
      });
      console.log('Photo attachment added');
    } else {
      console.log('No photo file or invalid file object');
    }
    
    // Convert CV to base64 if exists
    if (cvFile && cvFile instanceof File) {
      console.log('CV file found:', cvFile.name, cvFile.size, cvFile.type);
      if (cvFile.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(`CV dosyası çok büyük! Maksimum: 2MB, Seçilen: ${(cvFile.size / 1024 / 1024).toFixed(2)}MB`);
      }
      console.log('Converting CV to base64...');
      const cvBase64 = await fileToBase64(cvFile);
      console.log('CV base64 length:', cvBase64.length);
      attachments.push({
        filename: cvFile.name,
        content: cvBase64,
        contentType: cvFile.type || getContentTypeFromFilename(cvFile.name)
      });
      console.log('CV attachment added');
    } else {
      console.log('No CV file or invalid file object');
    }
    
    // Check total size
    const totalSize = (photoFile && photoFile instanceof File ? photoFile.size : 0) + 
                     (cvFile && cvFile instanceof File ? cvFile.size : 0);
    if (totalSize > MAX_TOTAL_FILE_SIZE_BYTES) {
      throw new Error('Toplam dosya boyutu 3MB limitini aşıyor. Lütfen daha küçük dosyalar seçin.');
    }
    
    console.log('Total attachments:', attachments.length);
    console.log('=== END DEBUG ===');
    
    // Best-effort: persist answers to Turso (do not block email flow)
    // NOTE: CV/Photo storage is intentionally "parked" for now (DB won't receive attachments metadata).
    try {
      await fetch('/api/wizard-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_slug: publicSlug,
          full_name: fullName || null,
          answers,
          long_text: longText || null
        })
      });
    } catch (e) {
      console.warn('Wizard store failed (email will still be sent):', e);
    }
    
    // Send email (wizard verilerini email olarak gönder)
    let emailBody = `Yeni Sayfa Detayı\n\nAd Soyad: ${fullName || 'Yazılmadı'}\nSlug: ${publicSlug}\n\n`;
    if (photoFile) emailBody += `✅ Fotoğraf yüklendi: ${photoFile.name}\n`;
    if (cvFile) emailBody += `✅ CV yüklendi: ${cvFile.name}\n`;
    emailBody += `\n20 Soru Özeti:\n${userSummary || 'Özet bulunamadı'}\n\n`;
    const emailMessage = longText ? `${emailBody}Sizin ek istekleriniz:\n${longText}` : emailBody;

    const emailHtml = await buildWizardHtmlEmail({
      fullName,
      publicSlug,
      answers,
      longText,
      attachments
    });
    
    const requestBody = {
      name: fullName || 'Sayfa Detayı',
      email: 'wizard@thisisyour.website',
      subject: fullName ? `Yeni Sayfa Detayı - ${fullName}` : `Yeni Sayfa Detayı - ${publicSlug}`,
      message: emailMessage,
      html: emailHtml,
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
    
    // Redirect to result page with longText as URL parameter
    const params = new URLSearchParams();
    params.set('slug', publicSlug);
    if (longText && longText.trim()) {
      params.set('longText', encodeURIComponent(longText));
    }
    window.location.href = `result.html?${params.toString()}`;
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
