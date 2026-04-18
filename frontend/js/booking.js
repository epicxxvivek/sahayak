/**
 * SAHAYAK — Booking Page JS
 * Handles booking context (book vs chat action), message polling stub.
 */

document.addEventListener('DOMContentLoaded', () => {
  const params   = new URLSearchParams(window.location.search);
  const bookingId  = params.get('id');
  const providerId = params.get('provider');
  const action     = params.get('action');

  // If arriving from profile "Book Now"
  if (action === 'book' && providerId && !bookingId) {
    // Show pre-filled booking creation UI (future enhancement)
    showToast('Fill in the chat details and confirm your booking with the provider.', 'info');
  }

  // If arriving from profile "Message"
  if (action === 'chat') {
    document.getElementById('chatInput')?.focus();
  }

  // Provider actions: hide if user is customer and vice-versa
  const user = getUser();
  if (user?.role === 'customer') {
    document.getElementById('providerActions')?.style && (document.getElementById('providerActions').style.display = 'none');
    document.getElementById('reviewSection') && (document.getElementById('reviewSection').style.display = 'block');
  }

  // Simple message polling (every 5s) — replace with WebSocket for real-time
  // startPolling(bookingId);
});

/**
 * Poll for new messages every 5 seconds.
 * Uncomment and wire to real API when backend is ready.
 */
function startPolling(bookingId) {
  if (!bookingId) return;
  let lastCount = document.getElementById('chatMessages')?.children.length || 0;

  setInterval(async () => {
    try {
      // const res = await Api.getMessages(bookingId);
      // const msgs = res.messages || [];
      // if (msgs.length > lastCount) {
      //   const newMsgs = msgs.slice(lastCount);
      //   newMsgs.forEach(m => appendIncomingMessage(m));
      //   lastCount = msgs.length;
      // }
    } catch (e) {
      console.warn('Message poll failed:', e.message);
    }
  }, 5000);
}

function appendIncomingMessage(msg) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;
  const group = document.createElement('div');
  group.className = 'message-group message-incoming';
  const time = new Date(msg.sentAt || Date.now());
  group.innerHTML = `
    <div class="message-bubble">${escHtml(msg.text)}</div>
    <p class="message-meta">${escHtml(msg.senderName || 'Them')} · ${time.getHours()}:${String(time.getMinutes()).padStart(2,'0')}</p>
  `;
  messages.appendChild(group);
  messages.scrollTop = messages.scrollHeight;
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('sahayak_user') || 'null'); } catch { return null; }
}

function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
