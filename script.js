// Lightweight interactivity: nav toggle, lazy-load images, lightbox, simple particle background
document.addEventListener('DOMContentLoaded', () => {

  // NAV TOGGLE for small screens
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.style.display = expanded ? '' : 'flex';
    });
  }

  // Simple lazy loader for images with data-src
  const lazyImages = document.querySelectorAll('img.lazy');
  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {rootMargin: '200px'});
    lazyImages.forEach(img => lazyObserver.observe(img));
  } else {
    // fallback: load all
    lazyImages.forEach(img => img.src = img.dataset.src);
  }

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lightboxImage');
  const lbTitle = document.getElementById('lightboxTitle');

  document.querySelectorAll('button[data-open="modal"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.src;
      const title = btn.dataset.title || '';
      lbImage.src = src;
      lbImage.alt = title;
      lbTitle.textContent = title;
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  document.querySelectorAll('.lightbox-close').forEach(btn => {
    btn.addEventListener('click', () => {
      lightbox.setAttribute('aria-hidden', 'true');
      lbImage.src = '';
      lbTitle.textContent = '';
    });
  });

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });

  // Contact form validation (simple)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Basic front-end validation
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();
      if (!name || !email || !message) {
        e.preventDefault();
        alert('Please complete all fields before sending.');
      }
      // If you'd like to post to a server, intercept and send via fetch() here.
    });
  }

  // Simple canvas particle background (lightweight)
  initParticles();

  // Adjust progress bars (in case CSS width isn't enough for animation)
  document.querySelectorAll('.progress').forEach(p => {
    const v = p.getAttribute('data-value');
    const bar = p.querySelector('.bar');
    if (bar && v) {
      // Delay to animate after paint
      setTimeout(() => bar.style.width = `${v}%`, 200);
    }
  });

});

// PARTICLES: tiny and efficient — fallbacks gracefully if canvas unsupported
function initParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const count = Math.max(20, Math.floor(w * h / 90000));

  function rand(min, max){ return Math.random()*(max-min)+min }

  for (let i=0;i<count;i++){
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.6,2.4),
      vx: rand(-0.2,0.2),
      vy: rand(-0.3,0.3),
      alpha: rand(0.07,0.25)
    });
  }

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  addEventListener('resize', resize);

  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(0,255,204,${p.alpha})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}