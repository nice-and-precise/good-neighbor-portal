(() => {
  const state = { csrf: null, tenant: 'willmar-mn', token: null, loggedIn: false };
  const $ = (s) => document.querySelector(s);

  async function getJSON(url, opts={}) {
    const res = await fetch(url, opts);
    return res.json();
  }
  async function postJSON(url, data) {
    const headers = { 'Content-Type': 'application/json' };
    if (state.csrf) headers['X-CSRF'] = state.csrf;
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
    return res.json();
  }

  async function init() {
    try {
      const csrf = await getJSON('/api/csrf.php');
      state.csrf = csrf.csrf;
      const tns = await getJSON('/api/tenants.php');
      const sel = $('#tenant');
      sel.innerHTML = tns.tenants.map(t => `<option value="${t.slug}" ${t.slug===tns.active?'selected':''}>${t.name}</option>`).join('');
      $('#status').textContent = '';
    } catch (e) {
      $('#status').textContent = 'Init failed. Check server.';
    }
  }

  $('#request').addEventListener('click', async () => {
    const email = $('#email').value.trim();
    const tenant = $('#tenant').value;
    const res = await postJSON('/api/auth_request.php', { email, tenant });
    $('#token').value = res.token || '';
    $('#status').textContent = res.ok ? 'Token issued (demo: shown below).' : (res.error || 'error');
  });

  $('#verify').addEventListener('click', async () => {
    const token = $('#token').value.trim();
    const tenant = $('#tenant').value;
    const res = await postJSON('/api/auth_verify.php', { token, tenant });
    $('#status').textContent = res.ok ? 'Logged in.' : (res.error || 'error');
    if (res.ok) {
      state.loggedIn = true;
      $('#authed').style.display = '';
    }
  });

  $('#logout').addEventListener('click', async () => {
    await getJSON('/api/logout.php');
    state.loggedIn = false; $('#authed').style.display = 'none';
    $('#status').textContent = 'Logged out.';
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
