// English wizard logic (dup of root wizard.js, minimal changes for EN UI + EN questions)
import { QUESTIONS, buildUserSummary } from '../config/questions.en.js';

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

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (slug) return slug;
  const newSlug = generateSlug();
  window.history.replaceState({}, '', `?slug=${newSlug}`);
  return newSlug;
}

function initWizard() {
  publicSlug = getSlug();
  // mark language inside answers object (same DB)
  answers._meta = { lang: 'en' };
  renderQuestion();
  updateProgress();
  updateNavButtons();
}

function renderQuestion() {
  const container = document.getElementById('question-container');
  const step = currentStep;
  const colors = ['#00A8FF', '#32CD32', '#FF9500', '#9D4EDD', '#FFD700'];
  container.className = 'question-card';

  if (step === INTRO_STEP) {
    container.className = 'question-card intro-card';
    container.innerHTML = `
      <h2 class="question-title intro-title" style="font-weight: 700; font-size: 0.9rem; margin-bottom: 1rem;">Page Design Form</h2>
      <div style="line-height: 1.6; color: #444; margin-bottom: 1rem; font-size: 0.9rem;">
        <p style="margin-bottom: 0.75rem; font-weight: normal;">Estimated time: ~3 minutes</p>
        <p style="margin-bottom: 0.75rem; font-weight: normal;">
          This form helps us shape the design of your personal website.
        </p>
        <p style="margin-bottom: 0.75rem; font-weight: normal;">
          We’re not asking for your content—only design and presentation preferences.
        </p>
        <p style="margin-bottom: 0.75rem; font-weight: normal;">
          There will be no extra questions outside this form.
        </p>
        <p style="margin-top: 1rem; color: #666; font-weight: normal;">
          ${QUESTIONS.length} questions + Photo & CV upload + Additional notes
        </p>
      </div>
    `;
    return;
  }

  if (step === SUMMARY_STEP) {
    const summaryColorIndex = (QUESTIONS.length + 4) % colors.length;
    const summaryBorderColor = colors[summaryColorIndex];
    container.style.border = `3px solid ${summaryBorderColor}`;
    const userSummary = buildUserSummary(answers);
    container.innerHTML = `
      <p style="margin-bottom: 1.5rem; color: #666;">
        Please review your answers. Click “Send” to submit.
      </p>
      <div style="margin-bottom: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        ${photoFile ? '<div style="padding: 0.75rem 1.5rem; background: #d4edda; color: #155724; border-radius: 8px; font-weight: 600;">✅ Photo added</div>' : ''}
        ${cvFile ? '<div style="padding: 0.75rem 1.5rem; background: #d4edda; color: #155724; border-radius: 8px; font-weight: 600;">✅ CV added</div>' : ''}
      </div>
      <div style="background: #f9f9f9; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
        <div style="line-height: 1.8; color: #444;">${formatSummaryWithBold(userSummary) || 'No summary found'}</div>
      </div>
      ${longText ? `
        <div style="background: #e3f2fd; border-radius: 12px; padding: 2rem; border-left: 4px solid #00A8FF; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 0.9rem; font-weight: 700;">Additional notes:</h3>
          <div style="white-space: pre-wrap; line-height: 1.8; color: #444;">${longText}</div>
        </div>
      ` : `
        <div style="background: #f9f9f9; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 0.9rem; font-weight: 700;">Additional notes:</h3>
          <div style="color: #999; font-style: italic;">No notes provided.</div>
        </div>
      `}
      <div style="background: #e6f4ea; border-radius: 12px; padding: 2rem; border-left: 4px solid #32CD32; margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 1rem; color: #333; font-size: 0.9rem; font-weight: 700;">3 Revision Credits</h3>
        <div style="line-height: 1.8; color: #444;">
          <p style="margin-bottom: 1rem;">When your website is ready, you can submit a revision request using the link below.</p>
          <p style="margin-bottom: 1rem; font-weight: 600;">You have <strong>3 revision credits</strong> in total.</p>
          <a href="revision.html?slug=${publicSlug}" style="display: inline-block; padding: 0.5rem 0.9rem; background: white; color: #333; border: 2px solid #32CD32; border-radius: 10px; font-weight: 600; font-size: 0.85rem; text-decoration: none;">
            🔗 Revision link
          </a>
        </div>
      </div>
    `;
    return;
  }

  if (step === CV_STEP) {
    const cvColorIndex = (QUESTIONS.length + 2) % colors.length;
    const cvBorderColor = colors[cvColorIndex];
    container.style.border = `3px solid ${cvBorderColor}`;
    const fileSizeInfo = cvFile ? ` (${(cvFile.size / 1024 / 1024).toFixed(2)}MB)` : '';
    container.innerHTML = `
      <h2 class="question-title">CV Upload</h2>
      <p style="margin-bottom: 1rem; color: #666;">You can upload your CV (preferably PDF; DOCX accepted). Optional.</p>
      <p style="margin-bottom: 1.5rem; color: #ff9800; font-weight: 600; font-size: 0.9rem;">⚠️ Max file size: 2MB (3MB total)</p>
      <div class="file-upload">
        <input type="file" id="cv-input" class="file-input-hidden" accept=".pdf,.docx,.doc" />
        <label for="cv-input" class="file-button" style="border-color: ${cvBorderColor};">📎 Choose file</label>
        <span class="file-name">${cvFile ? `${cvFile.name}${fileSizeInfo}` : 'No file selected'}</span>
      </div>
    `;
    setTimeout(() => {
      const input = document.getElementById('cv-input');
      if (input) {
        input.addEventListener('change', (e) => {
          const file = e.target.files[0] || null;
          if (file) {
            if (file.size > MAX_FILE_SIZE_BYTES) {
              alert(`CV file is too large. Max: 2MB\nSelected: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
              e.target.value = '';
              cvFile = null;
            } else if ((photoFile ? photoFile.size : 0) + file.size > MAX_TOTAL_FILE_SIZE_BYTES) {
              alert('Total file size exceeds 3MB. Please choose smaller files.');
              e.target.value = '';
              cvFile = null;
            } else {
              cvFile = file;
            }
          } else {
            cvFile = null;
          }
          renderQuestion();
        });
      }
    }, 0);
    return;
  }

  if (step === PHOTO_STEP) {
    const photoColorIndex = (QUESTIONS.length + 1) % colors.length;
    const photoBorderColor = colors[photoColorIndex];
    container.style.border = `3px solid ${photoBorderColor}`;
    const fileSizeInfo = photoFile ? ` (${(photoFile.size / 1024 / 1024).toFixed(2)}MB)` : '';
    container.innerHTML = `
      <h2 class="question-title">Photo Upload</h2>
      <p style="margin-bottom: 1rem; color: #666;">You can upload a profile photo (JPG, PNG, WEBP). Optional.</p>
      <p style="margin-bottom: 1.5rem; color: #ff9800; font-weight: 600; font-size: 0.9rem;">⚠️ Max file size: 2MB (3MB total)</p>
      <div class="file-upload">
        <input type="file" id="photo-input" class="file-input-hidden" accept="image/jpeg,image/png,image/webp" />
        <label for="photo-input" class="file-button" style="border-color: ${photoBorderColor};">📎 Choose file</label>
        <span class="file-name">${photoFile ? `${photoFile.name}${fileSizeInfo}` : 'No file selected'}</span>
      </div>
    `;
    setTimeout(() => {
      const input = document.getElementById('photo-input');
      if (input) {
        input.addEventListener('change', (e) => {
          const file = e.target.files[0] || null;
          if (file) {
            if (file.size > MAX_FILE_SIZE_BYTES) {
              alert(`Photo is too large. Max: 2MB\nSelected: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
              e.target.value = '';
              photoFile = null;
            } else if (file.size + (cvFile ? cvFile.size : 0) > MAX_TOTAL_FILE_SIZE_BYTES) {
              alert('Total file size exceeds 3MB. Please choose smaller files.');
              e.target.value = '';
              photoFile = null;
            } else {
              photoFile = file;
            }
          } else {
            photoFile = null;
          }
          renderQuestion();
        });
      }
    }, 0);
    return;
  }

  if (step === LONG_TEXT_STEP) {
    const longTextColorIndex = (QUESTIONS.length + 3) % colors.length;
    const longTextBorderColor = colors[longTextColorIndex];
    container.style.border = `3px solid ${longTextBorderColor}`;
    container.innerHTML = `
      <h2 class="question-title">Additional Notes</h2>
      <p style="margin-bottom: 1.5rem; color: #666;">Anything else you want to add about your website:</p>
      <textarea id="long-text-input" class="textarea-input"
        placeholder="Optional: write your notes here..."
        style="border-color: ${longTextBorderColor}; background-color: white;"
      >${longText}</textarea>
    `;
    const input = document.getElementById('long-text-input');
    if (input) {
      input.value = longText;
      input.addEventListener('input', (e) => {
        longText = e.target.value;
      });
    }
    return;
  }

  if (step < 1 || step > QUESTIONS.length) {
    return;
  }

  const question = QUESTIONS[step - 1];
  const colorIndex = (step - 1) % colors.length;
  const borderColor = colors[colorIndex];
  container.style.border = `3px solid ${borderColor}`;

  let html = `<h2 class="question-title">${question.question}</h2>`;

  if (question.type === 'text') {
    html += `
      <input type="text" id="answer-input" class="text-input"
        value="${answers[question.id] || ''}"
        placeholder="Type your answer..."
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
          Yes
        </button>
        <button class="option-button ${answers[question.id] === 'false' ? 'selected' : ''}"
                data-value="false"
                style="border-color: ${noBorderColor};">
          No
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
  attachEventListeners();
}

function attachEventListeners() {
  const step = currentStep;
  if (step === INTRO_STEP || step === SUMMARY_STEP) return;

  if (step === CV_STEP) return;
  if (step === PHOTO_STEP) return;

  if (step === LONG_TEXT_STEP) return;

  if (step < 1 || step > QUESTIONS.length) return;
  const question = QUESTIONS[step - 1];

  if (question.type === 'text') {
    const input = document.getElementById('answer-input');
    if (input) {
      input.addEventListener('input', (e) => {
        answers[question.id] = e.target.value;
        updateNavButtons();
      });
    }
  } else if (question.type === 'yesno' || question.type === 'single') {
    document.querySelectorAll('.option-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        answers[question.id] = value;
        document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        // auto advance
        currentStep++;
        renderQuestion();
        updateProgress();
        updateNavButtons();
      });
    });
  } else if (question.type === 'multi') {
    document.querySelectorAll('.option-checkbox input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = Array.from(document.querySelectorAll('.option-checkbox input[type="checkbox"]:checked'))
          .map(x => x.value);
        answers[question.id] = selected;
        document.querySelectorAll('.option-checkbox').forEach(label => {
          const input = label.querySelector('input');
          if (input && input.checked) label.classList.add('selected');
          else label.classList.remove('selected');
        });
        updateNavButtons();
      });
    });
  }
}

function isCurrentStepAQuestion() {
  return currentStep >= 1 && currentStep <= QUESTIONS.length;
}

function getCurrentQuestion() {
  return QUESTIONS[currentStep - 1];
}

function isCurrentQuestionAnswered() {
  const q = getCurrentQuestion();
  if (!q) return true;
  const a = answers[q.id];
  if (q.type === 'multi') return Array.isArray(a) && a.length > 0;
  return a !== undefined && a !== null && String(a).trim() !== '';
}

function updateProgress() {
  let progressText = '';
  if (currentStep === INTRO_STEP) progressText = 'Start';
  else if (currentStep === PHOTO_STEP) progressText = 'Photo';
  else if (currentStep === CV_STEP) progressText = 'CV';
  else if (currentStep === LONG_TEXT_STEP) progressText = 'Notes';
  else if (currentStep === SUMMARY_STEP) progressText = 'Summary';
  else progressText = `Question ${currentStep} / ${QUESTIONS.length}`;

  document.getElementById('progress-text').textContent = progressText;

  const progressFill = document.getElementById('progress-fill');
  const progressPercent = Math.min(100, Math.max(0, (currentStep / (TOTAL_STEPS - 1)) * 100));
  progressFill.style.width = `${progressPercent}%`;
}

function updateNavButtons() {
  const nextBtn = document.getElementById('btn-next');
  const backBtn = document.getElementById('btn-back');
  const resetBtn = document.getElementById('btn-reset');
  const homeBtn = document.getElementById('btn-home');

  if (currentStep === INTRO_STEP) {
    if (homeBtn) homeBtn.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';
    if (backBtn) backBtn.style.display = 'none';
    nextBtn.textContent = 'Start ➡️';
    nextBtn.disabled = false;
    return;
  }

  if (resetBtn) resetBtn.style.display = 'inline-flex';
  if (backBtn) backBtn.style.display = currentStep > 0 ? 'inline-flex' : 'none';
  if (homeBtn) homeBtn.style.display = 'none';

  if (currentStep === SUMMARY_STEP) {
    nextBtn.textContent = 'Send ✅';
    nextBtn.disabled = false;
    return;
  }

  const question = isCurrentStepAQuestion() ? getCurrentQuestion() : null;
  if (question && (question.type === 'single' || question.type === 'yesno')) {
    nextBtn.textContent = 'Next ➡️';
    nextBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
    nextBtn.style.cursor = 'not-allowed';
    return;
  }

  nextBtn.style.opacity = '1';
  nextBtn.style.cursor = 'pointer';
  nextBtn.textContent = currentStep === TOTAL_STEPS - 1 ? 'Send ✅' : 'Next ➡️';

  if (currentStep === PHOTO_STEP || currentStep === CV_STEP || currentStep === LONG_TEXT_STEP) {
    nextBtn.disabled = false;
    return;
  }

  if (isCurrentStepAQuestion() && !isCurrentQuestionAnswered()) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
    nextBtn.style.cursor = 'not-allowed';
  } else {
    nextBtn.disabled = false;
  }
}

document.getElementById('btn-reset').addEventListener('click', () => {
  if (confirm('Reset all answers?')) {
    answers = { _meta: { lang: 'en' } };
    longText = '';
    photoFile = null;
    cvFile = null;
    currentStep = 0;
    renderQuestion();
    updateProgress();
    updateNavButtons();
  }
});

document.getElementById('btn-back').addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    renderQuestion();
    updateProgress();
    updateNavButtons();
  }
});

document.getElementById('btn-next').addEventListener('click', async () => {
  const nextBtn = document.getElementById('btn-next');
  if (nextBtn.disabled) return;

  if (currentStep < TOTAL_STEPS - 1) {
    if (isCurrentStepAQuestion() && !isCurrentQuestionAnswered()) {
      const q = getCurrentQuestion();
      alert(`Please answer: ${q.question}`);
      return;
    }
    currentStep++;
    renderQuestion();
    updateProgress();
    updateNavButtons();
  } else {
    await submitWizard();
  }
});

function getContentTypeFromFilename(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const contentTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function submitWizard() {
  const btnNext = document.getElementById('btn-next');
  btnNext.disabled = true;
  btnNext.textContent = 'Sending...';

  try {
    const userSummary = buildUserSummary(answers);
    const fullName = String(answers?.q24 || '').trim();

    const attachments = [];
    if (photoFile && photoFile instanceof File) {
      if (photoFile.size > MAX_FILE_SIZE_BYTES) throw new Error('Photo is too large (max 2MB).');
      const photoBase64 = await fileToBase64(photoFile);
      attachments.push({ filename: photoFile.name, content: photoBase64, contentType: photoFile.type || getContentTypeFromFilename(photoFile.name) });
    }
    if (cvFile && cvFile instanceof File) {
      if (cvFile.size > MAX_FILE_SIZE_BYTES) throw new Error('CV is too large (max 2MB).');
      const cvBase64 = await fileToBase64(cvFile);
      attachments.push({ filename: cvFile.name, content: cvBase64, contentType: cvFile.type || getContentTypeFromFilename(cvFile.name) });
    }
    const totalSize = (photoFile && photoFile instanceof File ? photoFile.size : 0) + (cvFile && cvFile instanceof File ? cvFile.size : 0);
    if (totalSize > MAX_TOTAL_FILE_SIZE_BYTES) throw new Error('Total file size exceeds 3MB.');

    // Persist to DB (same backend). CV/Photo DB storage is parked.
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
    } catch {}

    let emailBody = `Yeni Sayfa Detayı\n\nAd Soyad: ${fullName || 'Not provided'}\nSlug: ${publicSlug}\n\n`;
    if (photoFile) emailBody += `✅ Photo uploaded: ${photoFile.name}\n`;
    if (cvFile) emailBody += `✅ CV uploaded: ${cvFile.name}\n`;
    emailBody += `\nSummary:\n${userSummary || 'No summary'}\n\n`;
    const emailMessage = longText ? `${emailBody}Additional notes:\n${longText}` : emailBody;

    const requestBody = {
      name: fullName || 'Sayfa Detayı',
      email: 'wizard@thisisyour.website',
      subject: fullName ? `Yeni Sayfa Detayı - ${fullName}` : `Yeni Sayfa Detayı - ${publicSlug}`,
      message: emailMessage,
      attachments
    };

    const response = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Email failed');
    }

    alert('Submitted successfully! Thank you.');

    const params = new URLSearchParams();
    params.set('slug', publicSlug);
    if (longText && longText.trim()) params.set('longText', encodeURIComponent(longText));
    window.location.href = `../result.html?${params.toString()}`;
  } catch (error) {
    alert('Error: ' + error.message);
    btnNext.disabled = false;
    btnNext.textContent = 'Send ✅';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWizard);
} else {
  initWizard();
}

