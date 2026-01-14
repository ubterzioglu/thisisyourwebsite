// Result page logic
function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

// Fetch intake data via API
async function fetchIntake(slug) {
  const response = await fetch(`/api/intakes?slug=${encodeURIComponent(slug)}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Intake not found');
    }
    throw new Error('Failed to fetch intake');
  }
  
  return await response.json();
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
