const API_BASE = ''; 

const userText = document.getElementById('userText');
const topMsg = document.getElementById('topMsg');
const formMsg = document.getElementById('formMsg');
const listMsg = document.getElementById('listMsg');
const listEl = document.getElementById('list');
const btnLogout = document.getElementById('btnLogout');
const btnReload = document.getElementById('btnReload');
const btnSubmit = document.getElementById('btnSubmit');
const signupForm = document.getElementById('signupForm');

function setMsg(el, text, ok = false) {
  el.className = ok ? 'ok' : 'err';
  el.textContent = text || '';
}

function getToken() {
  return localStorage.getItem('token');
}
function getUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
}
function logout(reason) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  if (reason) alert(reason);
  window.location.href = './index.html';
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (!headers['Content-Type'] && options.body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    logout('登入已失效或未登入，請重新登入。');
    throw new Error('Unauthorized');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

function renderUser() {
  const u = getUser();
  if (!u) logout('請先登入');
  userText.textContent = `${u.email} `;
  const span = document.createElement('span');
  span.className = 'pill';
  span.textContent = u.role || 'student';
  userText.appendChild(span);
}

function renderList(items) {
  listEl.innerHTML = '';
  if (!items || items.length === 0) {
    listMsg.textContent = '目前沒有資料';
    return;
  }
  listMsg.textContent = `共 ${items.length} 筆`;
  for (const it of items) {
    const li = document.createElement('li');
    const id = it._id || it.id;
    li.innerHTML = `<b>${it.name}</b> — ${it.email} — ${it.phone || ''} <span class="muted">(${id})</span> `;
    const btn = document.createElement('button');
    btn.textContent = '刪除';
    btn.addEventListener('click', async () => {
      if (!confirm('確定要刪除這筆資料嗎？')) return;
      try {
        await apiFetch(`/api/signup/${id}`, { method: 'DELETE' });
        await loadList();
      } catch (e) {
        setMsg(topMsg, e.message || String(e));
      }
    });
    li.appendChild(btn);
    listEl.appendChild(li);
  }
}

async function loadList() {
  setMsg(topMsg, '');
  listMsg.textContent = '載入中…';
  const data = await apiFetch('/api/signup', { method: 'GET' });
  const items = data.items || data.data || [];
  renderList(items);
}

btnLogout.addEventListener('click', () => logout());

btnReload.addEventListener('click', () => loadList().catch(e => setMsg(topMsg, e.message || String(e))));

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setMsg(formMsg, '');
  btnSubmit.disabled = true;

  try {
    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim()
    };
    await apiFetch('/api/signup', { method: 'POST', body: JSON.stringify(payload) });
    setMsg(formMsg, '送出成功', true);
    signupForm.reset();
    await loadList();
  } catch (err) {
    setMsg(formMsg, err.message || String(err));
  } finally {
    btnSubmit.disabled = false;
  }
});

renderUser();
loadList().catch(e => setMsg(topMsg, e.message || String(e)));
