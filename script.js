/* Modern Pitch-Deck Style Unified JS (navigation, modals, animations, forms)
   Updated: neon-green default theme + bottom-right theme-toggle + game-style loader
*/

// ---------- YEAR AUTO-UPDATE ----------
['year','year-2','year-3','year-4'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.textContent = new Date().getFullYear();
});

// ---------- THEME (neon default, toggle to original) ----------
const THEME_KEY = 'site-theme'; // 'neon' or 'default'
const body = document.body;

// apply theme class
function applyTheme(theme) {
  if (theme === 'default') {
    body.classList.remove('neon-theme');
    body.classList.add('default-theme');
    const btn = document.getElementById('theme-toggle');
    if(btn) {
      btn.textContent = 'White & Blue';
      btn.setAttribute('aria-pressed','false');
      btn.classList.remove('btn-neon'); btn.classList.add('btn-default');
    }
  } else {
    body.classList.remove('default-theme');
    body.classList.add('neon-theme');
    const btn = document.getElementById('theme-toggle');
    if(btn) {
      btn.textContent = 'Neon Green';
      btn.setAttribute('aria-pressed','true');
      btn.classList.remove('btn-default'); btn.classList.add('btn-neon');
    }
  }
  try { localStorage.setItem(THEME_KEY, theme); } catch(e){}
}

// initialize theme: neon by default unless user previously chose default
(function initTheme(){
  let preferred = null;
  try { preferred = localStorage.getItem(THEME_KEY); } catch(e){}
  if(preferred === 'default') applyTheme('default'); else applyTheme('neon');
})();

// create toggle button behavior (button fixed bottom-right)
function setupThemeToggle() {
  let btn = document.getElementById('theme-toggle');
  if(!btn){
    // inject one into body if missing
    btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label','Toggle theme');
    document.body.appendChild(btn);
  }

  // ensure it's fixed at bottom-right (styles also in CSS)
  btn.setAttribute('type','button');
  btn.style.zIndex = 999999;

  // initialize classes to match current theme
  if(body.classList.contains('neon-theme')){
    btn.classList.add('btn-neon');
    btn.textContent = 'Neon Green';
    btn.setAttribute('aria-pressed','true');
  } else {
    btn.classList.add('btn-default');
    btn.textContent = 'White & Blue';
    btn.setAttribute('aria-pressed','false');
  }

  btn.addEventListener('click', () => {
    const current = body.classList.contains('neon-theme') ? 'neon' : 'default';
    const next = current === 'neon' ? 'default' : 'neon';
    applyTheme(next);
  });
}
setupThemeToggle();

// ---------- GAME-STYLE LOADER (creates overlay if none exists) ----------
(function setupLoader(){
  if(document.getElementById('game-loader')) return;

  const loader = document.createElement('div');
  loader.id = 'game-loader';
  loader.setAttribute('aria-hidden','false');
  loader.innerHTML = `
    <div class="loader-wrap" role="status" aria-label="Loading">
      <div class="loader-logo" aria-hidden="true"></div>
      <div class="loader-bar">
        <div class="loader-progress" style="width:0%"></div>
      </div>
      <div class="loader-text"><span class="loader-percent">0</span>%</div>
    </div>
  `;
  document.documentElement.appendChild(loader);

  const progressEl = loader.querySelector('.loader-progress');
  const percentEl = loader.querySelector('.loader-percent');

  let percent = 0;
  let start = null;
  const duration = 1200;
  const maxWait = 2500;

  function tick(timestamp){
    if(!start) start = timestamp;
    const elapsed = timestamp - start;
    const t = Math.min(elapsed / duration, 1);
    percent = Math.round( Math.pow(t, 0.7) * 90 ) + 5;
    progressEl.style.width = percent + '%';
    percentEl.textContent = percent;
    if(elapsed < duration) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function hideLoader() {
    if(loader.getAttribute('data-hidden') === 'true') return;
    loader.setAttribute('data-hidden','true');
    loader.setAttribute('aria-hidden','true');
    progressEl.style.width = '100%';
    percentEl.textContent = '100';
    loader.classList.add('loaded');
    setTimeout(() => { loader.remove(); }, 600);
  }

  let hidden = false;
  window.addEventListener('load', () => { if(!hidden){ hidden = true; hideLoader(); } }, {passive:true});
  setTimeout(() => { if(!hidden){ hidden = true; hideLoader(); } }, maxWait);
})();

// ---------- MOBILE NAV TOGGLES ----------
const toggles = document.querySelectorAll('.menu-toggle');
toggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const links = btn.parentElement.querySelector('.nav-links');
    if(!links) return;
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.gap = '10px';
    links.style.background = 'white';
    links.style.padding = '10px';
    links.style.borderRadius = '10px';
    links.style.boxShadow = '0 12px 30px rgba(12,33,80,0.12)';
  });
});

// ---------- ACTIVE LINK HIGHLIGHT ----------
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if(a.getAttribute('href') === path) a.classList.add('active');
});

// ---------- GALLERY MODAL ----------
const thumbs = document.querySelectorAll('.thumb');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');
let currentIndex = 0;

function openModal(idx) {
  const imgs = Array.from(thumbs).filter(i => !i.hidden);
  if(imgs.length === 0) return;
  currentIndex = idx % imgs.length;
  const src = imgs[currentIndex].dataset.full || imgs[currentIndex].src;
  if(modalImg) modalImg.src = src;
  if(modal){
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if(modal){
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

thumbs.forEach((t, i) => t.addEventListener('click', () => openModal(i)));
if(modalClose) modalClose.addEventListener('click', closeModal);
if(modal) modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

// ---------- CONTACT FORM ----------
const form = document.getElementById('contact-form');
if(form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const msgEl = document.getElementById('form-msg');

    const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    if(!name || !email || !message){
      if(msgEl){ msgEl.textContent = 'Please fill all fields.'; msgEl.style.color = 'crimson'; }
      return;
    }
    if(!validEmail(email)){
      if(msgEl){ msgEl.textContent = 'Please enter a valid email.'; msgEl.style.color = 'crimson'; }
      return;
    }

    if(msgEl){
      msgEl.style.color = 'var(--accent)';
      msgEl.textContent = 'Sending (demo)...';
    }
    setTimeout(() => {
      if(msgEl) msgEl.textContent = 'Your message was sent (simulation). Connect this form to Formspree/Netlify for real submissions.';
      form.reset();
    }, 1000);
  });
}

// ---------- MOVING WORDS ----------
const rotators = document.querySelectorAll('.word-wrap .words');
rotators.forEach(r => {
  r.parentElement.addEventListener('mouseenter', () => r.style.animationPlayState = 'paused');
  r.parentElement.addEventListener('mouseleave', () => r.style.animationPlayState = 'running');
});

// ---------- SKILL BAR ANIMATION ----------
const skillFills = document.querySelectorAll('.fill');
const skillObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.style.width = e.target.dataset.fill;
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(f => skillObs.observe(f));

// ---------- COUNTER ANIMATIONS ----------
const counters = document.querySelectorAll('.num');
const counterObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const target = +el.dataset.target;
      let start = 0;
      const step = Math.ceil(target / 60);

      const timer = setInterval(() => {
        start += step;
        if(start >= target){
          el.textContent = target;
          clearInterval(timer);
        } else el.textContent = start;
      }, 16);

      obs.unobserve(el);
    }
  });
}, { threshold: 0.6 });
counters.forEach(n => counterObs.observe(n));

