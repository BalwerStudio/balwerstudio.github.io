const header = document.querySelector('.site-header');
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const cursor = document.querySelector('.cursor-dot');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 18);
});

menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  menuBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.classList.remove('open');
    mobileMenu.classList.remove('open');
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

if (window.matchMedia('(pointer:fine)').matches) {
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

    document.querySelector('.main-screen').style.transform = `rotate(-2.5deg) translate(${x * 8}px, ${y * 8}px)`;
    document.querySelector('.phone-screen').style.transform = `rotate(6deg) translate(${x * -10}px, ${y * -8}px)`;
    document.querySelector('.star-screen').style.transform = `rotate(4deg) translate(${x * 12}px, ${y * 10}px)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    document.querySelector('.main-screen').style.transform = 'rotate(-2.5deg)';
    document.querySelector('.phone-screen').style.transform = 'rotate(6deg)';
    document.querySelector('.star-screen').style.transform = 'rotate(4deg)';
  });
}
