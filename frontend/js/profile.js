/**
 * SAHAYAK — Profile Page JS
 * Loads provider data from API (or mock) and renders profile.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  // ── If booking/chat action from URL ──
  const action = params.get('action');
  if (action === 'chat' && id) {
    window.location.href = `booking.html?provider=${id}&action=chat`;
    return;
  }

  // Load provider (mock for now)
  const provider = getMockProvider(id);
  if (!provider) return;

  renderProfile(provider);
  updateBookingButtons(id);

  // Show review form only if user has a completed booking with this provider (stub)
  const user = (() => { try { return JSON.parse(localStorage.getItem('sahayak_user')); } catch { return null; } })();
  if (user?.role === 'customer') {
    document.getElementById('reviewSection')?.style && (document.getElementById('reviewSection').style.display = 'block');
  }
});

function renderProfile(p) {
  setEl('profileName',     p.name);
  setEl('profileAvatar',   p.initials);
  setEl('profileBio',      p.bio);
  setEl('statRating',      p.rating);
  setEl('sidebarPrice',    `₹${p.price} / hour`);
  document.title = `${p.name} — ${p.categoryLabel} | Sahayak`;
}

function updateBookingButtons(id) {
  document.getElementById('bookNowBtn')?.setAttribute('href', `booking.html?provider=${id}&action=book`);
  document.getElementById('messageBtn')?.setAttribute('href', `booking.html?provider=${id}&action=chat`);
  document.getElementById('sidebarBookBtn')?.setAttribute('href', `booking.html?provider=${id}&action=book`);
  document.getElementById('sidebarMsgBtn')?.setAttribute('href', `booking.html?provider=${id}&action=chat`);
}

function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function getMockProvider(id) {
  const providers = {
    '1': { name:'Ramesh Kumar', initials:'R', categoryLabel:'⚡ Electrician', rating:4.9, price:300, bio:'I am a certified master electrician with over 8 years of experience in residential and commercial electrical work. I specialize in complete home wiring, electrical panel upgrades, inverter and UPS installation, CCTV systems, and emergency electrical repairs.' },
    '2': { name:'Priya Sharma',  initials:'P', categoryLabel:'🧹 Maid',        rating:4.8, price:200, bio:'Professional house cleaner with 5 years of experience. I offer deep cleaning, regular maintenance, and laundry services.' },
    '3': { name:'Mohammed Ali',  initials:'M', categoryLabel:'🔧 Plumber',     rating:4.6, price:350, bio:'Experienced plumber specializing in pipe fitting, drainage, and RO installation.' },
  };
  return providers[id] || providers['1'];
}
