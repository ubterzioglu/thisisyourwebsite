// Result page logic
function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
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

// Fetch intake data
async function fetchIntake(slug) {
  const supabase = await getSupabase();
  if (!supabase) {
    throw new Error('Supabase not available');
  }
  
  const { data, error } = await supabase
    .from('intakes')
    .select('*')
    .eq('public_slug', slug)
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Display result
function displayResult(intake) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('result-content').style.display = 'block';
  
  // Display summary
  const summaryContent = document.getElementById('summary-content');
  if (intake.user_summary) {
    summaryContent.textContent = intake.user_summary;
  } else {
    summaryContent.textContent = 'Özet bulunamadı.';
  }
  
  // Display long text
  const longTextContent = document.getElementById('long-text-content');
  if (intake.long_text && intake.long_text.trim()) {
    longTextContent.textContent = intake.long_text;
  } else {
    longTextContent.textContent = 'Ek not eklenmemiş.';
    longTextContent.style.fontStyle = 'italic';
    longTextContent.style.color = '#999';
  }
}

// Show error
function showError(message) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('result-content').style.display = 'none';
  
  const errorDiv = document.getElementById('error');
  errorDiv.style.display = 'block';
  errorDiv.innerHTML = `
    <h2 style="margin-bottom: 1rem;">${message}</h2>
    <p><a href="index.html">Ana sayfaya dön</a></p>
  `;
}

// Initialize
async function init() {
  const slug = getSlugFromURL();
  
  if (!slug) {
    showError('Geçersiz bağlantı. Slug parametresi bulunamadı.');
    return;
  }
  
  try {
    const intake = await fetchIntake(slug);
    
    if (!intake) {
      showError('Kayıt bulunamadı. Lütfen bağlantınızı kontrol edin.');
      return;
    }
    
    displayResult(intake);
  } catch (error) {
    console.error('Error fetching intake:', error);
    showError('Kayıt yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
