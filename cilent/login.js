const API_BASE = ''; 

const form = document.getElementById('loginForm');
const msg = document.getElementById('msg');
const btn = document.getElementById('btnLogin');

function setMsg(text, ok = false) {
  msg.className = ok ? 'ok' : 'err';
  msg.textContent = text || '';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setMsg('');
  btn.disabled = true;

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `登入失敗 (${res.status})`);
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    setMsg('登入成功，前往報名資料頁…', true);
    window.location.href = './app.html';
  } catch (err) {
    setMsg(err.message || String(err));
  } finally {
    btn.disabled = false;
  }
});
