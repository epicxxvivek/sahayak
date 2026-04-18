/**
 * SAHAYAK — Auth JS (login.html + signup.html)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── LOGIN FORM ─────────────────────────────────────────────────
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email    = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const btn      = document.getElementById('loginBtn');
      const txt      = document.getElementById('loginBtnText');
      const spin     = document.getElementById('loginBtnSpinner');

      // Basic validation
      let valid = true;
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('emailError', 'Enter a valid email address.');
        valid = false;
      } else {
        hideFieldError('emailError');
      }
      if (!password) {
        showFieldError('passwordError', 'Password is required.');
        valid = false;
      } else {
        hideFieldError('passwordError');
      }
      if (!valid) return;

      // Loading state
      btn.disabled = true;
      txt.style.display = 'none';
      spin.style.display = 'inline-block';

      try {
        // ── Real API call (uncomment when backend is ready) ──
        // const data = await Api.login(email, password);

        // ── MOCK (remove after adding backend) ──
        await new Promise(r => setTimeout(r, 1000));
        const mockUser = { _id: '1', name: 'Ramesh Kumar', email, role: 'provider' };
        localStorage.setItem('sahayak_token', 'mock_jwt_token_' + Date.now());
        localStorage.setItem('sahayak_user', JSON.stringify(mockUser));

        showAlert('Login successful! Redirecting…', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);

      } catch (err) {
        showAlert(err.message || 'Invalid email or password. Please try again.', 'error');
        btn.disabled = false;
        txt.style.display = '';
        spin.style.display = 'none';
      }
    });
  }

  // ── HELPERS ────────────────────────────────────────────────────
  function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
  }

  function hideFieldError(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function showAlert(msg, type = 'error') {
    const el = document.getElementById('authAlert');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.style.background = type === 'success' ? 'var(--success-subtle)' : 'var(--error-subtle)';
    el.style.color      = type === 'success' ? 'var(--success)'        : 'var(--error)';
    el.style.border     = `1px solid ${type === 'success' ? 'rgba(16,185,129,.25)' : 'rgba(239,68,68,.25)'}`;
    el.style.borderRadius = 'var(--radius-md)';
  }

  // Update navbar based on auth state
  updateNavAuth();
});

function updateNavAuth() {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('sahayak_user') || 'null'); } catch { return null; }
  })();
  const navActions = document.getElementById('navActions');
  if (!navActions) return;

  if (user) {
    navActions.innerHTML = `
      <a href="dashboard.html" class="btn btn-primary btn-sm">📊 Dashboard</a>
    `;
  }
}
