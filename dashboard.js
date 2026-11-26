// Feature: right side output dashboard
const Dash = {
  el: () => document.getElementById('dash'),
  show(d) {
    const el = this.el(); el.innerHTML = '';
    if (!d) { el.innerHTML = '<div class="dempty">Abhi koi output nahi. Automation ka "dashboard" jawab yahan dikhega.</div>'; return; }
    const add = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; el.appendChild(n); return n; };
    if (typeof d === 'string') {
      if (/<[a-z][\s\S]*>/i.test(d)) return this.frame(d);
      return add('div', 'dtext', d);
    }
    if (Array.isArray(d)) return this.table(d);
    if (d.title) add('div', 'dtitle', d.title);
    if (Array.isArray(d.cards)) {
      const g = add('div', 'card-grid');
      d.cards.forEach(c => { const k = document.createElement('div'); k.className = 'card';
        k.innerHTML = '<small></small><strong></strong>'; k.children[0].textContent = c.label ?? ''; k.children[1].textContent = c.value ?? ''; g.appendChild(k); });
    }
    if (Array.isArray(d.table)) this.table(d.table);
    if (d.text) add('div', 'dtext', d.text);
    if (d.html) this.frame(d.html);
    if (!d.cards && !d.table && !d.text && !d.html) add('pre', 'dtext', JSON.stringify(d, null, 2));
  },
  table(rows) {
    if (!rows.length || typeof rows[0] !== 'object') { const p = document.createElement('pre'); p.className = 'dtext'; p.textContent = JSON.stringify(rows, null, 2); return this.el().appendChild(p); }
    const cols = [...new Set(rows.flatMap(r => Object.keys(r)))];
    const w = document.createElement('div'); w.className = 'tblwrap';
    const t = document.createElement('table');
    const hr = t.createTHead().insertRow(); cols.forEach(c => { const th = document.createElement('th'); th.textContent = c; hr.appendChild(th); });
    const tb = t.createTBody(); rows.forEach(r => { const tr = tb.insertRow(); cols.forEach(c => { tr.insertCell().textContent = typeof r[c] === 'object' ? JSON.stringify(r[c]) : (r[c] ?? ''); }); });
    w.appendChild(t); this.el().appendChild(w);
  },
  frame(html) { const f = document.createElement('iframe'); f.setAttribute('sandbox', 'allow-scripts'); f.srcdoc = html; this.el().appendChild(f); }
};
