import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function initSmoothScroll(gsap, ScrollTrigger) {
  let instance;
  let paused = false;
  const media = window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)');
  const tick = time => instance?.raf(time * 1000);
  function configure() {
    gsap.ticker.remove(tick);
    instance?.destroy();
    instance = null;
    if (media.matches) {
      try {
        instance = new Lenis({ autoRaf: false, duration: 1.05, smoothWheel: true, syncTouch: false });
        instance.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        if (paused) instance.stop();
      } catch { instance = null; }
    }
  }
  configure();
  media.addEventListener('change', configure);

  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = anchor.getAttribute('href');
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    const finish = () => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.pushState(null, '', hash);
    };
    const headerOffset = document.querySelector('.site-header').getBoundingClientRect().height + 16;
    if (instance) instance.scrollTo(target, { offset: -headerOffset, onComplete: finish });
    else { target.scrollIntoView({ behavior: 'instant' }); finish(); }
  });
  return {
    stop() { paused = true; instance?.stop(); },
    start() { paused = false; instance?.start(); },
  };
}
