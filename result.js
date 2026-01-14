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
  
  // Display success message
  summaryContentEl.textContent = 'Formunuz başarıyla gönderildi! Teşekkürler.';
  summaryContentEl.style.textAlign = 'center';
  summaryContentEl.style.fontSize = '1.25rem';
  summaryContentEl.style.color = '#32cd32';
  summaryContentEl.style.fontWeight = '600';
  
  // Hide long text section if it exists (optional)
  const longTextContentEl = document.getElementById('long-text-content');
  if (longTextContentEl && longTextContentEl.parentElement && longTextContentEl.parentElement.parentElement) {
    longTextContentEl.parentElement.parentElement.style.display = 'none';
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
