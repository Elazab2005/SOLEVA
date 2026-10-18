'use strict';
/* ---------- Utilities & storage ---------- */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const t = k => I18N.t(k), money = n => I18N.money(n);
const deb = (f, ms) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => f(...a), ms); }; };
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } } };
const loadCart = () => store.get('soleva_cart', []), loadWishlist = () => store.get('soleva_wishlist', []);
let cart = loadCart(), wishlist = loadWishlist(), prefs = store.get('soleva_preferences', {}), ALL = [];
const saveCart = () => { store.set('soleva_cart', cart); updateBadges(); };
const saveWishlist = () => { store.set('soleva_wishlist', wishlist); updateBadges(); };
const P = id => ALL.find(p => p.id == id);
const productName = p => I18N.lang === 'ar' ? (p?.nameAr || p?.name || '') : (p?.name || '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const colorLabel = c => { const k = 'gen.color.' + String(c).toLowerCase(), v = t(k); return v === k ? String(c) : v; };
const catLabel = c => t('gen.cat.' + String(c).toLowerCase());
const genderLabel = g => t('gen.gender.' + String(g).toLowerCase());

/* ---------- Toast & overlays ---------- */
function showToast(m) { const e = $('#toast'); e.textContent = m; e.classList.add('show'); clearTimeout(showToast.id); showToast.id = setTimeout(() => e.classList.remove('show'), 2400); }
let layerOpener = null;
function openLayer(id, focusSel) { const l = $('#' + id); layerOpener = document.activeElement; l.classList.add('open'); $('#scrim').classList.add('open'); document.body.style.overflow = 'hidden'; setTimeout(() => (focusSel ? $(focusSel) : l.querySelector('button,input,a'))?.focus(), 60); }
function closeAll() { $$('.open').forEach(e => e.classList.remove('open')); document.body.style.overflow = ''; $('#nav')?.classList.remove('menu-open'); $('[data-menu]')?.setAttribute('aria-expanded', 'false'); const opener = layerOpener; layerOpener = null; if (opener?.isConnected) opener.focus(); }
const openCart = () => { renderCart(); openLayer('cart'); }, openSearch = () => { openLayer('search', '#q'); };

/* ---------- Cart ---------- */
function addToCart(p, size, color, qty = 1) {
  if (!p || !p.sizes.includes(+size)) { showToast(t('toast.selectsize')); return false; }
  const key = `${p.id}-${size}-${color}`, l = cart.find(i => i.key === key);
  l ? l.qty = Math.min(10, l.qty + qty) : cart.push({ key, id: p.id, name: p.name, price: p.price, image: p.images[0], size: +size, color, qty: Math.min(10, qty) });
  saveCart(); renderCart(); showToast(t('toast.added')); return true;
}
function removeFromCart(key) { cart = cart.filter(i => i.key !== key); saveCart(); renderCart(); showToast(t('toast.removed')); }
function updateQuantity(key, d) { const l = cart.find(i => i.key === key); if (l) l.qty = Math.min(10, Math.max(1, l.qty + d)); saveCart(); renderCart(); }
function calculateCartTotal() { const sub = cart.reduce((s, l) => s + l.price * l.qty, 0); return { sub, ship: null, total: sub }; }
function renderCart() {
  const T = calculateCartTotal();
  $('#cbody').innerHTML = cart.length ? cart.map(l => { const name = productName(P(l.id)) || l.name; return `<div class="li"><img src="${l.image}" alt="${esc(name)}"><div><h4>${esc(name)}</h4><small>${t('cart.size')} ${l.size} · ${colorLabel(l.color)}</small><div class="qty"><button data-dec="${l.key}" aria-label="${t('a11y.dec')}">−</button><span>${l.qty}</span><button data-inc="${l.key}" aria-label="${t('a11y.inc')}">+</button></div></div><div class="r"><b>${money(l.price * l.qty)}</b><button class="lnk" data-rm="${l.key}">${t('cart.remove')}</button></div></div>`; }).join('')
    : `<div class="empty"><h3>${t('cart.empty')}</h3><a class="btn" href="shop.html">${t('gen.shop')}</a></div>`;
  $('#cfoot').innerHTML = cart.length ? `<div class="row tot"><span>${t('cart.subtotal')}</span><span>${money(T.sub)}</span></div><small class="pnote">${t('co.demo')}</small><a class="btn full" href="checkout.html">${t('cart.checkout')}</a>` : '';
}

/* ---------- Wishlist ---------- */
function addToWishlist(id) { if (!wishlist.includes(id)) { wishlist.push(id); saveWishlist(); showToast(t('toast.wishadd')); } }
function removeFromWishlist(id) { wishlist = wishlist.filter(i => i !== id); saveWishlist(); showToast(t('toast.wishrm')); }
function updateBadges() {
  const c = cart.reduce((s, i) => s + i.qty, 0), w = wishlist.length;
  $$('[data-cc]').forEach(e => { e.textContent = c; e.style.display = c ? '' : 'none'; });
  $$('[data-wc]').forEach(e => { e.textContent = w; e.style.display = w ? '' : 'none'; });
}
function normalizeSavedState() {
  const savedCart = Array.isArray(cart) ? cart : [];
  cart = savedCart.flatMap(item => {
    const p = P(item?.id), size = +item?.size, qty = Math.floor(+item?.qty), color = item?.color;
    if (!p || !p.sizes.includes(size) || !p.colors.includes(color) || !Number.isFinite(qty) || qty < 1) return [];
    const key = `${p.id}-${size}-${color}`;
    return [{ key, id: p.id, name: p.name, price: p.price, image: p.images[0], size, color, qty: Math.min(10, qty) }];
  });
  wishlist = [...new Set((Array.isArray(wishlist) ? wishlist : []).map(Number).filter(id => P(id)))];
  prefs = prefs && typeof prefs === 'object' && !Array.isArray(prefs) ? prefs : {};
  store.set('soleva_cart', cart); store.set('soleva_wishlist', wishlist);
}

/* ---------- Search / filter / sort ---------- */
function searchProducts(list, q) {
  const clean = s => String(s).normalize('NFKC').replace(/[\u064B-\u065F]/g, '').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
  const w = clean(q).split(' ').filter(Boolean);
  return list.filter(p => { const h = clean([p.name, p.nameAr, p.brand, p.category, catLabel(p.category), p.gender, genderLabel(p.gender), ...p.colors, ...p.colors.map(colorLabel)].join(' ')); return w.every(x => h.includes(x)); });
}
const BANDS = { '500-649': [500, 649], '650-799': [650, 799], '800-899': [800, 899], '900+': [900, 1000] };
function filterProducts(list, F) {
  const [lo, hi] = BANDS[F.price] || [0, 1e9];
  return searchProducts(list, F.q).filter(p => (!F.category || p.category === F.category) && (!F.gender || p.gender === F.gender || p.gender === 'Unisex') &&
    (!F.size || p.sizes.includes(+F.size)) && (!F.color || p.colors.includes(F.color)) && p.price >= lo && p.price <= hi);
}
function sortProducts(list, s) {
  const f = { featured: (a, b) => a.id - b.id, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, name: (a, b) => productName(a).localeCompare(productName(b), I18N.lang) }[s] || ((a, b) => a.id - b.id);
  return [...list].sort(f);
}

/* ---------- Product rendering ---------- */
const card = p => { const on = wishlist.includes(p.id), href = `product.html?id=${p.id}`, fit = p.imageFit || 'contain', name = productName(p), alt = `${t(p.imageKind === 'illustration' ? 'catalog.conceptAlt' : 'catalog.conceptPhotoAlt')} ${esc(name)}`; return `<article class="card reveal"><div class="ph"><a href="${href}" aria-label="${esc(name)}"><img class="fit-${fit}" loading="lazy" src="${p.images[0]}" alt="${alt}"></a><button class="heart${on ? ' on' : ''}" data-wish="${p.id}" aria-pressed="${on}" aria-label="${t('card.togglewish')}">${on ? '♥' : '♡'}</button><div class="qa" role="group" aria-label="${t('qa.label')}"><span>${t('qa.label')}</span>${p.sizes.map(s => `<button data-qa="${p.id}" data-s="${s}" aria-label="${t('qa.addsize')} ${s}">${s}</button>`).join('')}</div></div><div class="inf"><small>${p.brand} · ${catLabel(p.category)}</small><h3><a href="${href}">${esc(name)}</a></h3><div class="pr"><b>${money(p.price)}</b></div></div></article>`; };
function renderProducts(list, el) {
  el.innerHTML = list.length ? list.map(card).join('') : `<div class="empty"><h3>${t('search.none')}</h3><button class="btn" data-reset>${t('gen.reset')}</button></div>`;
  observe();
}
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 }) : null;
function observe() { $$('.reveal:not(.in)').forEach(e => io ? io.observe(e) : e.classList.add('in')); }

/* ---------- Shared layout ---------- */
const NAV = [['nav.men', 'shop.html?gender=Men'], ['nav.women', 'shop.html?gender=Women'], ['nav.new', 'index.html#collection'], ['nav.categories', 'shop.html'], ['nav.about', 'index.html#about']];
const FOOT = [
  ['fh.shop', [['ft.men', 'shop.html?gender=Men'], ['ft.women', 'shop.html?gender=Women'], ['ft.all', 'shop.html']]],
  ['fh.categories', [['ft.cat.running', 'shop.html?category=Running'], ['ft.cat.sneakers', 'shop.html?category=Sneakers'], ['ft.cat.basketball', 'shop.html?category=Basketball'], ['ft.cat.lifestyle', 'shop.html?category=Lifestyle']]],
  ['fh.company', [['ft.about', 'index.html#about']]]
];
const icon = p => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
function layout() {
  const L = I18N.lang;
  const langbox = () => `<div class="langbox" role="group" aria-label="${t('a11y.lang')}"><button data-lang="en" class="${L === 'en' ? 'on' : ''}" aria-pressed="${L === 'en'}">EN</button><button data-lang="ar" class="${L === 'ar' ? 'on' : ''}" aria-pressed="${L === 'ar'}">ع</button></div>`;
  $('#hdr').innerHTML = `<a class="skip" href="#main">${t('a11y.skip')}</a><div class="bar">${t('bar.ship')}</div><header class="nav" id="nav"><button class="ic burger" data-menu aria-label="${t('a11y.menu')}" aria-controls="menu" aria-expanded="false">${icon('<path d="M3 6h18M3 12h18M3 18h18"/>')}</button><a class="logo" href="index.html">SOLEVA</a><nav id="menu" aria-label="${t('a11y.primary')}">${NAV.map(([l, h]) => `<a href="${h}">${t(l)}</a>`).join('')}${langbox()}</nav><div class="acts">${langbox()}<button class="ic" data-search aria-label="${t('a11y.search')}">${icon('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/>')}</button><a class="ic" href="wishlist.html" aria-label="${t('a11y.wishlist')}">${icon('<path d="M12 21C6.9 16.8 3 13.3 3 9.2A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 3.2c0 4.1-3.9 7.6-9 11.8z"/>')}<b data-wc>0</b></a><button class="ic" data-cart aria-label="${t('a11y.bag')}">${icon('<path d="M5.5 8h13l-1.1 12h-10.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>')}<b data-cc>0</b></button></div></header>`;
  $('#ftr').innerHTML = `<footer class="foot"><div class="fbrand"><a class="logo" href="index.html">SOLEVA</a><p>${t('gen.brandline')}</p></div>${FOOT.map(([h, links]) => `<div><h4>${t(h).toUpperCase()}</h4><ul>${links.map(([n, u]) => `<li>${u ? `<a href="${u}"${u.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${t(n)}</a>` : `<span>${t(n)}</span>`}</li>`).join('')}</ul></div>`).join('')}<small>${t('ft.rights')}</small></footer>
  <div id="scrim" data-close></div>
  <div id="search" class="ov" role="dialog" aria-modal="true" aria-label="${t('a11y.searchd')}"><div class="ovin"><div class="srow"><h2>${t('search.h')}</h2><button class="ic" data-close aria-label="${t('a11y.closesearch')}">✕</button></div><input id="q" placeholder="${t('search.ph')}" aria-label="${t('a11y.searchprod')}" autocomplete="off"><div class="pop"><span>${t('search.pop')}</span><a href="shop.html?q=Sneakers">${t('nav.sneakers')}</a><a href="shop.html?q=Running">${t('nav.running')}</a><a href="shop.html?q=Black">${colorLabel('Black')}</a><a href="shop.html?q=White">${colorLabel('White')}</a><a href="shop.html">${t('nav.new')}</a></div><div id="sr" aria-live="polite"></div></div></div>
  <aside id="cart" role="dialog" aria-modal="true" aria-labelledby="carttitle"><header><h3 id="carttitle">${t('cart.title')}</h3><button class="ic" data-close aria-label="${t('a11y.closebag')}">✕</button></header><div id="cbody"></div><footer id="cfoot"></footer></aside><div id="toast" role="status"></div>`;
}

/* ---------- Page controllers ---------- */
function home() {
  $$('[data-p]').forEach(i => { i.src = P(i.dataset.p).images[+i.dataset.i || 0]; });
  $$('[data-c]').forEach(i => { i.src = ALL.filter(p => p.category === i.dataset.c)[0].images[0] ?? ''; });
  renderProducts(sortProducts(ALL.filter(p => p.imageKind === 'photo'), 'featured').slice(0, 8), $('#newGrid'));
}
/* newsletter is bound once via delegation so re-renders stay idempotent */
document.addEventListener('submit', e => {
  if (e.target.id !== 'nl') return;
  e.preventDefault(); const v = $('#nle').value.trim(), ok = EMAIL.test(v), m = $('#nlm');
  m.textContent = ok ? t('news.ok') : t('news.bad'); m.className = ok ? 'ok' : 'bad';
  if (ok) { showToast(t('news.welcome')); }
});
function shop() {
  /* state survives language re-renders (initialised from URL once per page load) */
  if (!shop.F) {
    const u = new URLSearchParams(location.search);
    shop.F = { category: u.get('category') || '', gender: u.get('gender') || '', size: '', color: '', price: '', sort: u.get('sort') || prefs.sort || 'featured', q: u.get('q') || '' };
  }
  const F = shop.F;
  const setHead = () => {
    const title = F.q ? I18N.tf('shop.search.title', { q: F.q }) : [F.gender && genderLabel(F.gender), F.category && catLabel(F.category)].filter(Boolean).join(' ') || t('shop.all.title');
    const desc = F.q ? I18N.tf('shop.search.desc', { q: F.q }) : F.category ? t('shop.desc.' + F.category.toLowerCase()) : F.gender ? t('shop.gender.desc') : t('shop.all.desc');
    $('#ptitle').textContent = title; $('#pdesc').textContent = desc;
    const seg = [`<a href="index.html">${t('gen.home')}</a>`], active = F.q ? `“${esc(F.q)}”` : (F.category ? catLabel(F.category) : F.gender ? genderLabel(F.gender) : '');
    if (active) seg.push(`<a href="shop.html">${t('gen.shopPage')}</a>`);
    if (F.gender && (F.category || F.q)) seg.push(`<a href="shop.html?gender=${F.gender}">${genderLabel(F.gender)}</a>`);
    seg.push(`<b aria-current="page">${active || t('shop.all.title')}</b>`);
    $('#crumbs').innerHTML = seg.join('<span aria-hidden="true">/</span>');
  };
  const G = [
    [t('f.category'), 'category', [['', t('gen.all')], ['Running', catLabel('Running')], ['Sneakers', catLabel('Sneakers')], ['Basketball', catLabel('Basketball')], ['Lifestyle', catLabel('Lifestyle')]]],
    [t('f.gender'), 'gender', [['', t('gen.all')], ['Men', genderLabel('Men')], ['Women', genderLabel('Women')], ['Unisex', t('gen.gender.unisex')]]],
    [t('f.color'), 'color', [['', t('f.r.any')], ...['White', 'Black', 'Cream'].map(c => [c, colorLabel(c)])]],
    [t('f.size'), 'size', [['', t('f.r.any')], 39, 40, 41, 42, 43, 44, 45]],
    [t('f.price'), 'price', [['', t('f.r.any')], ['500-649', t('f.p.500')], ['650-799', t('f.p.650')], ['800-899', t('f.p.800')], ['900+', t('f.p.900')]]],
  ];
  const draw = () => {
    setHead();
    const l = sortProducts(filterProducts(ALL, F), F.sort);
    $('#count').textContent = `${l.length} ${I18N.productWord(l.length)}${F.q ? ` ${t('gen.for')} “${F.q}”` : ''}`;
    $('#sort').value = F.sort;
    renderProducts(l, $('#grid'));
    $('#filters').innerHTML = `<div class="fh"><h3>${t('gen.filters')}</h3><button class="ic" data-close aria-label="${t('a11y.closefilters')}">✕</button></div>` + G.map(([label, k, opts]) => `<fieldset><legend>${label.toUpperCase()}</legend>${opts.map(o => { const [v, n] = Array.isArray(o) ? o : [o, o]; return `<label><input type="radio" name="${k}" data-f="${k}" value="${v}" ${String(F[k]) === String(v) ? 'checked' : ''}>${n}</label>`; }).join('')}</fieldset>`).join('') + `<button class="btn sm" data-reset>${t('gen.reset2')}</button>`;
  };
  if (!shop._bound) {
    shop._bound = true;
    $('#filters').addEventListener('change', e => { const k = e.target.dataset.f; if (k) { F[k] = e.target.value; draw(); } });
    $('#sort').addEventListener('change', e => { F.sort = e.target.value; prefs.sort = F.sort; store.set('soleva_preferences', prefs); draw(); });
    window.resetShop = () => { Object.assign(shop.F, { category: '', gender: '', size: '', color: '', price: '', q: '' }); draw(); closeAll(); };
  }
  draw();
}
async function productPage() {
  const id = new URLSearchParams(location.search).get('id');
  const p = await api.getProduct(id), m = $('#pmain');
  if (!p) { m.innerHTML = `<div class="empty"><h3>${t('pdp.nofound')}</h3><a class="btn" href="shop.html">${t('pdp.explore')}</a></div>`; return; }
  const name = productName(p);
  document.title = `${name} — SOLEVA`;
  /* selections survive language re-render */
  if (!window.__PDP_ST || window.__PDP_ID !== p.id) { window.__PDP_ST = { size: null, color: p.colors[0], qty: 1 }; window.__PDP_ID = p.id; }
  const st = window.__PDP_ST, on = wishlist.includes(p.id), stock = p.sizes.length > 0;
  m.innerHTML = `<nav class="crumbs" aria-label="${t('a11y.breadcrumb')}"><a href="index.html">${t('gen.home')}</a><span aria-hidden="true">/</span><a href="shop.html?category=${p.category}">${catLabel(p.category)}</a><span aria-hidden="true">/</span><b aria-current="page">${esc(name)}</b></nav>
  <div class="pdp"><div class="gal"><div class="th">${p.images.map((s, i) => `<button data-th="${i}" class="${i ? '' : 'on'}" aria-label="${t('a11y.viewimg')} ${i + 1}"><img src="${s}" alt=""></button>`).join('')}</div><div class="mainimg"><img id="mi" class="fit-${p.imageFit || 'contain'}" src="${p.images[0]}" alt="${t(p.imageKind === 'illustration' ? 'catalog.conceptAlt' : 'catalog.conceptPhotoAlt')} ${esc(name)}"></div></div>
  <div class="pi"><small>${p.brand} · ${catLabel(p.category)}</small><h1>${esc(name)}</h1><div class="pr"><b class="big">${money(p.price)}</b></div><p class="photo-note" role="note">${t('catalog.photoNote')}</p><p class="desc">${esc(name)} ${t('pdp.descT')}</p>
  <h4>${t('pdp.color')}: <span id="cl">${colorLabel(st.color)}</span></h4><div class="opts">${p.colors.map(c => `<button data-color="${c}" class="${c === st.color ? 'on' : ''}">${colorLabel(c)}</button>`).join('')}</div>
  <h4 id="sizelab">${t('pdp.size')}</h4><div class="opts" role="group" aria-labelledby="sizelab">${[39, 40, 41, 42, 43, 44, 45].map(s => `<button data-size="${s}" class="${st.size == s ? 'on' : ''}" ${p.sizes.includes(s) ? '' : 'disabled'}>${s}</button>`).join('')}</div>
  <h4>${t('pdp.qty')}</h4><div class="qty"><button data-q="-1" aria-label="${t('a11y.dec')}">−</button><span id="qv">${st.qty}</span><button data-q="1" aria-label="${t('a11y.inc')}">+</button></div>
  <div class="row2"><button class="btn" data-add${stock ? '' : ' disabled'}>${t('pdp.add')}</button><button class="btn ghost" data-buy${stock ? '' : ' disabled'}>${t('pdp.buy')}</button><button class="heart${on ? ' on' : ''}" data-wish="${p.id}" aria-pressed="${on}" aria-label="${t('card.togglewish')}">${on ? '♥' : '♡'}</button></div>
  </div></div>
  <section class="sec"><div class="shead"><h2>${t('pdp.related')}</h2></div><div class="grid" id="rel"></div></section>`;
  const rel = ALL.filter(x => x.id !== p.id && (x.category === p.category || x.gender === p.gender)).slice(0, 4);
  if (rel.length) renderProducts(rel, $('#rel')); else $('#pmain section.sec')?.remove();
  const sel = (attr, v) => $$(`[${attr}]`, m).forEach(b => b.classList.toggle('on', b.getAttribute(attr) === String(v)));
  m.onclick = e => {
    const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
    if (d.th) { $('#mi').src = p.images[d.th]; $$('[data-th]', m).forEach(x => x.classList.toggle('on', x === b)); }
    else if (d.color) { st.color = d.color; $('#cl').textContent = colorLabel(d.color); sel('data-color', d.color); }
    else if (d.size) { st.size = +d.size; sel('data-size', d.size); showToast(I18N.tf('toast.size', { n: d.size })); }
    else if (d.q) { st.qty = Math.min(10, Math.max(1, st.qty + +d.q)); $('#qv').textContent = st.qty; }
    else if ('add' in d) { addToCart(p, st.size, st.color, st.qty) && openCart(); }
    else if ('buy' in d) { addToCart(p, st.size, st.color, st.qty) && (location.href = 'checkout.html'); }
  };
}
function checkoutPage() {
  const m = $('#cmain');
  const empty = `<div class="empty"><h3>${t('co.empty')}</h3><a class="btn" href="shop.html">${t('gen.continue')}</a></div>`;
  if (!cart.length) { m.innerHTML = empty; return; }
  const T = calculateCartTotal();
  const LBL = { email: t('co.email'), fn: t('co.fn'), ln: t('co.ln'), addr: t('co.addr'), city: t('co.city'), zip: t('co.zip'), phone: t('co.phone') };
  const f = (n, ty = 'text') => `<label class="fld"><span>${LBL[n]}</span><input name="${n}" type="${ty}" required><small class="er"></small></label>`;
  m.innerHTML = `<form id="cf" class="co" novalidate><div><h1>${t('co.title')}</h1><p class="pnote" role="status">${t('co.demo')}</p><h4>${t('co.contact')}</h4>${f('email', 'email')}<h4>${t('co.shipping')}</h4><div class="two">${f('fn')}${f('ln')}</div>${f('addr')}<div class="two">${f('city')}${f('zip')}</div>${f('phone', 'tel')}</div>
  <aside class="sum"><h4>${t('co.summary')}</h4>${cart.map(l => { const name = productName(P(l.id)) || l.name; return `<div class="li sm"><img src="${l.image}" alt="${esc(name)}"><div><b>${esc(name)}</b><br><small>${t('cart.size')} ${l.size} · ${t('co.qty')} ${l.qty}</small></div><b>${money(l.price * l.qty)}</b></div>`; }).join('')}
  <div class="row tot"><span>${t('cart.subtotal')}</span><span>${money(T.sub)}</span></div><button class="btn full" type="submit">${t('co.demo.button')}</button></aside></form>`;
  const form = $('#cf');
  form.addEventListener('submit', e => {
    e.preventDefault(); let first = null;
    $$('.fld input', form).forEach(i => {
      const v = i.value.trim(), ok = (i.name === 'email' ? EMAIL.test(v) : i.name === 'phone' ? /^[\d\s+()-]{7,}$/.test(v) : v.length > 0);
      const lbl = i.previousElementSibling.textContent;
      i.classList.toggle('err', !ok); i.setAttribute('aria-invalid', String(!ok));
      i.nextElementSibling.textContent = ok ? '' : (I18N.lang === 'ar' ? `${t('co.errPre')} ${lbl} ${t('co.errSuf')}` : `Please enter a valid ${lbl.toLowerCase()}.`);
      if (!ok && !first) first = i;
    });
    if (first) { first.focus(); return; }
    showToast(t('co.demo'));
  });
}
function wishlistPage() {
  const g = $('#wgrid');
  window.redrawWish = () => { const l = ALL.filter(p => wishlist.includes(p.id)); l.length ? renderProducts(l, g) : g.innerHTML = `<div class="empty"><h3>${t('wish.empty')}</h3><p>${t('wish.empty2')}</p><a class="btn" href="shop.html">${t('pdp.explore')}</a></div>`; };
  window.redrawWish();
}

/* ---------- Global events ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('button,[data-close]'); if (!el) return; const d = el.dataset;
  if (d.lang) { I18N.set(d.lang); return; }
  if (d.wish) { const id = +d.wish, on = !wishlist.includes(id); on ? addToWishlist(id) : removeFromWishlist(id); $$(`[data-wish="${id}"]`).forEach(h => { h.classList.toggle('on', on); h.textContent = on ? '♥' : '♡'; h.setAttribute('aria-pressed', on); }); window.redrawWish?.(); }
  else if (d.qa) { const p = P(d.qa); addToCart(p, +d.s, p.colors[0]) && openCart(); }
  else if ('cart' in d) openCart(); else if ('search' in d) openSearch(); else if ('close' in d) closeAll();
  else if ('menu' in d) { $('#nav')?.classList.add('menu-open'); openLayer('menu'); el.setAttribute('aria-expanded', 'true'); }
  else if (d.inc) updateQuantity(d.inc, 1); else if (d.dec) updateQuantity(d.dec, -1); else if (d.rm) removeFromCart(d.rm);
  else if (d.slide) { const s = $('#slider'), rtl = document.documentElement.dir === 'rtl' ? -1 : 1; s.scrollBy({ left: +d.slide * s.clientWidth * .9 * rtl, behavior: 'smooth' }); }
  else if ('filters' in d) openLayer('filters'); else if ('reset' in d) window.resetShop?.();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeAll(); return; }
  if (e.key !== 'Tab') return;
  const layer = $$('.open').filter(x => x.id !== 'scrim').at(-1);
  if (!layer) return;
  const items = $$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])', layer).filter(x => x.getClientRects().length);
  if (!items.length) { e.preventDefault(); return; }
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || !layer.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !layer.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
});
addEventListener('scroll', () => $('#nav')?.classList.toggle('sc', scrollY > 30), { passive: true });
document.addEventListener('input', deb(e => {
  if (e.target.id !== 'q') return; const q = e.target.value.trim(), r = q ? searchProducts(ALL, q).slice(0, 6) : [];
  $('#sr').innerHTML = !q ? '' : r.length ? r.map(p => `<a class="sri" href="product.html?id=${p.id}"><img src="${p.images[0]}" alt=""><span><b>${esc(productName(p))}</b><br><small>${catLabel(p.category)} · ${genderLabel(p.gender)}</small></span><b>${money(p.price)}</b></a>`).join('') : `<p class="empty">${t('search.none')}</p>`;
}, 180));
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'q' && e.target.value.trim()) location.href = 'shop.html?q=' + encodeURIComponent(e.target.value.trim()); });

/* ---------- Language re-render hook ---------- */
window.__i18nRerender = () => {
  closeAll();
  layout();
  updateBadges(); renderCart();
  I18N.apply();
  ({ home, shop, product: productPage, checkout: checkoutPage, wishlist: wishlistPage })[document.body.dataset.page]?.();
};

/* ---------- Init ---------- */
(async () => {
  ALL = await api.getProducts();
  normalizeSavedState();
  layout();
  updateBadges(); renderCart();
  I18N.apply();
  ({ home, shop, product: productPage, checkout: checkoutPage, wishlist: wishlistPage })[document.body.dataset.page]?.();
  observe();
})();
