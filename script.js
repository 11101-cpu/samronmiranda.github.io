// Basic UI interactions: year, nav toggle, active nav highlight, smooth scroll, contact validation, gallery modal

document.addEventListener('DOMContentLoaded', () => {
  // Auto-year in footer(s)
  const yearEls = [document.getElementById('year'),document.getElementById('year2'),document.getElementById('year3'),document.getElementById('year4')].filter(Boolean);
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const nav = document.querySelector('.site-nav');
  if(navToggle && nav){
    navToggle.addEventListener('click', ()=>{
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Smooth scroll for internal links (pages may be separate; this helps same-page anchors)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
      }
    });
  });

  // IntersectionObserver to highlight current page's nav link based on URL
  const path = location.pathname.split('/').pop();
  document.querySelectorAll('.site-nav .nav-link').forEach(link=>{
    const href = link.getAttribute('href');
    if(href === path || (href === 'index.html' && (path === '' || path === 'index.html'))){
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Contact form validation (client-side)
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const phone = document.getElementById('phone');
      const formMessage = document.getElementById('formMessage');

      // simple validation
      if(name.value.trim().length < 2){
        formMessage.style.color = 'red'; formMessage.textContent = 'Please enter your name (2+ characters).'; name.focus(); return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email.value.trim())){
        formMessage.style.color = 'red'; formMessage.textContent = 'Please enter a valid email.'; email.focus(); return;
      }
      if(message.value.trim().length < 10){
        formMessage.style.color = 'red'; formMessage.textContent = 'Message should be at least 10 characters.'; message.focus(); return;
      }
      if(phone.value.trim() && !/^[0-9+()\- \s]{7,20}$/.test(phone.value.trim())){
        formMessage.style.color = 'red'; formMessage.textContent = 'Please enter a valid phone number or leave blank.';
        phone.focus(); return;
      }

      // If you don't have a backend, either:
      // 1) Submit to a form backend (Formspree / Netlify Forms etc.) — add action attribute and remove preventDefault
      // 2) Use mailto fallback:
      formMessage.style.color = 'green';
      formMessage.textContent = 'Form validated. Attempting to open your email client...';

      // open mailto (pre-fills subject & body)
      const body = encodeURIComponent(`Name: ${name.value}\nEmail: ${email.value}\nPhone: ${phone.value}\n\nMessage:\n${message.value}`);
      window.location.href = `mailto:your-email@example.com?subject=Website%20Contact&body=${body}`;
    });
  }

  // Gallery modal
  const gallery = document.getElementById('galleryGrid');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  let currentIndex = 0;
  const items = [];

  if(gallery && modal){
    const imgs = Array.from(gallery.querySelectorAll('img'));
    imgs.forEach((img, idx)=>{
      items.push({src:img.src, alt:img.alt, caption: img.parentElement.querySelector('figcaption')?.textContent || ''});
      img.addEventListener('click', ()=> openModal(idx));
    });

    function openModal(idx){
      currentIndex = idx;
      modalImg.src = items[idx].src;
      modalImg.alt = items[idx].alt;
      modalCaption.textContent = items[idx].caption;
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    }
    function closeModal(){
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
    function showNext(){
      currentIndex = (currentIndex + 1) % items.length;
      openModal(currentIndex);
    }
    function showPrev(){
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      openModal(currentIndex);
    }

    modalClose?.addEventListener('click', closeModal);
    modalNext?.addEventListener('click', showNext);
    modalPrev?.addEventListener('click', showPrev);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e)=>{
      if(modal.style.display === 'flex'){
        if(e.key === 'Escape') closeModal();
        if(e.key === 'ArrowRight') showNext();
        if(e.key === 'ArrowLeft') showPrev();
      }
    });
  }
});
