/* ============================================================
   PATAGONIA PASS — main.js
   ============================================================ */

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Trigger initial reveal
    checkReveal();
  }, 2000);
});

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  checkReveal();
  updateCounters();
});

/* ---- MOBILE MENU ---- */
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navMobile.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ---- HERO SLIDESHOW ---- */
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function startSlideShow() {
  slideInterval = setInterval(nextSlide, 6000);
}

startSlideShow();

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(i);
    startSlideShow();
  });
});

/* ---- PARTICLE CANVAS ---- */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = Math.random() * 0.3 + 0.1;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7 ? '#00e5c8' : '#ffffff';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y > canvas.height + 10) this.reset();
    if (this.x < -10 || this.x > canvas.width + 10) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function initParticles() {
  if (!canvas) return;
  resizeCanvas();
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 12000);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

initParticles();
animateParticles();

/* ---- SCROLL REVEAL ---- */
function checkReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}

// Initial check
setTimeout(checkReveal, 100);

/* ---- COUNTER ANIMATION ---- */
let countersStarted = false;
function updateCounters() {
  if (countersStarted) return;
  const strip = document.querySelector('.stats-strip');
  if (!strip) return;
  const rect = strip.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    countersStarted = true;
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, 0, target, 1800);
    });
  }
}

function animateCounter(el, start, end, duration) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ---- EXPERIENCE SLIDER ---- */
let expOffset = 0;
const expSlider = document.getElementById('expSlider');

function slideExp(dir) {
  if (!expSlider) return;
  const cards     = expSlider.querySelectorAll('.exp-card');
  const cardWidth = cards[0].offsetWidth + 24;
  const maxOffset = -(cards.length - getVisibleCards()) * cardWidth;

  expOffset += dir * -cardWidth;
  expOffset  = Math.max(maxOffset, Math.min(0, expOffset));
  expSlider.style.transform = `translateX(${expOffset}px)`;
}

function getVisibleCards() {
  const w = window.innerWidth;
  if (w < 600) return 1;
  if (w < 900) return 2;
  return 3;
}

// Touch/swipe support for experience slider
let touchStartX = 0;
if (expSlider) {
  expSlider.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  expSlider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) slideExp(diff > 0 ? 1 : -1);
  });
}

/* ---- EXAMPLE CHIPS ---- */
function fillExample(el) {
  const input = document.getElementById('searchInput');
  if (input) {
    const text = el.textContent.replace(/['"]/g, '');
    input.value = text;
    input.focus();
    // Animate chip
    el.style.background = 'rgba(0,229,200,0.2)';
    el.style.borderColor = 'rgba(0,229,200,0.5)';
    el.style.color = '#00e5c8';
    setTimeout(() => {
      el.style.background = '';
      el.style.borderColor = '';
      el.style.color = '';
    }, 600);
  }
}

/* ---- ITINERARY COMPOSER ---- */
const itineraryData = {
  pingüinos: [
    { time: '09:00 AM', title: 'Recogida en Puerto', detail: '📍 Muelle Prat, Punta Arenas', icon: '🚐' },
    { time: '10:30 AM', title: 'Navegación al Islote Magdalena', detail: '⛵ Travesía por el Estrecho', icon: '⛵' },
    { time: '11:30 AM', title: 'Avistamiento de Pingüinos', detail: '📍 Isla Magdalena', icon: '🐧' },
    { time: '01:30 PM', title: 'Almuerzo Centolla', detail: '🍽️ Restaurante Local Certificado', icon: '🦀' },
    { time: '03:30 PM', title: 'Regreso al Hotel', detail: '🚐 Transporte Privado', icon: '🏨' },
  ],
  torres: [
    { time: '06:00 AM', title: 'Salida desde Punta Arenas', detail: '🚐 Transporte privado a Puerto Natales', icon: '🚐' },
    { time: '09:00 AM', title: 'Ingreso al Parque Nacional', detail: '📍 Torres del Paine', icon: '🏔️' },
    { time: '10:00 AM', title: 'Trekking Base Torres', detail: '🥾 Guía certificado incluido', icon: '🥾' },
    { time: '01:00 PM', title: 'Almuerzo en Refugio', detail: '🍽️ Gastronomía de montaña', icon: '🍽️' },
    { time: '05:00 PM', title: 'Regreso a Punta Arenas', detail: '🚐 Transporte privado', icon: '🏠' },
  ],
  naturaleza: [
    { time: '09:00 AM', title: 'Recogida en Alojamiento', detail: '🚐 Transporte incluido', icon: '🚐' },
    { time: '10:00 AM', title: 'Reserva Natural Magallanes', detail: '📍 Sendero interpretativo', icon: '🌿' },
    { time: '12:00 PM', title: 'Avistamiento de Fauna', detail: '🦙 Guanacos y aves nativas', icon: '🦙' },
    { time: '01:30 PM', title: 'Picnic Patagónico', detail: '🧺 Productos locales artesanales', icon: '🧺' },
    { time: '04:00 PM', title: 'Regreso', detail: '🚐 Transporte privado', icon: '🏠' },
  ],
  default: [
    { time: '09:00 AM', title: 'Recogida en Alojamiento', detail: '🚐 Transporte privado incluido', icon: '🚐' },
    { time: '10:30 AM', title: 'Experiencia Principal', detail: '🧭 Guía local certificado', icon: '🧭' },
    { time: '01:00 PM', title: 'Almuerzo Local', detail: '🍽️ Gastronomía patagónica auténtica', icon: '🍽️' },
    { time: '03:00 PM', title: 'Actividad Complementaria', detail: '📍 Según disponibilidad', icon: '🌟' },
    { time: '05:30 PM', title: 'Regreso al Hotel', detail: '🚐 Transporte privado', icon: '🏨' },
  ]
};

function composeItinerary() {
  const input = document.getElementById('searchInput');
  const btn   = document.getElementById('btnCompose');
  const result = document.getElementById('itineraryResult');
  const body   = document.getElementById('itineraryBody');

  if (!input || !input.value.trim()) {
    input.style.borderColor = 'rgba(239,68,68,0.6)';
    input.placeholder = '⚠️ Escribe qué te gustaría vivir en tu viaje...';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'Ej: "Somos 2 personas, queremos ver pingüinos y almorzar centolla hoy"';
    }, 2000);
    return;
  }

  // Loading state
  btn.classList.add('loading');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite;width:18px;height:18px">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
    Componiendo...
  `;

  // Add spin keyframe
  if (!document.getElementById('spinStyle')) {
    const style = document.createElement('style');
    style.id = 'spinStyle';
    style.textContent = '@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }';
    document.head.appendChild(style);
  }

  const query = input.value.toLowerCase();
  let data;
  if (query.includes('pingü') || query.includes('penguin') || query.includes('magdalena')) {
    data = itineraryData.pingüinos;
  } else if (query.includes('torres') || query.includes('paine') || query.includes('trekking')) {
    data = itineraryData.torres;
  } else if (query.includes('naturaleza') || query.includes('fauna') || query.includes('guanaco')) {
    data = itineraryData.naturaleza;
  } else {
    data = itineraryData.default;
  }

  setTimeout(() => {
    // Reset button
    btn.classList.remove('loading');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      Componer Itinerario
    `;

    // Build itinerary HTML
    body.innerHTML = data.map(item => `
      <div class="itin-result-item">
        <div class="itin-result-time">${item.time}</div>
        <div class="itin-result-desc">
          <strong>${item.icon} ${item.title}</strong>
          <span>${item.detail}</span>
        </div>
      </div>
    `).join('');

    result.classList.remove('hidden');

    // Scroll to result
    setTimeout(() => {
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, 1800);
}

function confirmReservation() {
  const btn = document.querySelector('.btn-confirm');
  if (btn) {
    btn.textContent = '✓ ¡Reserva Confirmada! Te contactaremos pronto.';
    btn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
    btn.style.cursor = 'default';
    btn.disabled = true;

    // Confetti-like effect
    createConfetti();
  }
}

function createConfetti() {
  const colors = ['#00e5c8', '#ff6b35', '#7c3aed', '#22c55e', '#fbbf24'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;
      top:${Math.random() * 40 + 30}%;
      left:${Math.random() * 100}%;
      width:${Math.random() * 8 + 4}px;
      height:${Math.random() * 8 + 4}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events:none;
      z-index:9998;
      animation:confettiFall ${Math.random() * 2 + 1.5}s ease forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  if (!document.getElementById('confettiStyle')) {
    const style = document.createElement('style');
    style.id = 'confettiStyle';
    style.textContent = `
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- KEYBOARD SHORTCUT: Enter to compose ---- */
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      composeItinerary();
    }
  });
}

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ---- PARALLAX on hero ---- */
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && window.scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    heroContent.style.opacity   = 1 - window.scrollY / (window.innerHeight * 0.7);
  }
});
