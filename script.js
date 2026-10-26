// Cinematic preloader: show once per browser tab session.
const preloader = document.getElementById('preloader');
if(preloader){
  let alreadyShown = false;
  try {
    alreadyShown = sessionStorage.getItem('portfolio-preloader-shown') === 'true';
  } catch (_) {}
  if(alreadyShown){
    preloader.remove();
  } else {
    try { sessionStorage.setItem('portfolio-preloader-shown', 'true'); } catch (_) {}
    document.body.classList.add('pre-active');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const holdTime = prefersReduced ? 100 : 3000;
    const countdown = document.getElementById('preloaderCountdown');
    if(countdown && !prefersReduced){
      let seconds = 3;
      countdown.textContent = String(seconds).padStart(2, '0');
      const countdownTimer = setInterval(() => {
        seconds -= 1;
        countdown.textContent = String(Math.max(seconds, 0)).padStart(2, '0');
        if(seconds <= 0) clearInterval(countdownTimer);
      }, 1000);
    }
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('pre-done');
        document.body.classList.remove('pre-active');
        setTimeout(() => preloader.remove(), 750);
      }, holdTime);
    });
  }
}

// Scroll progress bar
const progressFill = document.getElementById('progressFill');
function updateProgress(){
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const scrolled = max > 0 ? (h.scrollTop / max) * 100 : 0;
  progressFill.style.width = scrolled + '%';
}
document.addEventListener('scroll', updateProgress, { passive:true });

// Navbar hide on scroll down, show on scroll up
const navbar = document.getElementById('navbar');
let lastScroll = 0;
document.addEventListener('scroll', () => {
  const cur = window.scrollY;
  if(cur > 120 && cur > lastScroll){
    navbar.classList.add('nav-hidden');
  } else {
    navbar.classList.remove('nav-hidden');
  }
  navbar.classList.toggle('nav-scrolled', cur > 40);
  lastScroll = cur;
}, { passive:true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Animated counters
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const duration = 900;
      const stepTime = 40;
      const steps = duration / stepTime;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if(current >= target){
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, stepTime);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// Command palette
const commandPalette = document.getElementById('commandPalette');
const commandClose = document.querySelector('.command-close');
function openCommandPalette(){
  if(commandPalette && !commandPalette.open) commandPalette.showModal();
}
document.addEventListener('keydown', event => {
  if((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'){
    event.preventDefault();
    openCommandPalette();
  }
  if(event.key === 'Escape' && commandPalette?.open) commandPalette.close();
});
commandClose?.addEventListener('click', () => commandPalette?.close());
commandPalette?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  if(link.getAttribute('href')?.startsWith('#')) commandPalette.close();
}));
