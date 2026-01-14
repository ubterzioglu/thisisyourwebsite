let currentTheme = 'light';

// Initialize from localStorage
function initFromStorage() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
}

// Theme toggle
function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  document.body.className = `theme-${theme}`;
  document.getElementById('theme-toggle').textContent = theme === 'light' ? '🌙' : '☀️';
}

// Load completed websites
async function loadShowcase() {
  try {
    const response = await fetch('/api/public');
    if (!response.ok) throw new Error('Failed to load showcase');
    
    const items = await response.json();
    const container = document.getElementById('showcase-cards');
    container.innerHTML = '';
    
    if (items.length === 0) {
      container.innerHTML = '<p>Henüz tamamlanan site yok.</p>';
      return;
    }
    
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      
      let displayName = item.display_name;
      if (item.consent_showcase === 'ANONYMIZED') {
        displayName = 'Anonim Profesyonel';
      }
      
      card.innerHTML = `
        <h3>${displayName}</h3>
        ${item.display_role ? `<p>${item.display_role}</p>` : ''}
        <a href="${item.site_url}" target="_blank" rel="noopener noreferrer">Siteyi Görüntüle →</a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Showcase yükleme hatası:', error);
    const container = document.getElementById('showcase-cards');
    container.innerHTML = '<p>Tamamlanan siteler yüklenirken bir hata oluştu.</p>';
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initFromStorage();
  
  // Theme button
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
  
  // Initial load
  loadShowcase();
});
