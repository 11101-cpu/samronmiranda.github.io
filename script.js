/* Modern Pitch-Deck Style Unified JS (navigation, modals, animations, forms) */

// ---------- YEAR AUTO-UPDATE ----------
['year','year-2','year-3','year-4'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.textContent = new Date().getFullYear();
});

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

// ---------- GALLERY MODAL (w/ keyboard + swipe) ----------
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
  modalImg.src = src;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

thumbs.forEach((t, i) => t.addEventListener('click', () => openModal(i)));
if(modalClose) modalClose.addEventListener('click', closeModal);
if(modal) modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

// keyboard navigation
window.addEventListener('keydown', e => {
  if(modal.getAttribute('aria-hidden') === 'false'){
    if(e.key === 'Escape') closeModal();
  }
});

// ---------- CONTACT FORM (CLIENT-SIDE ONLY) ----------
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
      msgEl.textContent = 'Please fill all fields.';
      msgEl.style.color = 'crimson';
      return;
    }
    if(!validEmail(email)){
      msgEl.textContent = 'Please enter a valid email.';
      msgEl.style.color = 'crimson';
      return;
    }

    msgEl.style.color = 'var(--accent)';
    msgEl.textContent = 'Sending (demo)...';
    setTimeout(() => {
      msgEl.textContent = 'Your message was sent (simulation). Connect this form to Formspree/Netlify for real submissions.';
      form.reset();
    }, 1000);
  });
}

// ---------- MOVING WORDS (Pause on hover) ----------
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
