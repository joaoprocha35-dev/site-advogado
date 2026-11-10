export function initAnimations(gsap, ScrollTrigger) {
  const media = gsap.matchMedia();
  const motion = '(prefers-reduced-motion: no-preference)';
  const options = { duration: .7, ease: 'power3.out', clearProps: 'opacity,transform' };
  function draw(timeline, root, position = 0, duration = .9) {
    root?.querySelectorAll('[data-draw]').forEach(path => {
      const length = path.getTotalLength();
      timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
        strokeDashoffset: 0, duration, ease: 'power3.out', clearProps: 'strokeDasharray,strokeDashoffset',
      }, position);
    });
  }
  function sectionTimeline(section) {
    return gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 88%', once: true } });
  }
  media.add(motion, () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.fromTo('.hero-background', { opacity: 0 }, { opacity: 1, duration: .45, clearProps: 'opacity' }, 0)
        .fromTo('.hero-copy > .eyebrow', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5, clearProps: 'opacity,transform' }, .15)
        .fromTo('.hero h1 .line-content', { yPercent: 110 }, { yPercent: 0, duration: .7, stagger: .06, clearProps: 'transform' }, .18)
        .fromTo('.hero-description', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .55, clearProps: 'opacity,transform' }, .6)
        .fromTo('.hero-actions > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, stagger: .1, clearProps: 'opacity,transform' }, .8);
    }
    document.querySelectorAll('.practice-grid').forEach(grid => {
      sectionTimeline(grid).fromTo([...grid.children], { opacity: 0, y: 28 }, { opacity: 1, y: 0, ...options, stagger: .12 });
    });
    document.querySelectorAll('[data-reveal]').forEach(element => {
      if (element.closest('.practice-grid')) return;
      gsap.fromTo(element, { opacity: 0, y: 22 }, {
        opacity: 1, y: 0, ...options,
        scrollTrigger: { trigger: element, start: 'top 92%', once: true },
      });
    });
    const about = document.querySelector('.about-section');
    if (about) {
      sectionTimeline(about)
        .fromTo('.about-photo-mask', { clipPath: 'inset(0 0 100% 0 round 3px)' }, {
          clipPath: 'inset(0 0 0% 0 round 3px)', duration: .85, ease: 'power3.out', clearProps: 'clipPath',
        }, 0)
        .fromTo('.about-frame', { opacity: 0, y: 10 }, { opacity: 1, y: 0, ...options }, .35)
        .fromTo('.about-copy > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, ...options, stagger: .1 }, .2);
    }
    const institutional = document.querySelector('.institutional-section');
    if (institutional) {
      const timeline = sectionTimeline(institutional)
        .fromTo('.institutional-inner .eyebrow', { opacity: 0 }, { opacity: 1, duration: .6, clearProps: 'opacity' }, 0)
        .fromTo('.institutional-inner .line-content', { yPercent: 110 }, { yPercent: 0, duration: .8, stagger: .12, ease: 'power3.out', clearProps: 'transform' }, .1);
      draw(timeline, institutional, .2, 1);
    }
    document.querySelectorAll('.process-track').forEach(track => {
      sectionTimeline(track).fromTo(track.querySelectorAll('.steps li'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, ...options, stagger: .12 }, .15);
    });
    const service = document.querySelector('.service-layout');
    if (service) {
      sectionTimeline(service)
        .fromTo('.service-photo', { scale: 1.04 }, { scale: 1, duration: 1.05, ease: 'power3.out', clearProps: 'transform' }, 0)
        .fromTo('.service-content > *', { opacity: 0, y: 18 }, { opacity: 1, y: 0, ...options, stagger: .1 }, .1);
    }
    document.querySelectorAll('.final-contact').forEach(section => {
      const timeline = sectionTimeline(section).fromTo(section.querySelectorAll('.final-contact-grid > div'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, ...options, stagger: .12 });
      draw(timeline, section, .15);
    });
    gsap.fromTo('.site-footer .container', { opacity: 0 }, { opacity: 1, duration: .55, clearProps: 'opacity', scrollTrigger: { trigger: '.site-footer', start: 'top 96%', once: true } });
  });
  media.add(`(min-width: 1000px) and ${motion}`, () => {
    const photo = document.querySelector('.about-photo-mask img');
    if (photo) gsap.fromTo(photo, { y: -10 }, { y: 10, ease: 'none', scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: .5 } });
  });
  for (const desktop of [true, false]) {
    media.add(`${desktop ? '(min-width: 1000px)' : '(max-width: 999px)'} and ${motion}`, () => {
      document.querySelectorAll('.steps-line').forEach(line => {
        const property = desktop ? 'scaleX' : 'scaleY';
        gsap.fromTo(line, { [property]: 0 }, { [property]: 1, duration: 1.05, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: line.parentElement, start: 'top 88%', once: true } });
      });
    });
  }
  // Cada imagem lazy atualiza as medidas apenas ao terminar o próprio carregamento.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  document.querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
  return () => media.revert();
}
