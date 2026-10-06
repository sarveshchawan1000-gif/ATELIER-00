/* Wires the static Stitch mockups into a working multi-page prototype. */
(function () {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const txt = el => (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const page = location.pathname.split('/').pop() || 'index.html';
  const isMobilePage = page === 'mobile.html' || page === 'menu.html';

  // ---- Auto-switch between desktop and mobile home -------------------------
  const narrow = window.matchMedia('(max-width: 767px)').matches;
  if (page === 'index.html' && narrow) location.replace('mobile.html');
  if (page === 'mobile.html' && !narrow && !location.search.includes('keep')) location.replace('index.html');

  // ---- Cart state (localStorage, with in-memory fallback) -------------------
  let mem = null;
  const load = () => { try { return JSON.parse(localStorage.getItem('cart')) ?? 2; } catch { return mem ?? 2; } };
  const save = n => { mem = n; try { localStorage.setItem('cart', JSON.stringify(n)); } catch {} };
  let count = load();

  function renderCount() {
    $$('a,button').forEach(el => {
      if (!/shopping_bag/.test(el.textContent)) return;
      $$('*', el).concat(el).forEach(n => {
        if (n.children.length === 0 || n === el) {
          n.childNodes.forEach(c => {
            if (c.nodeType === 3 && /\(?\d+\)?/.test(c.nodeValue) && !/shopping_bag/.test(c.nodeValue))
              c.nodeValue = c.nodeValue.replace(/\d+/, count);
          });
        }
      });
    });
  }

  function toast(msg) {
    let t = document.getElementById('__toast');
    if (!t) {
      t = document.createElement('div'); t.id = '__toast';
      t.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#000;color:#fff;padding:12px 20px;font:600 12px "Space Grotesk",sans-serif;letter-spacing:.08em;text-transform:uppercase;z-index:9999;transition:opacity .3s;border-left:4px solid #00d9ff';
      document.body.appendChild(t);
    }
    t.textContent = msg; t.style.opacity = 1;
    clearTimeout(t._h); t._h = setTimeout(() => (t.style.opacity = 0), 1800);
  }

  // ---- Links ---------------------------------------------------------------
  const linkMap = [
    [/^brand$|^home$/, 'index.html'],
    [/^shop$|new arrivals|shop archive|view (all|entire archive)|exhibit archive|editions|archive$|catalog|^outerwear|^tailoring|^artifacts|archive sale|^tops$|shop new/, 'shop.html'],
    [/^collections?$|collection|exhibit 0|index$/, 'shop.html'],
    [/^about|manifesto|our story|atelier|exhibition|sustainability|journal|monograph/, 'index.html#about'],
    [/shopping_bag|^bag|\bbag \[/, 'bag.html'],
  ];
  $$('a[href="#"]').forEach(a => {
    const t = txt(a).replace(/^\d+ \/\/ /, '').replace(/^(grid_view|category|auto_stories|account_circle|shopping_bag)\s*/, m => (m.trim() === 'shopping_bag' ? 'shopping_bag ' : ''));
    const raw = txt(a);
    let dest = null;
    if (/shopping_bag|bag \(|bag \[/.test(raw)) dest = 'bag.html';
    else if (/^exhibit 0\d|best sellers|hoodies|jackets|new arrivals/.test(raw)) dest = 'shop.html';
    else for (const [re, d] of linkMap) if (re.test(t)) { dest = d; break; }
    if (a.dataset.path === 'home') dest = 'index.html';
    if (a.dataset.path === 'shop' || a.dataset.path === 'collections') dest = 'shop.html';
    if (a.dataset.path === 'cart') dest = 'bag.html';
    if (a.dataset.path === 'about') dest = 'index.html#about';
    if (dest === 'index.html' && isMobilePage) dest = 'mobile.html?keep';
    if (dest) a.setAttribute('href', dest);
    else a.addEventListener('click', e => e.preventDefault());
  });

  // ---- Buttons -------------------------------------------------------------
  const productCard = el => el.closest('article, li, [class*="group"]');
  $$('button').forEach(btn => {
    const t = txt(btn);
    // mobile menu open/close
    if (page === 'mobile.html' && t === 'menu') btn.addEventListener('click', () => (location.href = 'menu.html'));
    if (page === 'menu.html' && t === 'close') btn.addEventListener('click', () => (location.href = 'mobile.html?keep'));
    // bag
    if (/shopping_bag/.test(t)) btn.addEventListener('click', () => (location.href = 'bag.html'));
    // quick add / add to bag
    if (/quick add|add to bag|^add$/.test(t.replace(/^add\s+/, 'add ')) || t === 'add' || /^\+ quick add/.test(t)) {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        count++; save(count); renderCount(); toast('Added to bag');
      });
    }
    // favourites
    if (/^favorite(_border)?$/.test(t) || /wishlist/.test(t)) {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const icon = [...btn.querySelectorAll('.material-symbols-outlined')][0] || btn;
        const on = btn.dataset.fav === '1';
        btn.dataset.fav = on ? '0' : '1';
        icon.style.fontVariationSettings = on ? "'FILL' 0" : "'FILL' 1";
        toast(on ? 'Removed from wishlist' : 'Saved to wishlist');
      });
    }
    // sizes (product page)
    if (page === 'product.html' && /^(xs|s|m|l|xl|xxl)( ✓)?$/.test(t)) {
      btn.addEventListener('click', () => {
        $$('button').filter(b => /^(xs|s|m|l|xl|xxl)( ✓)?$/.test(txt(b))).forEach(b => {
          b.classList.remove('bg-primary', 'text-on-primary', 'border-primary');
          b.classList.add('border-outline-variant');
          b.querySelectorAll('.__tick').forEach(x => x.remove());
        });
        btn.classList.remove('border-outline-variant');
        btn.classList.add('bg-primary', 'text-on-primary', 'border-primary');
      });
    }
    // search
    if (t === 'search') btn.addEventListener('click', () => {
      const q = prompt('Search the archive:'); if (q) { location.href = 'shop.html?q=' + encodeURIComponent(q); }
    });
    // account
    if (t === 'person') btn.addEventListener('click', () => toast('Account: coming soon'));
    // subscribe / join
    if (/^(subscribe|join)$/.test(t)) btn.addEventListener('click', e => {
      e.preventDefault();
      const i = btn.closest('form, div')?.querySelector('input');
      if (i && !i.value.includes('@')) { toast('Enter a valid email'); i.focus(); } else { toast('Subscribed'); if (i) i.value = ''; }
    });
    // desktop carousel arrows (already wired in page script)
    // load more
    if (/load more/.test(t)) btn.addEventListener('click', () => toast('No more products in this demo'));
    // catalog category tabs
    if (page === 'shop.html' && /^(all|t-shirts|shirts|hoodies|jackets|bottoms) \(\d+\)$/.test(t)) {
      btn.addEventListener('click', () => {
        const key = t.split(' (')[0].replace(/s$/, '').replace('t-shirt', 'shirt');
        $$('article, li').forEach(card => {
          if (!card.querySelector('img')) return;
          const alt = (card.querySelector('img').dataset.alt || card.textContent).toLowerCase();
          card.style.display = (key === 'all' || alt.includes(key) || (key === 'bottom' && /trouser|pant|denim/.test(alt))) ? '' : 'none';
        });
      });
    }
  });

  // ---- Product cards → product page ---------------------------------------
  if (page !== 'product.html' && page !== 'bag.html' && page !== 'menu.html') {
    $$('img').forEach(img => {
      const card = productCard(img);
      if (!card || !card.querySelector('button')) return;
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => (location.href = 'product.html'));
      const h = card.querySelector('h3, h4');
      if (h) { h.style.cursor = 'pointer'; h.addEventListener('click', () => (location.href = 'product.html')); }
    });
  }

  // ---- Bag page: qty / remove / promo --------------------------------------
  if (page === 'bag.html') {
    $$('button[aria-label="Increase quantity"], button[aria-label="Decrease quantity"]').forEach(b => {
      b.addEventListener('click', () => {
        const box = b.parentElement;
        const num = [...box.childNodes].map(n => n.nodeType === 1 ? n : null).find(n => n && /^\d+$/.test(n.textContent.trim()));
        if (!num) return;
        let v = parseInt(num.textContent, 10) + (b.getAttribute('aria-label').startsWith('Inc') ? 1 : -1);
        num.textContent = Math.max(1, v);
      });
    });
    $$('button').filter(b => /remove/.test(txt(b))).forEach(b => {
      b.addEventListener('click', () => {
        const row = b.closest('article, li') || b.closest('div[class*="border-b"]');
        if (row) row.remove();
        count = Math.max(0, count - 1); save(count); renderCount(); toast('Removed from bag');
      });
    });
    $$('button').filter(b => /move to wishlist/.test(txt(b))).forEach(b => b.addEventListener('click', () => toast('Moved to wishlist')));
    $$('button').filter(b => /checkout|proceed/.test(txt(b))).forEach(b => b.addEventListener('click', () => toast('Checkout is not connected yet')));
    const promo = document.getElementById('promo-code');
    if (promo) {
      const apply = promo.parentElement.querySelector('button');
      if (apply) apply.addEventListener('click', () => toast(promo.value.trim() ? 'Code not valid in demo' : 'Enter a code'));
    }
  }

  // ---- Catalog: search + sort ----------------------------------------------
  if (page === 'shop.html') {
    const q = new URLSearchParams(location.search).get('q');
    if (q) $$('article, li').forEach(c => {
      if (c.querySelector('img') && !c.textContent.toLowerCase().includes(q.toLowerCase()) && !(c.querySelector('img').dataset.alt || '').toLowerCase().includes(q.toLowerCase())) c.style.display = 'none';
    });
    $$('button').filter(b => txt(b) === 'close' || txt(b) === 'clear all').forEach(b => b.addEventListener('click', () => {
      if (txt(b) === 'clear all') $$('button').filter(x => txt(x) === 'close').forEach(x => x.closest('span, div')?.remove());
      else b.closest('span, div')?.remove();
    }));
  }

  // Mobile menu accordion for non-menu pages is handled by page script.
  renderCount();
})();
