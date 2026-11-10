export function initAnimations(gsap, ScrollTrigger, revealed = Promise.resolve()) {
  const media = gsap.matchMedia();
  const motion = '(prefers-reduced-motion: no-preference)';
  const options = { duration: .7, ease: 'power3.out', clearProps: 'opacity,transform' };
  function draw(timeline, root, position = 0, duration = .9) {
    root?.querySelectorAll('[data-draw]').forEach((path, index) => {
      const length = path.getTotalLength();
      timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
        strokeDashoffset: 0, duration, ease: 'power3.inOut', clearProps: 'strokeDasharray,strokeDashoffset',
      }, position + index * .18);
    });
  }
  function sectionTimeline(section) {
    return gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 88%', once: true } });
  }
  media.add(motion, () => {
    // Entrada em cascata: cabeçalho, título linha a linha, texto, botão e imagem.
    const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    const headerItems = gsap.utils.toArray('.site-header .brand, .desktop-nav a, .site-header .header-cta, .menu-toggle');
    intro.fromTo(headerItems, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: .6, stagger: .06, clearProps: 'opacity,transform' }, 0);
    const hero = document.querySelector('.hero');
    if (hero) {
      intro.fromTo('.hero-background', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.7, ease: 'power2.out', clearProps: 'opacity,transform' }, 0)
        .fromTo('.hero-copy > .eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, clearProps: 'opacity,transform' }, .2)
        .fromTo('.hero h1 .line-content', { yPercent: 112 }, { yPercent: 0, duration: .95, stagger: .13, ease: 'power4.out', clearProps: 'transform' }, .3)
        .fromTo('.hero-description', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7, clearProps: 'opacity,transform' }, .95)
        .fromTo('.hero-actions > *', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6, stagger: .1, clearProps: 'opacity,transform' }, 1.12);
    }
    const heading = document.querySelector('.page-heading, .not-found');
    if (heading) {
      intro.fromTo(heading.querySelectorAll('.container > :not(.decorative-arch):not(.error-number)'), { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: .8, stagger: .11, clearProps: 'opacity,transform',
      }, .15);
      draw(intro, heading, .35, 1.5);
    }
    revealed.then(() => intro.play());

    // Arcada: os cards sobem um após o outro e o conteúdo de cada um vem em seguida.
    document.querySelectorAll('.practice-grid').forEach(grid => {
      const timeline = sectionTimeline(grid)
        .fromTo([...grid.children], { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: .95, ease: 'power3.out', stagger: .16, clearProps: 'opacity,transform' });
      grid.querySelectorAll('.practice-card').forEach((card, index) => {
        timeline.fromTo([...card.children], { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out', stagger: .08, clearProps: 'opacity,transform' }, .3 + index * .16);
      });
    });
    document.querySelectorAll('[data-reveal], .form-panel, .article-section, .areas-editorial, .contact-aside > div').forEach(element => {
      if (element.closest('.practice-grid')) return;
      gsap.fromTo(element, { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, ...options,
        scrollTrigger: { trigger: element, start: 'top 92%', once: true },
      });
    });
    // Listas internas entram em sequência, item por item.
    [['.editorial-rows', 'article'], ['.related-links', 'a'], ['.contact-channels', 'div'], ['.contact-extra', 'div'], ['.page-about .service-info', 'div']].forEach(([list, item]) => {
      document.querySelectorAll(list).forEach(root => {
        sectionTimeline(root).fromTo(root.querySelectorAll(`:scope > ${item}`), { opacity: 0, y: 22 }, { opacity: 1, y: 0, ...options, stagger: .1 });
      });
    });
    const about = document.querySelector('.about-section');
    if (about) {
      sectionTimeline(about)
        .fromTo('.about-photo-mask', { clipPath: 'inset(0 0 100% 0 round 3px)' }, {
          clipPath: 'inset(0 0 0% 0 round 3px)', duration: 1.05, ease: 'power3.inOut', clearProps: 'clipPath',
        }, 0)
        .fromTo('.about-frame', { opacity: 0, x: -14, y: -14 }, { opacity: 1, x: 0, y: 0, ...options, duration: .9 }, .45)
        .fromTo('.about-copy > *', { opacity: 0, y: 22 }, { opacity: 1, y: 0, ...options, stagger: .1 }, .25);
    }
    const institutional = document.querySelector('.institutional-section');
    if (institutional) {
      const timeline = sectionTimeline(institutional)
        .fromTo('.institutional-inner .eyebrow', { opacity: 0 }, { opacity: 1, duration: .6, clearProps: 'opacity' }, 0)
        .fromTo('.institutional-inner .line-content', { yPercent: 112 }, { yPercent: 0, duration: .95, stagger: .14, ease: 'power4.out', clearProps: 'transform' }, .1);
      draw(timeline, institutional, .2, 1);
    }
    // Processo: cada etapa aparece, a linha é traçada e o marcador fecha o trecho.
    document.querySelectorAll('.process-track').forEach(track => {
      const timeline = sectionTimeline(track);
      track.querySelectorAll('.steps li').forEach((step, index) => {
        const at = .15 + index * .24;
        timeline.fromTo([...step.children], { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out', stagger: .07, clearProps: 'opacity,transform' }, at)
          .fromTo(step, { '--draw': 0 }, { '--draw': 1, duration: .7, ease: 'power2.inOut' }, at)
          .fromTo(step, { '--node': 0 }, { '--node': 1, duration: .45, ease: 'back.out(2.5)' }, at + .55);
      });
    });
    const service = document.querySelector('.service-layout');
    if (service) {
      sectionTimeline(service)
        .fromTo('.service-photo', { scale: 1.08 }, { scale: 1, duration: 1.3, ease: 'power3.out', clearProps: 'transform' }, 0)
        .fromTo('.service-content > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, ...options, stagger: .1 }, .1);
    }
    document.querySelectorAll('.final-contact').forEach(section => {
      const timeline = sectionTimeline(section).fromTo(section.querySelectorAll('.final-contact-grid > div'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, ...options, stagger: .12 });
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
