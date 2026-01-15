// EN Result page logic - Simple success message
function init() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const resultContentEl = document.getElementById('result-content');
  const summaryContentEl = document.getElementById('summary-content');

  if (!loadingEl || !errorEl || !resultContentEl || !summaryContentEl) {
    console.error('Required elements not found in en/result.html');
    return;
  }

  loadingEl.style.display = 'none';
  errorEl.style.display = 'none';
  resultContentEl.style.display = 'block';

  let html = '<div style="text-align: center; margin-bottom: 1.5rem;">';
  html += '<div style="font-size: 1.25rem; color: #32cd32; font-weight: 700; margin-bottom: 0.75rem;">Your form was submitted successfully!</div>';
  html += '<div style="color: #444; line-height: 1.7;">Thank you. We’ll review your information and contact you shortly.<br>You can close this page now.</div>';
  html += '</div>';

  summaryContentEl.innerHTML = html;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

