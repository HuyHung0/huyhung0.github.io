'use strict';

// Mobile nav toggle + prevent background scrolling on small screens
const header = document.querySelector('header');
const btn = document.querySelector('.hamburger');
btn?.addEventListener('click', () => {
  const open = header.getAttribute('data-open') === 'true';
  header.setAttribute('data-open', String(!open));
  btn.setAttribute('aria-expanded', String(!open));
  document.documentElement.classList.toggle('nav-open', !open);
});

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
const sectionIDs = ['about','education','projects','certifications','publications','activities'];
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
