export function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  const close = menu.querySelector('.menu-close');
  let smooth;
  let previousOverflow = '';
  let menuActive = false;
  let openingAnimation;
  const headerSize = new ResizeObserver(() => document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`));
  headerSize.observe(header);
  toggle.hidden = false;
  const markScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  markScroll();
  window.addEventListener('scroll', markScroll, { passive: true });

  const restorePage = () => {
    if (!menuActive) return;
    menuActive = false;
    openingAnimation?.cancel();
    document.body.style.overflow = previousOverflow;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    smooth?.start();
    toggle.focus({ preventScroll: true });
  };
  const closeMenu = () => {
    if (menu.open) menu.close();
    restorePage();
  };
  toggle.addEventListener('click', () => {
    if (menu.open) return closeMenu();
    previousOverflow = document.body.style.overflow;
    menu.showModal();
    menuActive = true;
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    smooth?.stop();
    close.focus();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && menu.animate) {
      openingAnimation = menu.animate([{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 1, transform: 'translateX(0)' }], {
        duration: 300, easing: 'cubic-bezier(.22,.61,.36,1)',
      });
    }
  });
  close.addEventListener('click', closeMenu);
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  menu.addEventListener('click', event => {
    if (event.target !== menu) return;
    const box = menu.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right) closeMenu();
  });
  // Fechamento síncrono evita que a rolagem aguarde o evento close da próxima frame.
  menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  menu.addEventListener('close', restorePage);
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...menu.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')].filter(el => el.getClientRects().length);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  window.matchMedia('(min-width: 1000px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  return { setSmoothScroll(instance) { smooth = instance; if (menu.open) smooth.stop(); } };
}
