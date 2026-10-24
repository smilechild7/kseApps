(() => {
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('[data-menu-toggle]');
  if (!toggle) return;
  header.dataset.menuEnhanced = '';
  const mobile = window.matchMedia('(max-width: 720px)');
  const close = () => {
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  header.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) close();
  });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      close();
      toggle.focus();
    }
  });
  mobile.addEventListener('change', close);
})();
