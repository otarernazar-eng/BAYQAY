/**
 * BAYQAY — Шайыр картасы, Шайыр тарихы, Мұра, BAYQAY Analytics.
 * Деректер: js/bayqay-data.js (window.BAYQAY_DATA).
 */
(function () {
  'use strict';

  const D = window.BAYQAY_DATA;
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => String(n).replace('.', ','); // 73.3 -> 73,3

  const NAV_ITEMS = [
    { key: 'home', icon: 'fa-house', label: 'Басты бет', screen: 'screen-home' },
    { key: 'map', icon: 'fa-location-dot', label: 'Карта', screen: 'screen-map' },
    { key: 'heritage', icon: 'fa-landmark', label: 'Мұра', screen: 'screen-heritage' },
    { key: 'analytics', icon: 'fa-chart-column', label: 'Талдау', screen: 'screen-analytics' },
  ];

  const byId = (id) => D.heritage.find((h) => h.id === id);

  function sourceBadge(verified) {
    return verified
      ? '<span class="bq-badge ok"><i class="fa-solid fa-circle-check"></i> Дереккөзбен расталған</span>'
      : '<span class="bq-badge pending"><i class="fa-solid fa-clock"></i> Дерек нақтылануда</span>';
  }

  const mockBadge = () =>
    D.showMockBadges ? '<span class="bq-badge mock">Зерттеу дерегі</span>' : '';

  /* ---------- Bottom nav ---------- */
  function renderNavs() {
    document.querySelectorAll('.bq-nav').forEach((el) => {
      const active = el.dataset.active;
      el.innerHTML = NAV_ITEMS.map(
        (n) =>
          `<button class="${n.key === active ? 'active' : ''}" onclick="nav('${n.screen}')">` +
          `<i class="fa-solid ${n.icon}"></i><span>${n.label}</span></button>`
      ).join('');
    });
  }

  /* ---------- Splash / Home ---------- */
  function initImages() {
    $('screen-splash').style.backgroundImage = "url('assets/img/hero.jpg')";
    $('bq-home-hero').style.backgroundImage = "url('assets/img/hero.jpg')";
    $('bq-home-hero').style.backgroundPosition = 'center 55%';
  }

  window.bqStart = function () {
    sessionStorage.setItem('bq_started', '1');
    window.nav('screen-home');
  };

  /* ---------- Heritage (list + detail) ---------- */
  function renderHeritageList() {
    $('bq-heritage-list').innerHTML = D.heritage
      .map(
        (h) => `
      <div class="bq-card bq-item" onclick="bqOpenHeritage('${h.id}')">
        <img src="${esc(h.photo)}" alt="${esc(h.name)}" style="object-position:${esc(h.photoPos || 'center')}">
        <div class="grow">
          <b>${esc(h.name)}</b>
          <small>${esc(h.type)}${h.period ? ` • ${esc(h.period)}` : ''}</small>
        </div>
        <i class="fa-solid fa-chevron-right"></i>
      </div>`
      )
      .join('');
  }

  window.bqOpenHeritage = function (id) {
    const h = byId(id);
    if (!h) return;

    const factsHtml = h.facts && h.facts.length ? `
      <div class="bq-card" style="padding:12px 14px;margin:14px 0;background:#fbfaf6;">
        <div style="font-size:11px;font-weight:700;margin-bottom:8px;text-transform:uppercase;color:var(--bq-muted);letter-spacing:0.04em;">
          <i class="fa-solid fa-list-check" style="margin-right:4px;"></i> Негізгі фактілер
        </div>
        ${h.facts.map(([k,v]) => `
          <div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;padding:5px 0;border-bottom:1px dashed var(--bq-line);">
            <span style="color:var(--bq-muted);flex-shrink:0;">${esc(k)}</span>
            <b style="text-align:right;color:var(--bq-text);">${esc(v)}</b>
          </div>`).join('')}
      </div>` : '';

    const sourcesHtml = h.sources && h.sources.length ? `
      <div style="margin-top:6px;display:flex;flex-direction:column;gap:5px;">
        ${h.sources.map(s => s.u ? `
          <a href="${esc(s.u)}" target="_blank" rel="noopener" style="color:var(--bq-green);font-size:11.5px;text-decoration:underline;display:inline-flex;align-items:center;gap:5px;line-height:1.4;">
            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px;"></i> ${esc(s.t)}
          </a>` : `<span style="color:var(--bq-muted);font-size:11.5px;line-height:1.4;">${esc(s.t)}</span>`).join('')}
      </div>` : `<b>${esc(h.source)}</b>`;

    const noteHtml = h.note ? `
      <div class="bq-card" style="padding:10px 12px;margin:12px 0;background:#fff8ee;border-color:#f6d9aa;font-size:11.5px;color:#854d0e;line-height:1.45;">
        <i class="fa-solid fa-circle-info" style="margin-right:6px;"></i> ${esc(h.note)}
      </div>` : '';

    const photoCreditHtml = h.photoCredit ? `
      <div style="font-size:10.5px;color:var(--bq-muted);margin:-8px 0 12px;line-height:1.35;">
        ${h.photoCreditUrl ? `<a href="${esc(h.photoCreditUrl)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">${esc(h.photoCredit)}</a>` : esc(h.photoCredit)}
      </div>` : (h.photoPlaceholder ? `<div style="font-size:10.5px;color:var(--bq-muted);margin:-8px 0 12px;font-style:italic;">(Көрнекі фотосурет)</div>` : '');

    $('bq-heritage-detail').innerHTML = `
      <img class="bq-photo" src="${esc(h.photo)}" alt="${esc(h.name)}" style="object-position:${esc(h.photoPos || 'center')}">
      ${photoCreditHtml}
      <h2>${esc(h.name)}</h2>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:4px 0 10px;">
        <span class="bq-pill">${esc(h.type)}</span>
        ${h.period ? `<span class="bq-pill" style="background:#f4ede2;color:#785428;">${esc(h.period)}</span>` : ''}
        ${sourceBadge(h.verified)}
      </div>
      <p style="font-size:13.5px;line-height:1.6;color:#2b3a32;margin:10px 0 14px;">${esc(h.history)}</p>
      ${factsHtml}
      <div class="bq-info"><i class="fa-solid fa-star"></i><div><small>Нысанның тарихи маңызы</small><b>${esc(h.significance)}</b></div></div>
      <div class="bq-info"><i class="fa-solid fa-location-dot"></i><div><small>Орналасуы</small><b>${esc(h.location)}</b></div></div>
      <div class="bq-info"><i class="fa-solid fa-book-bookmark"></i><div><small>Дереккөздер мен құжаттар</small>${sourcesHtml}</div></div>
      ${noteHtml}
      <button class="bq-btn" style="margin-top:12px" onclick="bqShowOnMap('${h.id}')">
        <i class="fa-solid fa-map-location-dot"></i> Картада қарау
      </button>`;

    window.nav('screen-heritage-detail');
    $('screen-heritage-detail').scrollTop = 0;
  };

  /* ---------- Timeline ---------- */
  function renderTimeline() {
    $('bq-timeline').innerHTML = D.timeline
      .map(
        (t) => {
          const sourcesList = t.sources && t.sources.length
            ? t.sources.map(s => s.u
                ? `<a href="${esc(s.u)}" target="_blank" rel="noopener" style="color:var(--bq-green);text-decoration:underline;">${esc(s.t)}</a>`
                : esc(s.t)
              ).join(' • ')
            : esc(t.source || '');
          return `
      <div class="bq-tl-item ${t.verified ? '' : 'pending'}">
        <div class="bq-tl-date">${esc(t.date)}</div>
        <b style="display:block;font-size:14px;margin-bottom:4px;color:var(--bq-text);">${esc(t.title)}</b>
        <p class="bq-tl-text">${esc(t.text)}</p>
        <div class="bq-tl-src">
          <span><i class="fa-solid fa-file-lines"></i> ${sourcesList}</span>
          ${sourceBadge(t.verified)}
        </div>
      </div>`;
        }
      )
      .join('');
  }

  /* ---------- Map ---------- */
  let map = null;
  const markers = {};
  let selectedId = null;

  function pinIcon(selected) {
    return L.divIcon({
      className: 'bq-pin' + (selected ? ' sel' : ''),
      html: '<i class="fa-solid fa-location-dot"></i>',
      iconSize: [30, 36],
      iconAnchor: [15, 34],
    });
  }

  function renderChips() {
    $('bq-map-chips').innerHTML = D.heritage
      .map((h) => `<button class="bq-chip ${h.id === selectedId ? 'active' : ''}" onclick="bqSelectOnMap('${h.id}')">${esc(h.name)}</button>`)
      .join('');
  }

  function renderMapCard(h) {
    const card = $('bq-map-card');
    if (!h) { card.classList.remove('show'); return; }
    card.innerHTML = `
      <button class="x" onclick="bqSelectOnMap(null)" aria-label="Жабу"><i class="fa-solid fa-xmark"></i></button>
      <img src="${esc(h.photo)}" alt="${esc(h.name)}" style="object-position:${esc(h.photoPos || 'center')}">
      <div style="flex:1;min-width:0">
        <h4>${esc(h.name)}</h4>
        <small style="color:var(--bq-muted);font-size:10.5px">${esc(h.type)}${h.period ? ` (${esc(h.period)})` : ''}</small>
        <p>${esc(h.short)}</p>
        <button class="bq-btn bq-btn-outline" onclick="bqOpenHeritage('${h.id}')">Толығырақ <i class="fa-solid fa-arrow-right"></i></button>
      </div>`;
    card.classList.add('show');
  }

  window.bqSelectOnMap = function (id, fly) {
    selectedId = id;
    Object.keys(markers).forEach((k) => markers[k].setIcon(pinIcon(k === id)));
    const h = id ? byId(id) : null;
    renderMapCard(h);
    renderChips();
    if (h && map && fly !== false) map.flyTo(h.coords, Math.max(map.getZoom(), 11), { duration: 0.6 });
  };

  window.bqShowOnMap = function (id) {
    window.nav('screen-map');
    setTimeout(() => window.bqSelectOnMap(id), 120);
  };

  function initMap() {
    renderChips();
    if (map) { map.invalidateSize(); return; }
    if (!window.L) {
      $('bq-map').innerHTML = '<div class="bq-map-fallback">Картаны жүктеу үшін интернет байланысы қажет.</div>';
      return;
    }
    map = L.map('bq-map', { zoomControl: false }).setView(D.mapCenter, D.mapZoom);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: 'Tiles © Esri',
    }).addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Ауыл орталығының маркері
    if (D.village && D.village.coords) {
      const vIcon = L.divIcon({
        className: 'bq-village-pin',
        html: '<div style="background:#1f3d33;color:#fff;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:1px solid #fff;"><i class="fa-solid fa-house" style="font-size:9px;"></i> Шайыр</div>',
        iconSize: [60, 20],
        iconAnchor: [30, 10],
      });
      L.marker(D.village.coords, { icon: vIcon, title: 'Шайыр ауылы' })
        .addTo(map)
        .bindPopup('<b>Шайыр ауылы</b><br>Маңғыстау ауданы, Шайыр ауылдық округі орталығы');
    }

    D.heritage.forEach((h) => {
      markers[h.id] = L.marker(h.coords, { icon: pinIcon(false), title: h.name })
        .addTo(map)
        .on('click', () => window.bqSelectOnMap(h.id, false));
    });
    map.fitBounds(L.latLngBounds(D.heritage.map((h) => h.coords)).pad(0.35));
  }

  /* ---------- Analytics ---------- */
  const R = 30;
  const C = 2 * Math.PI * R;

  function ring(value, color) {
    return `
      <div class="bq-ring-wrap">
        <svg width="74" height="74" viewBox="0 0 74 74">
          <circle cx="37" cy="37" r="${R}" fill="none" stroke="#e9e6dc" stroke-width="7"/>
          <circle class="bq-ring-arc" cx="37" cy="37" r="${R}" fill="none" stroke="${color}" stroke-width="7"
            stroke-linecap="round" stroke-dasharray="0 ${C}" data-len="${(C * value) / 100}"/>
        </svg>
        <b>${fmt(value)}%</b>
      </div>`;
  }

  const PIE_COLORS = ['#1f3d33', '#7d8f86', '#c9d1cc'];
  function donut(answers) {
    let offset = 0;
    const segs = answers
      .map((a, i) => {
        const len = (C * a.value) / 100;
        const s = `<circle cx="37" cy="37" r="${R}" fill="none" stroke="${PIE_COLORS[i % 3]}" stroke-width="12"
          stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}"/>`;
        offset += len;
        return s;
      })
      .join('');
    return `<svg width="96" height="96" viewBox="0 0 74 74" style="transform:rotate(-90deg);flex:none">${segs}</svg>`;
  }

  function renderAnalytics() {
    const A = D.analytics;
    $('bq-rings').innerHTML = A.summary
      .map((s) => `<div class="bq-card bq-ring-card">${ring(s.value, s.color)}${esc(s.label)}</div>`)
      .join('');
    $('bq-participants').innerHTML = A.participants
      .map(
        (p) => `<div class="bq-bar-row"><span class="lbl">${esc(p.label)}</span>
          <div class="bq-bar"><i data-w="${p.value}"></i></div><span class="val">${p.value}%</span></div>`
      )
      .join('') + (D.showMockBadges ? `<div style="margin-top:6px">${mockBadge()}</div>` : '');

    $('bq-questions').innerHTML = A.questions
      .map(
        (q) => `
      <div class="bq-card bq-q"><h4>${esc(q.title)}</h4>
        <div class="bq-q-body">${donut(q.answers)}
          <div class="bq-legend">${q.answers
            .map((a, i) => `<div><i style="background:${PIE_COLORS[i % 3]}"></i><span>${esc(a.label)}</span><b>${fmt(a.value)}%</b></div>`)
            .join('')}</div>
        </div></div>`
      )
      .join('');
  }

  function animateAnalytics() {
    requestAnimationFrame(() => {
      document.querySelectorAll('#bq-rings .bq-ring-arc').forEach((c) => {
        const len = parseFloat(c.dataset.len);
        c.style.transition = 'stroke-dasharray .9s ease';
        c.setAttribute('stroke-dasharray', `${len} ${C}`);
      });
      document.querySelectorAll('#bq-participants .bq-bar > i').forEach((b) => (b.style.width = b.dataset.w + '%'));
    });
  }

  function resetAnalyticsAnim() {
    document.querySelectorAll('#bq-rings .bq-ring-arc').forEach((c) => {
      c.style.transition = 'none';
      c.setAttribute('stroke-dasharray', `0 ${C}`);
    });
    document.querySelectorAll('#bq-participants .bq-bar > i').forEach((b) => (b.style.width = '0'));
  }

  /* ---------- nav() hook ---------- */
  const originalNav = window.nav;
  window.nav = function (screenId) {
    originalNav(screenId);
    const scr = $(screenId);
    if (scr && scr.scrollTo) scr.scrollTop = 0;
    if (screenId === 'screen-map') setTimeout(initMap, 40);
    if (screenId === 'screen-analytics') { resetAnalyticsAnim(); setTimeout(animateAnalytics, 40); }
  };

  /* ---------- init ---------- */
  renderNavs();
  initImages();
  renderHeritageList();
  renderTimeline();
  renderAnalytics();
  window.nav(sessionStorage.getItem('bq_started') ? 'screen-home' : 'screen-splash');
})();
