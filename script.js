/* Modern Pitch-Deck Style Unified JS (navigation, modals, animations, forms) */
/* Modern Pitch-Deck Style Unified JS (loader, nav, modal, animations, forms) */

/* GAME-STYLE LOADER SCRIPT (index only if #game-loader exists)
   Minimum visible duration enforced: 3500ms */
(function(){
  const MIN_DURATION = 3500; // ms
  const startTime = (typeof performance !== 'undefined') ? performance.now() : Date.now();

  const loader = document.getElementById('game-loader');
  if(!loader) return;

  const bar = document.getElementById('loader-bar');
  const pct = document.getElementById('loader-pct');

  let progress = 0;
  let fakeSpeed = 0.25 + Math.random()*0.6;
  let ticking = true;

  function setProgress(n){
    progress = Math.max(0, Math.min(100, Math.round(n)));
    if(bar) bar.style.width = progress + '%';
    if(pct) pct.textContent = progress + '%';
  }

  let target = 0;
  const tick = () => {
    if(!ticking) return;
    const diff = target - progress;
    if(Math.abs(diff) > 0.3){
      setProgress(progress + diff * 0.12 + fakeSpeed*0.18);
    } else {
      setProgress(progress + fakeSpeed*0.08);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const simInterval = setInterval(()=> {
    target = Math.min(95, target + (0.6 + Math.random() * 1.0));
  }, 300);

  function finishLoaderNow(delay=0){
    clearInterval(simInterval);
    target = 100;
    const now = (typeof performance !== 'undefined') ? performance.now() : Date.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, MIN_DURATION - elapsed);
    const wait = Math.max(0, remaining) + delay;
    setTimeout(()=>{
      setProgress(100);
      loader.classList.add('hidden');
      setTimeout(()=> { try{ loader.remove(); } catch(e){} }, 600);
      ticking = false;
    }, wait);
  }

  window.addEventListener('load', ()=> {
    finishLoaderNow(250); // slight buffer so users see the 100%
  });

  // Allow Esc to skip immediately (keep during dev; remove in production if you prefer)
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      clearInterval(simInterval);
      setProgress(100);
      loader.classList.add('hidden');
      setTimeout(()=> { try{ loader.remove(); } catch(e){} }, 200);
      ticking = false;
    }
  });

  // programmatic finish for other async tasks
  window.finishLoader = function(){
    clearInterval(simInterval);
    finishLoaderNow(50);
  };

})();

/* ---------- YEAR AUTO-UPDATE ---------- */
['year','year-2','year-3','year-4'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.textContent = new Date().getFullYear();
});

/* ---------- MOBILE NAV TOGGLES ---------- */
(function(){
  const toggles = document.querySelectorAll('.menu-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      // prefer the explicit nav-links in same nav, fallback to aria-controls id
      const links = btn.parentElement.querySelector('.nav-links') || document.getElementById(btn.getAttribute('aria-controls'));
      if(!links) return;
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.gap = '10px';
      links.style.background = 'white';
      links.style.padding = '10px';
      links.style.borderRadius = '10px';
      links.style.boxShadow = '0 12px 30px rgba(12,33,80,0.12)';
      btn.setAttribute('aria-expanded', String(!open));
    });
  });
})();

/* ---------- ACTIVE LINK HIGHLIGHT ---------- */
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if(a.getAttribute('href') === path) a.classList.add('active');
  });
})();

/* ---------- DRAG & DROP FOR PROJECTS (simple desktop support) ---------- */
(function(){
  const grid = document.getElementById('projectsGrid');
  if(!grid) return;
  let dragSrc = null;
  function handleDragStart(e){ dragSrc = this; this.style.opacity = '0.5'; e.dataTransfer.effectAllowed = 'move'; }
  function handleDragEnd(){ this.style.opacity = '1'; document.querySelectorAll('.proj').forEach(p=>p.classList.remove('over')); }
  function handleDragOver(e){ e.preventDefault(); return false; }
  function handleDrop(e){
    e.stopPropagation();
    if(dragSrc !== this){
      const children = Array.from(grid.children);
      const srcIndex = children.indexOf(dragSrc);
      const tgtIndex = children.indexOf(this);
      if(srcIndex < tgtIndex) grid.insertBefore(dragSrc, this.nextSibling);
      else grid.insertBefore(dragSrc, this);
    }
    return false;
  }
  document.querySelectorAll('.proj').forEach(item=>{
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
  });
})();

/* ---------- GALLERY LIGHTBOX / MODAL (prev/next, thumbs, keyboard, swipe) ---------- */
(function(){
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  const modal = document.getElementById('modal');
  const modalInner = modal ? modal.querySelector('.modal-inner') : null;
  const modalImg = modal ? modal.querySelector('#modal-img') : null;
  const modalClose = modal ? modal.querySelector('#modal-close') : null;
  const prevBtn = modal ? modal.querySelector('#prev') : null;
  const nextBtn = modal ? modal.querySelector('#next') : null;
  const thumbStrip = modal ? modal.querySelector('#thumbStrip') : null;
  let currentIndex = 0;

  if(!thumbs.length || !modal) return;

  function visibleItems() {
    return thumbs.filter(t => !t.hidden);
  }

  function openAt(index){
    const imgs = visibleItems();
    if(imgs.length === 0) return;
    currentIndex = ((index % imgs.length) + imgs.length) % imgs.length;
    const target = imgs[currentIndex];
    const src = target.dataset.full || target.src;
    modalImg.src = src;
    modalImg.alt = target.alt || '';
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    buildThumbStrip();
    highlightThumb(currentIndex);
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  thumbs.forEach((t,i) => t.addEventListener('click', ()=>{
    const imgs = visibleItems();
    const idx = imgs.indexOf(t);
    openAt(idx);
  }));

  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(prevBtn) prevBtn.addEventListener('click', ()=> { openAt(currentIndex - 1); });
  if(nextBtn) nextBtn.addEventListener('click', ()=> { openAt(currentIndex + 1); });

  // keyboard
  window.addEventListener('keydown', (e)=>{
    if(modal.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') closeModal();
      if(e.key === 'ArrowRight') openAt(currentIndex + 1);
      if(e.key === 'ArrowLeft') openAt(currentIndex - 1);
    }
  });

  // backdrop click
  modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });

  // swipe support inside modalImg
  let startX = 0;
  modalImg.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; });
  modalImg.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      if(dx < 0) openAt(currentIndex + 1);
      else openAt(currentIndex - 1);
    }
  });

  function buildThumbStrip(){
    if(!thumbStrip) return;
    thumbStrip.innerHTML = '';
    const imgs = visibleItems();
    imgs.forEach((v,i)=>{
      const t = document.createElement('img');
      t.src = v.src;
      t.alt = v.alt || '';
      t.dataset.index = i;
      t.addEventListener('click', ()=> openAt(i));
      t.className = (i === currentIndex) ? 'active' : '';
      thumbStrip.appendChild(t);
    });
  }

  function highlightThumb(i){
    if(!thumbStrip) return;
    const thumbs = Array.from(thumbStrip.children);
    thumbs.forEach(t => t.classList.remove('active'));
    if(thumbs[i]) thumbs[i].classList.add('active');
  }
})();

/* ---------- CONTACT FORM (CLIENT-SIDE ONLY) ---------- */
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const msgEl = document.getElementById('form-msg');

    const validEmail = em => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

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
})();

/* ---------- MOVING WORDS (Pause on hover) ---------- */
(function(){
  const rotators = document.querySelectorAll('.word-wrap .words');
  rotators.forEa
