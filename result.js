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
  
  // Display success message (longer copy)
  let html = '<div style="text-align: center; margin-bottom: 1.5rem;">';
  html += '<div style="font-size: 1.25rem; color: #32cd32; font-weight: 700; margin-bottom: 0.75rem;">Formunuz başarıyla gönderildi!</div>';
  html += '<div style="color: #444; line-height: 1.7;">Teşekkürler. Kısa süre içinde bilgilerinizi inceleyip sizinle iletişime geçeceğiz.<br>Bu sırada sayfayı kapatabilirsiniz.</div>';
  html += '</div>';

  summaryContentEl.innerHTML = html;
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
