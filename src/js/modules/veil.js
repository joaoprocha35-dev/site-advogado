// Cortina em arco: tela de carregamento na chegada e transição entre páginas internas.
// O estado inicial (.veil-load ou .veil-enter) é definido pelo script inline do <head>.
const STATES = ['veil-load', 'veil-enter', 'veil-out', 'veil-leave'];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function initVeil() {
  const root = document.documentElement;
  const veil = document.querySelector('.veil');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const loading = root.classList.contains('veil-load');
  const entering = root.classList.contains('veil-enter');
  const clear = () => root.classList.remove(...STATES);
  let release;
  const released = new Promise(resolve => { release = resolve; });
  let reveal;
  const revealed = new Promise(resolve => { reveal = resolve; });
  root.classList.add('veil-ok');

  if (!veil || reduced.matches || (!loading && !entering)) {
    clear();
    reveal();
  } else {
    // O carregamento completo espera o desenho do arco; a transição só segura um instante.
    const hold = delay(Math.max(0, (loading ? 2150 : 380) - performance.now()));
    const pageLoaded = loading && document.readyState !== 'complete'
      ? new Promise(resolve => window.addEventListener('load', resolve, { once: true }))
      : Promise.resolve();
    const ready = Promise.race([Promise.all([released, pageLoaded]), delay(3500)]);
    Promise.all([hold, ready]).then(() => {
      root.classList.add('veil-out');
      setTimeout(reveal, loading ? 380 : 180);
      setTimeout(clear, 1100);
    });
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!veil || !link || reduced.matches || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.protocol !== location.protocol || url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    event.preventDefault();
    try { sessionStorage.setItem('veil', '1'); } catch { /* a página seguinte usa o carregamento completo */ }
    clear();
    root.classList.add('veil-leave');
    setTimeout(() => { location.href = url.href; }, 720);
  });
  // Ao voltar pelo histórico (bfcache), a página reaparece sem a cortina.
  window.addEventListener('pageshow', event => { if (event.persisted) clear(); });

  return { revealed, release };
}
