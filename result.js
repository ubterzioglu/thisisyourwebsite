// Result page logic - Simple success message (no database)
function init() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const resultContentEl = document.getElementById('result-content');
  const summaryContentEl = document.getElementById('summary-content');
  
  // Null check
  if (!loadingEl || !errorEl || !resultContentEl || !summaryContentEl) {
    console.error('Required elements not found in result.html');
    return;
  }
  
  loadingEl.style.display = 'none';
  errorEl.style.display = 'none';
  resultContentEl.style.display = 'block';
  
  // Get longText from URL parameters
  const params = new URLSearchParams(window.location.search);
  const longText = params.get('longText');
  
  // Display success message
  let html = '<div style="text-align: center; margin-bottom: 2rem;">';
  html += '<div style="font-size: 1.25rem; color: #32cd32; font-weight: 600; margin-bottom: 1rem;">Formunuz başarıyla gönderildi! Teşekkürler.</div>';
  html += '</div>';
  
  // Display long text if exists
  if (longText && longText.trim()) {
    html += '<div style="margin-top: 2rem;">';
    html += '<h3 style="margin-bottom: 1rem; color: #333; font-size: 1.1rem; font-weight: 600;">Sizin ek istekleriniz:</h3>';
    html += `<div class="long-text-content">${decodeURIComponent(longText)}</div>`;
    html += '</div>';
  }
  
  summaryContentEl.innerHTML = html;
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
