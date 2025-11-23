// Simple JS for navigation toggle, year, modal, and form validation
// set years in footers
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
document.getElementById('year-2') && (document.getElementById('year-2').textContent = new Date().getFullYear());
document.getElementById('year-3') && (document.getElementById('year-3').textContent = new Date().getFullYear());
document.getElementById('year-4') && (document.getElementById('year-4').textContent = new Date().getFullYear());


// mobile nav toggles
const toggles = document.querySelectorAll('.menu-toggle');
toggles.forEach(btn => {
btn.addEventListener('click', ()=>{
const next = btn.nextElementSibling || document.getElementById(btn.getAttribute('aria-controls'));
const links = btn.parentElement.querySelector('.nav-links');
if(!links) return;
links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
links.style.flexDirection = 'column';
});
});


// active link highlight based on pathname
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a=>{
if(a.getAttribute('href') === path) a.classList.add('active');
});


// gallery modal
const thumbs = document.querySelectorAll('.thumb');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');
thumbs.forEach(t=> t.addEventListener('click', e=>{
const src = t.dataset.full || t.src;
modalImg.src = src;
modal.style.display = 'flex';
modal.setAttribute('aria-hidden','false');
}));
modalClose && modalClose.addEventListener('click', ()=>{ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); });
modal && modal.addEventListener('click', e=>{ if(e.target === modal) { modal.style.display='none'; modal.setAttribute('aria-hidden','true'); } });


// contact form validation (client-side only)
const form = document.getElementById('contact-form');
if(form){
form.addEventListener('submit', (e)=>{
e.preventDefault();
const name = form.name.value.trim();
const email = form.email.value.trim();
const msg = form.message.value.trim();
const msgEl = document.getElementById('form-msg');
function validEmail(em){
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
}
if(!name || !email || !msg){ msgEl.textContent = 'Please fill all fields.'; return; }
if(!validEmail(email)){ msgEl.textContent = 'Please enter a valid email.'; return; }
// placeholder success (in production, integrate with backend or Formspree)
msgEl.textContent = 'Thanks! Your message was sent (demo).';
form.reset();
});
}


})();


-- FILE: assets/images/README.txt
Place your image files here. For best results include:
- project1.jpg, project2.jpg, project3.jpg
- photo1.jpg, photo2.jpg, photo3.jpg, photo4.jpg
- *_large.jpg versions for modal (optional)
