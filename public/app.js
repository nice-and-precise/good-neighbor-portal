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
      state.tenant = sel.value;
      $('#status').textContent = '';
    } catch (e) {
      $('#status').textContent = 'Init failed. Check server.';
    }
  }

  // Simple hash router for request and billing details
  async function route() {
    const el = document.getElementById('detail');
    if (!el) return;
    const h = location.hash || '';
    const mReq = h.match(/^#request\/(\d+)$/);
    const mBill = h.match(/^#billing\/(\d+)$/);
    if (mReq) {
      const id = mReq[1];
      try {
        const r = await getJSON(`/api/request_get.php?id=${id}`);
        if (r.ok) {
          const o = r.request;
          el.style.display = '';
          el.innerHTML = `
            <h3 style="margin-top:0">Request #${o.id}</h3>
            <div><strong>Category:</strong> ${o.category}</div>
            <div><strong>Status:</strong> ${o.status}</div>
            <div><strong>Address:</strong> ${o.address}</div>
            <div><strong>Created:</strong> ${o.created_at}</div>
            <div><strong>Updated:</strong> ${o.updated_at || '—'}</div>
            <div style="margin-top:.5rem"><em>${o.description || ''}</em></div>
          `;
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          el.style.display = '';
          el.textContent = 'Request not found';
        }
      } catch {
        el.style.display = '';
        el.textContent = 'Request error';
      }
      return;
    }
    if (mBill) {
      const id = mBill[1];
      try {
        const r = await getJSON(`/api/billing_get.php?id=${id}`);
        if (r.ok) {
          const b = r.charge; const money = (c)=>`$${(c/100).toFixed(2)}`;
          el.style.display = '';
          el.innerHTML = `
            <h3 style="margin-top:0">Charge #${b.id}</h3>
            <div><strong>Date:</strong> ${b.created_at}</div>
            <div><strong>Amount:</strong> ${money(b.amount_cents)}</div>
            <div style="margin-top:.5rem"><em>${b.description || ''}</em></div>
          `;
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          el.style.display = '';
          el.textContent = 'Charge not found';
        }
      } catch {
        el.style.display = '';
        el.textContent = 'Charge error';
      }
      return;
    }
    // No route
    el.style.display = 'none';
    el.innerHTML = '';
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
      await Promise.all([loadDashboard(), loadActivity()]);
      // Set tenant badge
      try {
        const tns = await getJSON('/api/tenants.php');
        const active = tns.active || state.tenant;
        const found = (tns.tenants || []).find(t => t.slug === active);
        $('#tenant-badge').textContent = `You're viewing: ${found ? found.name : active}`;
      } catch {}
      const anchor = document.getElementById('dashboard-anchor');
      if (anchor) { anchor.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      // Attempt to load detail route if present
      route();
    }
  });
  $('#req-submit').addEventListener('click', async () => {
    const category = $('#req-category').value;
    const description = $('#req-desc').value.trim();
    const res = await postJSON('/api/request_create.php', { category, description });
    if (res.ok) {
      $('#req-status').textContent = `Submitted request #${res.id} (status: ${res.status})`;
      await Promise.all([loadDashboard(), loadActivity()]);
      location.hash = `#request/${res.id}`;
      route();
    } else {
      $('#req-status').textContent = res.error || 'Request failed';
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

  window.addEventListener('hashchange', route);

  async function loadDashboard() {
    try {
      const d = await getJSON('/api/dashboard.php');
      if (!d.ok) { $('#dashboard').textContent = 'Dashboard unavailable.'; return; }
      const money = (c) => `$${(c/100).toFixed(2)}`;
      const bills = d.billing.map(b => `<li>${b.created_at}: ${b.description} <strong>${money(b.amount_cents)}</strong></li>`).join('');
      const lastReq = d.last_request ? `${d.last_request.created_at} — ${d.last_request.category} (${d.last_request.status})` : 'None';
      $('#dashboard').innerHTML = `
        <h3 style="margin-top:0">Resident Dashboard</h3>
        <div><strong>Next pickup:</strong> ${d.next_pickup_date}</div>
        <div style=\"margin-top:.5rem\"><strong>Last request:</strong> ${lastReq}</div>
        <div style="margin-top:.5rem"><strong>Billing</strong></div>
        <ul style="margin:.25rem 0 0 1rem">${bills || '<li>No charges</li>'}</ul>
      `;
    } catch { $('#dashboard').textContent = 'Dashboard error.'; }
  }

  async function loadActivity() {
    try {
      const r = await getJSON('/api/recent_activity.php');
      if (!r.ok) { $('#activity').textContent = 'Activity unavailable.'; return; }
      const money = (c) => `$${(c/100).toFixed(2)}`;
      const items = r.items.map(it => {
        if (it.kind === 'request') {
          const href = `#request/${it.id}`; // placeholder for future detail page
          return `<li>${it.created_at}: <a href="${href}">Request #${it.id}</a> — ${it.type} <em>(${it.status})</em></li>`;
        } else {
          const href = `#billing/${it.id}`; // placeholder for future detail page
          return `<li>${it.created_at}: <a href="${href}">Charge #${it.id}</a> — ${it.description} <strong>${money(it.amount_cents)}</strong></li>`;
        }
      }).join('');
      $('#activity').innerHTML = `
        <h3 style="margin-top:0">Recent Activity</h3>
        <ul style="margin:.25rem 0 0 1rem">${items || '<li>Nothing yet</li>'}</ul>
      `;
    } catch { $('#activity').textContent = 'Activity error.'; }
  }
  // Try to route on initial load (will only show after login)
  route();
})();
