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
const REVISION_STEP = QUESTIONS.length + 5;
const TOTAL_STEPS = QUESTIONS.length + 6;

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
          Toplam 20 soru + Fotoğraf ve CV Yükleme + Sizden Ek Notlar
        </p>
      </div>
    `;
    return;
  }
  
  // Revision info step (after summary, before submit)
  if (step === REVISION_STEP) {
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
  if (step === SUMMARY_STEP) {
    const summaryColorIndex = (QUESTIONS.length + 4) % colors.length;
    const summaryBorderColor = colors[summaryColorIndex];
    container.style.border = `3px solid ${summaryBorderColor}`;
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
        <div style="line-height: 1.8; color: #444;">${formatSummaryWithBold(userSummary) || 'Özet bulunamadı'}</div>
      </div>
      ${longText ? `
        <div style="background: #fff3cd; border-radius: 12px; padding: 2rem; border-left: 4px solid #ffc107; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.25rem;">Sizin ek istekleriniz:</h3>
          <div style="white-space: pre-wrap; line-height: 1.8; color: #444;">${longText}</div>
        </div>
      ` : `
        <div style="background: #f9f9f9; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.25rem;">Ek Notlar:</h3>
          <div style="color: #999; font-style: italic;">Ek not eklenmedi.</div>
        </div>
      `}
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
      <input 
        type="file" 
        id="cv-input" 
        accept=".pdf,.docx,.doc"
        style="width: 100%; padding: 1rem; border: 2px solid ${cvBorderColor}; border-radius: 12px; font-size: 0.9rem;"
      />
      ${cvFile ? `<p style="margin-top: 1rem; color: #32cd32; font-weight: 600;">✅ ${cvFile.name}${fileSizeInfo}</p>` : ''}
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
      <input 
        type="file" 
        id="photo-input" 
        accept="image/jpeg,image/png,image/webp"
        style="width: 100%; padding: 1rem; border: 2px solid ${photoBorderColor}; border-radius: 12px; font-size: 0.9rem;"
      />
      ${photoFile ? `<p style="margin-top: 1rem; color: #32cd32; font-weight: 600;">✅ ${photoFile.name}${fileSizeInfo}</p>` : ''}
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
    document.getElementById('long-text-input').value = longText;
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
  
  // Revision info step - no input needed
  if (step === REVISION_STEP) {
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
  } else if (currentStep === REVISION_STEP) {
    progressText = 'Revizyon Bilgisi';
  } else {
    progressText = `Soru ${currentStep} / ${QUESTIONS.length}`;
  }
  document.getElementById('progress-text').textContent = progressText;
  
  // Update nav container class for intro step
  const navContainer = document.querySelector('.wizard-nav');
  if (currentStep === INTRO_STEP) {
    navContainer.classList.add('intro-nav');
  } else {
    navContainer.classList.remove('intro-nav');
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
  } else if (currentStep === INTRO_STEP) {
    nextBtn.textContent = 'Başla →';
    nextBtn.className = 'btn-nav btn-next';
    nextBtn.style.display = 'block';
  } else {
    // Check if current step is a question with auto-advance (single/yesno)
    const question = getCurrentQuestion();
    if (question && (question.type === 'single' || question.type === 'yesno')) {
      // Hide button for auto-advance questions
      nextBtn.style.display = 'none';
    } else {
      // Show button for multi, text, and other steps
      nextBtn.textContent = 'İleri ➡️';
      nextBtn.className = 'btn-nav btn-next';
      nextBtn.style.display = 'block';
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
  if (currentStep < TOTAL_STEPS - 1) {
    // TEMPORARILY DISABLED: Validate current step if it's a question
    // TODO: Re-enable after testing
    // if (isCurrentStepAQuestion()) {
    //   if (!isCurrentQuestionAnswered()) {
    //     const question = getCurrentQuestion();
    //     alert(`Lütfen bu soruyu cevaplayın: ${question.question}`);
    //     return; // Don't advance if not answered
    //   }
    // }
    
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
