const header = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const cursor = document.querySelector('.cursor-dot');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 18);
});

menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  menuBtn.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.classList.remove('open');
    mobileMenu?.classList.remove('open');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

if (window.matchMedia('(pointer:fine)').matches && cursor) {
  window.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.opacity = '1';
  });

  document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '18px';
      cursor.style.height = '18px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
    });
  });
}

const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    const main = document.querySelector('.main-screen');
    const phone = document.querySelector('.phone-screen');
    const star = document.querySelector('.star-screen');
    if (main) main.style.transform = `rotate(-2.5deg) translate(${x * 8}px, ${y * 8}px)`;
    if (phone) phone.style.transform = `rotate(6deg) translate(${x * -10}px, ${y * -8}px)`;
    if (star) star.style.transform = `rotate(4deg) translate(${x * 12}px, ${y * 10}px)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    const main = document.querySelector('.main-screen');
    const phone = document.querySelector('.phone-screen');
    const star = document.querySelector('.star-screen');
    if (main) main.style.transform = 'rotate(-2.5deg)';
    if (phone) phone.style.transform = 'rotate(6deg)';
    if (star) star.style.transform = 'rotate(4deg)';
  });
}

// Real project visuals are stored as compact Base64 text payloads because this
// GitHub connection writes UTF-8 files only. Decode them into WebP blobs at runtime.
async function loadProjectVisual(payloadPath) {
  const response = await fetch(payloadPath, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Unable to load ${payloadPath}`);
  const base64 = (await response.text()).trim();
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: 'image/webp' }));
}

async function replaceWithRealImage(selector, payloadPath, alt, caseCover = false) {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const url = await loadProjectVisual(payloadPath);
    const img = document.createElement('img');
    img.src = url;
    img.alt = alt;
    img.decoding = 'async';
    img.className = caseCover ? 'case-real-image' : 'real-project-image';
    if (!caseCover) img.loading = 'lazy';
    target.replaceChildren(img);
    if (caseCover) target.classList.add('real-case-cover');
  } catch (error) {
    console.warn('Project visual fallback kept:', error);
  }
}

const inCaseStudy = location.pathname.includes('/work/');
const assetBase = inCaseStudy ? '../../assets/projects/' : 'assets/projects/';

if (!inCaseStudy) {
  replaceWithRealImage('.project-card.mrreel .project-visual', `${assetBase}mrreel.b64`, 'Mr’Reel Arabic AI product interface presentation.');
  replaceWithRealImage('.project-card.startech .project-visual', `${assetBase}startech.b64`, 'STARTECH hotspot service visual and identity.');
  replaceWithRealImage('.project-card.balwer .project-visual', `${assetBase}balwer.b64`, 'Balwer Studio responsive website case-study presentation.');
}

if (document.body.classList.contains('mrreel-case')) {
  replaceWithRealImage('.case-cover', `${assetBase}mrreel.b64`, 'Mr’Reel Arabic AI content creation interface presentation.', true);
}
if (document.body.classList.contains('startech-case')) {
  replaceWithRealImage('.st-cover', `${assetBase}startech.b64`, 'STARTECH official hotspot service visual.', true);
}
if (document.body.classList.contains('balwer-case')) {
  replaceWithRealImage('.bw-cover', `${assetBase}balwer.b64`, 'Balwer Studio responsive website presentation.', true);
}
