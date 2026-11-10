import { initNavigation } from './modules/navigation.js';
import { initAccordion } from './modules/accordion.js';
import { initContactForm } from './modules/contact-form.js';
import { initVeil } from './modules/veil.js';

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
const veil = initVeil();
const navigation = initNavigation();
initAccordion();
initContactForm();

// As interações essenciais não dependem das bibliotecas de movimento.
Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('./modules/smooth-scroll.js'), import('./modules/animations.js')])
  .then(([{ gsap }, { ScrollTrigger }, { initSmoothScroll }, { initAnimations }]) => {
    gsap.registerPlugin(ScrollTrigger);
    const smooth = initSmoothScroll(gsap, ScrollTrigger);
    navigation.setSmoothScroll(smooth);
    // A entrada da página só começa quando a cortina de carregamento sobe.
    initAnimations(gsap, ScrollTrigger, veil.revealed);
    document.addEventListener('layout-change', () => ScrollTrigger.refresh());
  })
  .catch(() => {
    // Leitura e navegação nativa permanecem disponíveis se as bibliotecas falharem.
    document.querySelectorAll('[data-reveal], main [style], .site-header [style], .site-footer [style]').forEach(el => {
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
      el.style.removeProperty('visibility');
      el.style.removeProperty('clip-path');
      el.style.removeProperty('stroke-dasharray');
      el.style.removeProperty('stroke-dashoffset');
    });
  })
  .finally(() => veil.release());
