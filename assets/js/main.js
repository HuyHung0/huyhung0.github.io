'use strict';

'use strict';

// Mobile nav toggle + scrim + no background scroll
const header = document.querySelector('header');
const btn = document.querySelector('.hamburger');
const scrim = document.querySelector('.nav-scrim');

function setMenuOpen(open){
  header.setAttribute('data-open', String(open));
  btn?.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('nav-open', open);
}

btn?.addEventListener('click', () => {
  const open = header.getAttribute('data-open') === 'true';
  setMenuOpen(!open);
});

// Close when clicking a nav link (good on phones)
document.querySelectorAll('nav.menu a').forEach(a => {
  a.addEventListener('click', () => setMenuOpen(false));
});

// Close when tapping the scrim or pressing Escape
scrim?.addEventListener('click', () => setMenuOpen(false));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenuOpen(false); });


// Close mobile menu after clicking a link (good on phones)
const navLinksAll = [...document.querySelectorAll('nav.menu a')];
navLinksAll.forEach(a => a.addEventListener('click', () => {
  header.setAttribute('data-open', 'false');
  document.documentElement.classList.remove('nav-open');
  btn?.setAttribute('aria-expanded', 'false');
}));

// Reveal-on-scroll
const revealables = document.querySelectorAll('.reveal');
const ioReveal = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });
revealables.forEach(el => ioReveal.observe(el));

// Scrollspy (fixed header aware)
const sectionIDs = ['about','education','experience','projects','certifications','publications','legal','activities'];
const navLinks = [...document.querySelectorAll('nav.menu a')];
const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;

let sectionsData = [];
function offsetTop(el){ const r = el.getBoundingClientRect(); return r.top + window.scrollY; }
function recalcSections(){
  sectionsData = sectionIDs.map(id => {
    const el = document.getElementById(id);
    return el ? { id, top: offsetTop(el) - navH - 8 } : null;
  }).filter(Boolean).sort((a,b)=>a.top-b.top);
}
function setActive(){
  const y = window.scrollY;
  let current = sectionsData[0]?.id;
  for (const s of sectionsData){ if (y >= s.top) current = s.id; else break; }
  if (window.innerHeight + y >= document.body.scrollHeight - 2) {
    current = sectionsData[sectionsData.length - 1]?.id;
  }
  navLinks.forEach(a => a.removeAttribute('aria-current'));
  const active = navLinks.find(a => a.getAttribute('href') === '#' + current);
  if (active) active.setAttribute('aria-current','page');
}
const onScroll = () => { setActive(); };
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => { recalcSections(); setActive(); });
window.addEventListener('orientationchange', () => { recalcSections(); setActive(); });
window.addEventListener('load', () => { recalcSections(); setActive(); });
if (document.fonts && document.fonts.ready) { document.fonts.ready.then(() => { recalcSections(); setActive(); }); }

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
// Back-to-top: robust on iOS/Android (fixed-header friendly)
const backToTop = document.getElementById('backToTop');
backToTop?.addEventListener('click', (e) => {
  e.preventDefault();
  // Close mobile menu if open so we can scroll
  document.documentElement.classList.remove('nav-open');
  document.querySelector('header')?.setAttribute('data-open', 'false');
  document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');

  // Smooth scroll to top (works even if #top is a fixed element)
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Optional: keep URL clean (remove #top if added by fallback)
  if (location.hash === '#top') {
    history.replaceState(null, '', location.pathname + location.search);
  }
});
