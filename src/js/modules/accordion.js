export function initAccordion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = [];
  const refresh = () => document.dispatchEvent(new Event('layout-change'));
  document.querySelectorAll('.accordion-trigger').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel || button.dataset.initialized) return;
    button.dataset.initialized = 'true';
    const state = { button, panel, animation: null, finish: null };
    states.push(state);
    button.addEventListener('click', () => {
      const expand = button.getAttribute('aria-expanded') !== 'true';
      const height = panel.hidden ? 0 : panel.getBoundingClientRect().height;
      state.animation?.cancel();
      button.setAttribute('aria-expanded', String(expand));
      panel.hidden = false;
      state.finish = () => {
        panel.hidden = !expand;
        panel.style.removeProperty('overflow');
        state.animation = null;
        refresh();
      };
      if (reduced.matches || !panel.animate) { state.finish(); return; }
      panel.style.overflow = 'hidden';
      state.animation = panel.animate([{ height: `${height}px` }, { height: `${expand ? panel.scrollHeight : 0}px` }], {
        duration: 300, easing: 'cubic-bezier(.22,.61,.36,1)',
      });
      state.animation.onfinish = state.finish;
    });
    // Sem JS, as respostas permanecem expandidas no HTML.
    button.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) states.forEach(state => { state.animation?.cancel(); state.finish?.(); });
  });
}
