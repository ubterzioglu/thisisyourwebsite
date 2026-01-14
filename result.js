// Result page logic - Simple success message (no database)
function init() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('result-content').style.display = 'block';
  
  // Display success message
  const summaryContent = document.getElementById('summary-content');
  summaryContent.textContent = 'Formunuz başarıyla gönderildi! Teşekkürler.';
  summaryContent.style.textAlign = 'center';
  summaryContent.style.fontSize = '1.25rem';
  summaryContent.style.color = '#32cd32';
  summaryContent.style.fontWeight = '600';
  
  // Hide long text section
  document.getElementById('long-text-content').parentElement.parentElement.style.display = 'none';
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
