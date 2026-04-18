/**
 * SAHAYAK — Dashboard JS
 * Loads user info, bookings, and messages from API (or mock).
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();

  if (user) {
    setEl('dashUserName', user.name || 'User');
    setEl('navUserName',  (user.name || 'User').split(' ')[0] + ' ' + ((user.name || '').split(' ')[1]?.[0] || '') + '.');
    setEl('greetName',    (user.name || 'User').split(' ')[0]);
    setEl('dashUserAvi',  (user.name || 'U')[0].toUpperCase());
    if (user.role === 'provider') {
      setEl('dashUserRole', '⚡ Provider');
    } else {
      setEl('dashUserRole', '🙋 Customer');
      // Customers see "Find & Book" instead of provider-specific items
      const providerLinks = document.querySelectorAll('[href="edit-profile.html"]');
      providerLinks.forEach(l => l.closest('.dash-nav-section')?.style && (l.style.display='none'));
    }
    // Avatar initial styling
    const avi = document.getElementById('dashUserAvi');
    if (avi) avi.textContent = (user.name || 'U')[0].toUpperCase();
  }
});

function getUser() {
  try { return JSON.parse(localStorage.getItem('sahayak_user') || 'null'); } catch { return null; }
}

function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
