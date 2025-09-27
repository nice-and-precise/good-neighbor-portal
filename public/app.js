(() => {
  const state = { csrf: null, tenant: 'willmar-mn', token: null, loggedIn: false, pollTimer: null, detail: null };
  const $ = (s) => document.querySelector(s);

  async function getJSON(url, opts={}) {
    const res = await fetch(url, opts);
    return res.json();
  }
  async function postJSON(url, data, extraHeaders={}) {
    const headers = { 'Content-Type': 'application/json', ...extraHeaders };
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
      await loadI18n();
      applyI18n();
    } catch (e) {
      $('#status').textContent = 'Init failed. Check server.';
    }
  }

  // Helpers for request detail refresh and notes
  async function loadRequestDetail(id) {
    const el = document.getElementById('detail');
    try {
      const r = await getJSON(`/api/request_get.php?id=${id}`);
      if (r.ok) {
        const o = r.request;
        const statusEl = document.getElementById('detail-status');
        const updatedEl = document.getElementById('detail-updated');
        if (statusEl) statusEl.textContent = o.status;
        if (updatedEl) updatedEl.textContent = o.updated_at || '—';
        // Keep description immutable for now
      } else {
        el.style.display = '';
        el.textContent = 'Request not found';
      }
    } catch {
      el.style.display = '';
      el.textContent = 'Request error';
    }
  }

  async function loadRequestNotes(id) {
    const notesEl = document.getElementById('notes');
    if (!notesEl) return;
    try {
      const r = await getJSON(`/api/request_notes.php?request_id=${id}`);
      if (r.ok) {
        const items = (r.notes || []).map(n => `<li><strong>${n.staff_name || 'Staff'}</strong> — <span class="muted">${n.created_at}</span><br/>${escapeHtml(n.note)}</li>`).join('');
        notesEl.innerHTML = `<ul style="margin:.25rem 0 0 1rem">${items || '<li>No notes yet</li>'}</ul>`;
      } else {
        notesEl.textContent = 'Notes unavailable';
      }
    } catch {
      notesEl.textContent = 'Notes error';
    }
  }

  function startPolling(id) {
    if (state.pollTimer) { clearInterval(state.pollTimer); state.pollTimer = null; }
    state.pollTimer = setInterval(() => {
      // Only poll if still on same request route
      const hash = location.hash;
      if (!hash.match(/^#request\/(\d+)$/)) { clearInterval(state.pollTimer); state.pollTimer = null; return; }
      loadRequestDetail(id);
      loadRequestNotes(id);
    }, 8000);
  }

  function stopPolling() { if (state.pollTimer) { clearInterval(state.pollTimer); state.pollTimer = null; } }

  function escapeHtml(s) { return String(s).replace(/[&<>"]{1}/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

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
            <a href="#" id="back-link" style="text-decoration:none">← Back</a>
            <h3 style="margin:.25rem 0 0">Request #${o.id}</h3>
            <div><strong>Category:</strong> ${o.category}</div>
            <div><strong>Status:</strong> <span id="detail-status">${o.status}</span></div>
            <div><strong>Address:</strong> ${o.address}</div>
            <div><strong>Created:</strong> ${o.created_at}</div>
            <div><strong>Updated:</strong> <span id="detail-updated">${o.updated_at || '—'}</span></div>
            <div style="margin-top:.5rem"><em>${o.description || ''}</em></div>
            <hr/>
            <div>
              <h4 style="margin:.25rem 0">Staff controls (demo)</h4>
              <label>Staff header key <input id="staff-key" type="text" placeholder="demo-staff" style="margin-left:.25rem"/></label>
              <div style="margin-top:.5rem; display:flex; gap:.5rem; flex-wrap:wrap">
                <button data-action="ack">Mark Acknowledged</button>
                <button data-action="in_progress">Start Work</button>
                <button data-action="done">Mark Done</button>
                <button data-action="cancelled">Cancel</button>
              </div>
              <div style="margin-top:.5rem">
                <input id="note-text" type="text" placeholder="Add staff note..." style="width:70%"/>
                <button id="note-add">Add Note</button>
                <div id="note-status" class="muted" style="margin-top:.25rem"></div>
              </div>
            </div>
            <div style="margin-top:.75rem">
              <h4 style="margin:.25rem 0">Notes</h4>
              <div id="notes" class="card" style="background:#f9f9ff"></div>
            </div>
          `;
          // Listeners
          const back = document.getElementById('back-link');
          if (back) back.addEventListener('click', (e) => { e.preventDefault(); stopPolling(); location.hash = ''; });
          const keyInput = document.getElementById('staff-key');
          const noteInput = document.getElementById('note-text');
          const noteStatus = document.getElementById('note-status');
          const btns = el.querySelectorAll('button[data-action]');
          btns.forEach(b => b.addEventListener('click', async () => {
            const action = b.getAttribute('data-action');
            const k = (keyInput && keyInput.value.trim()) || 'demo-staff';
            b.disabled = true;
            const res = await postJSON('/api/request_status_update.php', { id: Number(id), action }, { 'X-Staff-Key': k });
            b.disabled = false;
            if (res.ok) {
              await loadRequestDetail(id);
            } else {
              alert(res.error || 'Status update failed');
            }
          }));
          const addBtn = document.getElementById('note-add');
          if (addBtn) addBtn.addEventListener('click', async () => {
            const note = (noteInput && noteInput.value.trim()) || '';
            const k = (keyInput && keyInput.value.trim()) || 'demo-staff';
            if (!note) { noteStatus.textContent = 'Enter a note first.'; return; }
            addBtn.disabled = true;
            const res = await postJSON('/api/request_note_create.php', { request_id: Number(id), note }, { 'X-Staff-Key': k });
            addBtn.disabled = false;
            if (res.ok) { noteInput.value = ''; noteStatus.textContent = 'Note added.'; await loadRequestNotes(id); }
            else { noteStatus.textContent = res.error || 'Note failed'; }
          });
          // Initial loads and polling
          await loadRequestNotes(id);
          startPolling(id);
          state.detail = { kind: 'request', id: Number(id) };
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
      stopPolling();
      state.detail = { kind: 'billing', id: Number(id) };
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
    stopPolling();
    state.detail = null;
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
  // Load staff queue default silently
  try { await loadStaffQueue(); } catch {}
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

  // Demo pay
  const payBtn = document.getElementById('pay-now');
  if (payBtn) payBtn.addEventListener('click', async () => {
    const amt = parseInt(document.getElementById('pay-amount').value, 10) || 0;
    const method = document.getElementById('pay-method').value || 'card';
    const res = await postJSON('/api/pay_demo.php', { amount_cents: amt, method });
    const el = document.getElementById('pay-status');
    if (res && res.ok) el.textContent = `Paid ${res.amount_cents}c via ${res.method} (demo).`;
    else el.textContent = (res && res.message) || 'Payment failed (demo).';
  });

  // Staff queue
  let queueTimer = null;
  async function loadStaffQueue() {
    const statusSel = document.getElementById('queue-status');
    const keyInput = document.getElementById('queue-staff-key');
    const listEl = document.getElementById('queue-list');
    if (!statusSel || !keyInput || !listEl) return;
    const status = statusSel.value;
    const key = (keyInput.value || 'demo-staff').trim();
    listEl.textContent = 'Loading…';
    try {
      const r = await fetch(`/api/staff_queue.php?status=${encodeURIComponent(status)}`, {
        headers: { 'X-Staff-Key': key }
      });
      const j = await r.json();
      if (!j.ok) { listEl.textContent = j.error || 'Queue error'; return; }
      const items = (j.items || []).map(it => `<li><a href="#request/${it.id}">#${it.id}</a> — ${it.category} — ${it.status} — ${it.address}</li>`).join('');
      listEl.innerHTML = `<ul style="margin:.25rem 0 0 1rem">${items || '<li>No items</li>'}</ul>`;
    } catch (e) {
      listEl.textContent = 'Queue load failed';
    }
  }
  const qBtn = document.getElementById('queue-load');
  if (qBtn) qBtn.addEventListener('click', () => loadStaffQueue());
  const qAuto = document.getElementById('queue-auto');
  if (qAuto) qAuto.addEventListener('change', () => {
    if (qAuto.checked) {
      if (queueTimer) clearInterval(queueTimer);
      queueTimer = setInterval(loadStaffQueue, 5000);
      loadStaffQueue();
    } else if (queueTimer) {
      clearInterval(queueTimer); queueTimer = null;
    }
  });

  // i18n toggle: persist session lang; string swap can be added later
  const i18nEl = document.getElementById('i18n');
  if (i18nEl) {
    i18nEl.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      const lang = btn.getAttribute('data-lang');
      try {
        const res = await postJSON('/api/i18n_switch.php', { lang });
        if (res.ok) {
          await loadI18n(res.lang);
          applyI18n();
          document.getElementById('i18n-status').textContent = `Language set to ${res.lang}.`;
        } else {
          document.getElementById('i18n-status').textContent = res.error || 'Lang toggle failed';
        }
      } catch { document.getElementById('i18n-status').textContent = 'Lang toggle failed'; }
    });
  }

  // i18n support
  const i18n = { lang: 'en', strings: {} };
  async function loadI18n(next) {
    i18n.lang = next || i18n.lang || 'en';
    try {
      const res = await fetch(`/i18n/${i18n.lang}.json`, { cache: 'no-store' });
      i18n.strings = await res.json();
    } catch { i18n.strings = {}; }
  }
  function t(key, fallback) { return i18n.strings[key] || fallback || key; }
  function applyI18n() {
    // Document title
    document.title = t('title', document.title);
    // All elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = t(key, el.textContent);
    });
  }

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

  window.addEventListener('hashchange', () => { route(); if (state.loggedIn) { loadActivity(); } });

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
      const current = location.hash || '';
      const items = r.items.map(it => {
        if (it.kind === 'request') {
          const href = `#request/${it.id}`; // placeholder for future detail page
          const style = (current === href) ? 'style="font-weight:bold;text-decoration:underline"' : '';
          return `<li>${it.created_at}: <a href="${href}" ${style}>Request #${it.id}</a> — ${it.type} <em>(${it.status})</em></li>`;
        } else {
          const href = `#billing/${it.id}`; // placeholder for future detail page
          const style = (current === href) ? 'style="font-weight:bold;text-decoration:underline"' : '';
          return `<li>${it.created_at}: <a href="${href}" ${style}>Charge #${it.id}</a> — ${it.description} <strong>${money(it.amount_cents)}</strong></li>`;
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
