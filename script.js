const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#menu-principal');

window.addEventListener('scroll', () => header.classList.toggle('is-sticky', window.scrollY > 120), { passive: true });
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); document.body.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('[data-subject]').forEach(link => link.addEventListener('click', () => {
  const select = document.querySelector('[name="assunto"]');
  const matching = [...select.options].find(option => option.text.includes(link.dataset.subject));
  if (matching) select.value = matching.value;
}));

if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl.from('.hero-media img', { scale: 1.12, duration: 1.8 })
    .from('.hero-kicker', { opacity: 0, y: 18, duration: .7 }, '-=1.15')
    .from('#hero-title span', { opacity: 0, y: 70, stagger: .12, duration: .95 }, '-=.7')
    .from('.hero-copy, .hero-actions', { opacity: 0, y: 24, stagger: .12, duration: .7 }, '-=.55')
    .from('.hero-note', { opacity: 0, x: 25, duration: .7 }, '-=.5');

  gsap.to('.hero-media img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
  gsap.utils.toArray('.reveal').forEach(element => gsap.from(element, { opacity: 0, y: 35, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } }));
  gsap.utils.toArray('.reveal-photo').forEach(element => gsap.from(element.querySelector('img'), { scale: 1.1, duration: 1.3, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 82%', once: true } }));
  document.querySelectorAll('[data-count]').forEach(counter => {
    const target = Number(counter.dataset.count); const state = { value: 0 };
    gsap.to(state, { value: target, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: counter, start: 'top 90%', once: true }, onUpdate: () => counter.textContent = Math.round(state.value) });
  });
}

const form = document.querySelector('#contact-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const wrapper = field.closest('label');
    const fieldValid = field.type === 'checkbox' ? field.checked : field.checkValidity();
    if (wrapper) wrapper.classList.toggle('invalid', !fieldValid);
    valid = valid && fieldValid;
  });
  const status = form.querySelector('.form-status');
  if (!valid) { status.textContent = 'Revise os campos destacados antes de enviar.'; status.className = 'form-status'; return; }
  const data = new FormData(form);
  const subject = encodeURIComponent(`[Site] ${data.get('assunto')} — ${data.get('nome')}`);
  const body = encodeURIComponent(`Nome: ${data.get('nome')}\nTelefone: ${data.get('telefone')}\nE-mail: ${data.get('email')}\n\n${data.get('mensagem')}`);
  status.textContent = 'Tudo certo! Abrindo seu aplicativo de e-mail para concluir o envio.';
  status.className = 'form-status success';
  setTimeout(() => { window.location.href = `mailto:contato@bernardomonteiro.com.br?subject=${subject}&body=${body}`; }, 350);
});
form.querySelectorAll('input, select, textarea').forEach(field => field.addEventListener('input', () => field.closest('label')?.classList.remove('invalid')));
document.querySelector('#year').textContent = new Date().getFullYear();
