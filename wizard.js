// Wizard logic for 20 questions + long text
import { QUESTIONS, buildUserSummary, buildAiPrompt } from './config/questions.js';

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

// Initialize Supabase (load from CDN)
function initSupabase() {
  return new Promise((resolve) => {
    if (window.supabase && window.supabase.createClient) {
      resolve(window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
      ));
      return;
    }
    
    // Load Supabase from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = () => {
      resolve(window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
      ));
    };
    script.onerror = () => {
      console.error('Failed to load Supabase');
      resolve(null);
    };
    document.head.appendChild(script);
  });
}

// Get Supabase client
async function getSupabase() {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error('Supabase credentials not configured');
    return null;
  }
  return await initSupabase();
}

// Create intake record in Supabase
async function createIntake(slug) {
  const supabase = await getSupabase();
  if (!supabase) {
    console.warn('Supabase not available, using mock mode');
    return true;
  }
  
  try {
    const { error } = await supabase
      .from('intakes')
      .insert({
        public_slug: slug,
        status: 'in_progress',
        answers: {},
        created_at: new Date().toISOString()
      });
    
    if (error && error.code !== '23505') { // Ignore duplicate key error
      console.error('Error creating intake:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error creating intake:', error);
    return false;
  }
}

// Update intake record
async function updateIntake(slug, data) {
  const supabase = await getSupabase();
  if (!supabase) {
    console.warn('Supabase not available, using mock mode');
    return true;
  }
  
  try {
    const { error } = await supabase
      .from('intakes')
      .update(data)
      .eq('public_slug', slug);
    
    if (error) {
      console.error('Error updating intake:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error updating intake:', error);
    return false;
  }
}

// Initialize wizard
async function initWizard() {
  publicSlug = getSlug();
  
  // Create intake record if new
  if (window.location.search.indexOf('slug=') === -1) {
    await createIntake(publicSlug);
  }
  
  renderQuestion();
  updateProgress();
}

// Render current question
function renderQuestion() {
  const container = document.getElementById('question-container');
  const totalSteps = QUESTIONS.length + 1; // 20 questions + 1 long text
  const step = currentStep;
  
  // Long text step (last step)
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
  
  const question = QUESTIONS[step];
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
  
  const question = QUESTIONS[step];
  
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
  const totalSteps = QUESTIONS.length + 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  document.getElementById('progress-fill').style.width = `${progress}%`;
  document.getElementById('progress-text').textContent = 
    currentStep === QUESTIONS.length 
      ? 'Son Adım: Ek Notlar' 
      : `Soru ${currentStep + 1} / ${QUESTIONS.length}`;
  
  // Show/hide back button
  document.getElementById('btn-back').style.display = currentStep > 0 ? 'block' : 'none';
  
  // Update next/finish button
  const nextBtn = document.getElementById('btn-next');
  if (currentStep === totalSteps - 1) {
    nextBtn.textContent = '✅ Bitir';
    nextBtn.className = 'btn-nav btn-finish';
  } else {
    nextBtn.textContent = 'İleri →';
    nextBtn.className = 'btn-nav btn-next';
  }
}

// Navigation
document.getElementById('btn-back').addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    renderQuestion();
    updateProgress();
  }
});

document.getElementById('btn-next').addEventListener('click', async () => {
  const totalSteps = QUESTIONS.length + 1;
  
  if (currentStep < totalSteps - 1) {
    // Validate current step (optional - allow skipping)
    currentStep++;
    renderQuestion();
    updateProgress();
  } else {
    // Finish: submit
    await submitWizard();
  }
});

// Submit wizard
async function submitWizard() {
  const btnNext = document.getElementById('btn-next');
  btnNext.disabled = true;
  btnNext.textContent = 'Kaydediliyor...';
  
  try {
    // Build summaries
    const userSummary = buildUserSummary(answers);
    const aiPrompt = buildAiPrompt(answers, longText);
    
    // Update Supabase
    const success = await updateIntake(publicSlug, {
      answers: answers,
      long_text: longText,
      user_summary: userSummary,
      ai_prompt: aiPrompt,
      status: 'submitted',
      updated_at: new Date().toISOString()
    });
    
    if (!success) {
      alert('Kaydetme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      btnNext.disabled = false;
      btnNext.textContent = '✅ Bitir';
      return;
    }
    
    // Redirect to result page
    window.location.href = `result.html?slug=${publicSlug}`;
  } catch (error) {
    console.error('Submit error:', error);
    alert('Bir hata oluştu. Lütfen tekrar deneyin.');
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
