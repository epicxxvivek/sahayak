/**
 * SAHAYAK — Search Page JS
 * Renders provider cards, handles filtering, sorting, pagination.
 */

// ── Mock provider data (replace with API call) ──────────────────
const MOCK_PROVIDERS = [
  { id:1,  name:'Ramesh Kumar',  initials:'R', category:'electrician', categoryLabel:'⚡ Electrician', city:'Pune',     area:'Kothrud',    rating:4.9, reviews:142, price:300, available:true,  skills:['Wiring','Panel Fix','CCTV','Inverter'], gradient:'135deg,#F59E0B,#D97706' },
  { id:2,  name:'Priya Sharma',  initials:'P', category:'maid',        categoryLabel:'🧹 Maid',        city:'Mumbai',   area:'Andheri W',  rating:4.8, reviews:98,  price:200, available:true,  skills:['Deep Clean','Kitchen','Laundry'],       gradient:'135deg,#3B82F6,#6366F1' },
  { id:3,  name:'Mohammed Ali',  initials:'M', category:'plumber',     categoryLabel:'🔧 Plumber',     city:'Delhi',    area:'Lajpat Nagar',rating:4.6, reviews:76, price:350, available:false, skills:['Pipe Fit','Drainage','RO Install'],    gradient:'135deg,#10B981,#059669' },
  { id:4,  name:'Sunita Rao',    initials:'S', category:'maid',        categoryLabel:'🧹 Maid',        city:'Bangalore',area:'Koramangala', rating:4.7, reviews:55,  price:180, available:true,  skills:['Sweeping','Cooking','Childcare'],       gradient:'135deg,#8B5CF6,#6366F1' },
  { id:5,  name:'Deepak Sharma', initials:'D', category:'carpenter',   categoryLabel:'🪚 Carpenter',   city:'Pune',     area:'Wakad',      rating:4.5, reviews:33,  price:400, available:true,  skills:['Furniture','Doors','Cabinets'],         gradient:'135deg,#F59E0B,#EF4444' },
  { id:6,  name:'Kavya Nair',    initials:'K', category:'cook',        categoryLabel:'👨‍🍳 Cook',        city:'Mumbai',   area:'Bandra',     rating:4.9, reviews:110, price:250, available:true,  skills:['South Indian','North Indian','Baking'], gradient:'135deg,#EC4899,#F59E0B' },
  { id:7,  name:'Ravi Patel',    initials:'R', category:'electrician', categoryLabel:'⚡ Electrician', city:'Ahmedabad',area:'Satellite',  rating:4.4, reviews:28,  price:280, available:true,  skills:['AC Wiring','MCB Fix','Inverter'],       gradient:'135deg,#06B6D4,#3B82F6' },
  { id:8,  name:'Anjali Singh',  initials:'A', category:'painter',     categoryLabel:'🎨 Painter',     city:'Delhi',    area:'Dwarka',     rating:4.6, reviews:41,  price:320, available:false, skills:['Wall Paint','Texture','Waterproofing'],  gradient:'135deg,#84CC16,#10B981' },
  { id:9,  name:'Mohan Das',     initials:'M', category:'ac-repair',   categoryLabel:'❄️ AC Repair',   city:'Chennai',  area:'T-Nagar',    rating:4.8, reviews:87,  price:500, available:true,  skills:['Split AC','Window AC','Gas Fill'],      gradient:'135deg,#06B6D4,#0EA5E9' },
  { id:10, name:'Fatima Sheikh', initials:'F', category:'driver',      categoryLabel:'🚗 Driver',      city:'Hyderabad',area:'Banjara H',  rating:4.7, reviews:63,  price:200, available:true,  skills:['City Trips','Airport Drops','Outstation'],gradient:'135deg,#F97316,#EF4444' },
  { id:11, name:'Arun Kumar',    initials:'A', category:'plumber',     categoryLabel:'🔧 Plumber',     city:'Pune',     area:'Aundh',      rating:4.5, reviews:21,  price:300, available:true,  skills:['Bathroom Fit','Tap Fix','Tank Clean'],  gradient:'135deg,#10B981,#3B82F6' },
  { id:12, name:'Geeta Devi',    initials:'G', category:'gardener',    categoryLabel:'🌿 Gardener',    city:'Bangalore',area:'Indiranagar', rating:4.3, reviews:18,  price:150, available:true,  skills:['Gardening','Lawn Care','Planting'],     gradient:'135deg,#84CC16,#22C55E' },
];

// ── State ─────────────────────────────────────────────────────
let state = {
  providers:    [...MOCK_PROVIDERS],
  filtered:     [...MOCK_PROVIDERS],
  page:         1,
  perPage:      6,
  category:     '',
  query:        '',
  location:     '',
  minRating:    0,
  priceMin:     0,
  priceMax:     9999,
  availableNow: false,
  sortBy:       'rating',
};

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  readUrlParams();
  applyFilters();
  bindEvents();
});

function readUrlParams() {
  const p = new URLSearchParams(window.location.search);
  if (p.get('q'))        state.query    = p.get('q');
  if (p.get('category')) state.category = p.get('category');
  if (p.get('city'))     state.location = p.get('city');
  if (state.query)    document.getElementById('searchQuery').value = state.query;
  if (state.location) document.getElementById('locationInput').value = state.location;
}

function bindEvents() {
  document.getElementById('searchBtn')?.addEventListener('click', () => {
    state.query    = document.getElementById('searchQuery').value.trim().toLowerCase();
    state.location = document.getElementById('locationInput').value.trim().toLowerCase();
    state.page     = 1;
    applyFilters();
    updateActiveFilters();
  });

  document.getElementById('searchQuery')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('searchBtn').click();
  });

  document.getElementById('applyFilters')?.addEventListener('click', applyFromSidebar);
  document.getElementById('applyDrawerFilters')?.addEventListener('click', () => { applyFromSidebar(); closeDrawer(); });
  document.getElementById('clearAllFilters')?.addEventListener('click', clearAll);
  document.getElementById('clearSearchBtn')?.addEventListener('click', clearAll);

  document.getElementById('sortSelect')?.addEventListener('change', () => {
    state.sortBy = document.getElementById('sortSelect').value;
    applyFilters();
  });

  document.getElementById('prevPage')?.addEventListener('click', () => { if (state.page > 1) { state.page--; render(); } });
  document.getElementById('nextPage')?.addEventListener('click', () => { if (state.page < totalPages()) { state.page++; render(); } });
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => { state.page = parseInt(btn.dataset.page); render(); });
  });
}

function applyFromSidebar() {
  state.category    = document.querySelector('.category-chip.active')?.dataset.cat || '';
  state.minRating   = parseFloat(document.querySelector('[name="minRating"]:checked')?.value || 0);
  state.priceMin    = parseInt(document.getElementById('priceMin').value || 0);
  state.priceMax    = parseInt(document.getElementById('priceMax').value || 9999);
  state.availableNow= document.getElementById('availableNow').checked;
  state.page        = 1;
  applyFilters();
  updateActiveFilters();
}

function applyFilters() {
  let data = [...state.providers];

  if (state.category) data = data.filter(p => p.category === state.category);
  if (state.query)    data = data.filter(p =>
    p.name.toLowerCase().includes(state.query) ||
    p.skills.some(s => s.toLowerCase().includes(state.query)) ||
    p.categoryLabel.toLowerCase().includes(state.query)
  );
  if (state.location)     data = data.filter(p => p.city.toLowerCase().includes(state.location) || p.area.toLowerCase().includes(state.location));
  if (state.minRating)    data = data.filter(p => p.rating >= state.minRating);
  if (state.priceMin > 0) data = data.filter(p => p.price >= state.priceMin);
  if (state.priceMax < 9999) data = data.filter(p => p.price <= state.priceMax);
  if (state.availableNow) data = data.filter(p => p.available);

  // Sort
  if (state.sortBy === 'rating')     data.sort((a,b) => b.rating - a.rating);
  if (state.sortBy === 'price-asc')  data.sort((a,b) => a.price  - b.price);
  if (state.sortBy === 'price-desc') data.sort((a,b) => b.price  - a.price);

  state.filtered = data;
  render();
}

function render() {
  const grid = document.getElementById('resultsGrid');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('resultsCount');
  const total = state.filtered.length;

  count.innerHTML = `Showing <strong>${total}</strong> provider${total !== 1 ? 's' : ''}`;

  if (!total) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const start = (state.page - 1) * state.perPage;
  const page  = state.filtered.slice(start, start + state.perPage);

  grid.innerHTML = page.map(p => renderCard(p)).join('');
  grid.querySelectorAll('.search-provider-card').forEach(card => {
    card.addEventListener('click', () => { window.location.href = `profile.html?id=${card.dataset.id}`; });
  });

  updatePagination();
}

function renderCard(p) {
  const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
  return `
    <div class="search-provider-card" data-id="${p.id}" role="listitem" tabindex="0" aria-label="${p.name}, ${p.categoryLabel}">
      <div style="display:flex;align-items:flex-start;gap:1rem;">
        <div class="card-avatar-wrap">
          <div class="card-avi" style="background:linear-gradient(${p.gradient});">${p.initials}</div>
          ${p.available ? '<div class="online-indicator" title="Available"></div>' : ''}
        </div>
        <div style="flex:1;min-width:0;">
          <p class="card-name">${escHtml(p.name)}</p>
          <p class="card-category">${p.categoryLabel}</p>
          <div class="card-meta">
            <span class="card-meta-item" style="color:var(--accent);">${stars} <strong>${p.rating}</strong> <span style="color:var(--text-muted);">(${p.reviews})</span></span>
            <span class="card-meta-item">📍 ${p.area}, ${p.city}</span>
          </div>
        </div>
        <div>
          ${p.available
            ? '<span class="badge badge-success">Available</span>'
            : '<span class="badge badge-muted">Busy</span>'}
        </div>
      </div>
      <div class="card-skills-row">
        ${p.skills.map(s => `<span class="badge badge-muted">${escHtml(s)}</span>`).join('')}
      </div>
      <div class="card-footer">
        <div>
          <span class="card-price-sub">Starting at</span>
          <span class="card-price">₹${p.price}/hr</span>
        </div>
        <button class="btn btn-primary btn-sm" type="button" onclick="event.stopPropagation();window.location.href='profile.html?id=${p.id}'">View Profile →</button>
      </div>
    </div>
  `;
}

function totalPages() { return Math.ceil(state.filtered.length / state.perPage); }

function updatePagination() {
  const tp = totalPages();
  const prev = document.getElementById('prevPage');
  const next = document.getElementById('nextPage');
  if (prev) prev.disabled = state.page <= 1;
  if (next) next.disabled = state.page >= tp;

  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.className = 'page-btn' + (parseInt(btn.dataset.page) === state.page ? ' active' : '');
  });
}

function updateActiveFilters() {
  const container = document.getElementById('activeFilters');
  const tags = [];
  if (state.query)    tags.push({ label: `"${state.query}"`, key: 'query' });
  if (state.category) tags.push({ label: state.category, key: 'category' });
  if (state.location) tags.push({ label: `📍 ${state.location}`, key: 'location' });
  if (!tags.length) { container.style.display = 'none'; return; }
  container.style.display = 'flex';
  container.innerHTML = `<span style="font-size:.75rem;color:var(--text-muted);">Active:</span>` +
    tags.map(t => `<span class="filter-tag">${escHtml(t.label)} <button class="filter-tag-remove" data-key="${t.key}" type="button">✕</button></span>`).join('');
  container.querySelectorAll('.filter-tag-remove').forEach(btn => {
    btn.addEventListener('click', () => { state[btn.dataset.key] = ''; state.page = 1; applyFilters(); updateActiveFilters(); });
  });
}

function clearAll() {
  state = { ...state, category:'', query:'', location:'', minRating:0, priceMin:0, priceMax:9999, availableNow:false, page:1 };
  document.getElementById('searchQuery').value  = '';
  document.getElementById('locationInput').value = '';
  document.querySelectorAll('.category-chip').forEach(c => c.classList.toggle('active', c.dataset.cat === ''));
  applyFilters();
  updateActiveFilters();
}

function closeDrawer() {
  document.getElementById('filterDrawer')?.classList.remove('open');
  const overlay = document.getElementById('filterOverlay');
  if (overlay) overlay.style.display = 'none';
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
