import { chromium } from 'playwright';
import { preview } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';

// Uma rodada de integração; sem tentativas automáticas nem refinamento visual.
const server = await preview({ preview: { host: '127.0.0.1', port: 4173, strictPort: true } });
let browser;
const report = { checks: [], errors: [], widths: [] };
const check = (value, name) => { report.checks.push({ name, passed: Boolean(value) }); if (!value) report.errors.push(name); };
await mkdir('artifacts', { recursive: true });
try {
  browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(`JS: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(`Console: ${message.text()}`); });
  page.on('requestfailed', request => report.errors.push(`Requisição: ${request.url()}`));
  const load = async path => {
    await page.goto(`http://127.0.0.1:4173/${path}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(async img => { img.loading = 'eager'; await img.decode(); }));
    });
    await page.waitForTimeout(1900);
  };
  const layout = () => page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).length }));
  const reveal = async () => {
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * .7) {
        scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 85));
      }
    });
    await page.waitForTimeout(1400);
  };
  for (const width of [1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    await load('index.html');
    const result = await layout(); report.widths.push(result);
    check(result.scrollWidth <= width + 1 && result.brokenImages === 0, `Layout e imagens em ${width}px`);
    check(await page.locator('.hero .line-content').evaluateAll(els => els.every(el => getComputedStyle(el).transform === 'none')), `Hero terminou e título visível em ${width}px`);
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: `artifacts/editorial-hero-${width}.png` });
      await reveal();
      check(await page.locator('.practice-grid > div').evaluateAll(els => els.every(el => getComputedStyle(el).opacity === '1')), `Cards revelados em ${width}px`);
      await page.screenshot({ path: `artifacts/editorial-full-${width}.png`, fullPage: true });
      await page.locator('.about-section').scrollIntoViewIfNeeded(); await page.waitForTimeout(750);
      await page.screenshot({ path: `artifacts/editorial-about-${width}.png` });
      check(await page.locator('.about-photo-mask').evaluate(el => getComputedStyle(el).clipPath === 'none'), `Máscara da foto liberada em ${width}px`);
      const parallax = await page.locator('.about-photo-mask img').evaluate(el => getComputedStyle(el).transform);
      check(width === 1440 ? parallax !== 'none' : parallax === 'none', `Parallax restrito ao desktop em ${width}px`);
    }
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('.menu-toggle').click();
  check(await page.locator('#mobile-menu').evaluate(el => el.open), 'Menu abre');
  check(await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'true', 'Menu informa aria-expanded');
  for (let i = 0; i < 9; i++) await page.keyboard.press('Tab');
  check(await page.evaluate(() => Boolean(document.activeElement.closest('#mobile-menu'))), 'Menu mantém o foco');
  await page.keyboard.press('Escape');
  check(await page.locator('.menu-toggle').evaluate(el => el === document.activeElement), 'Escape devolve foco');
  check(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'Menu libera rolagem');

  const trigger = page.locator('.accordion-trigger').first();
  const panel = page.locator('.accordion-panel').first();
  await trigger.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  check(await trigger.getAttribute('aria-expanded') === 'true' && await panel.isVisible(), 'Accordion abre com Enter e atualiza aria-expanded');
  await page.keyboard.press('Space'); await page.waitForTimeout(400);
  check(await trigger.getAttribute('aria-expanded') === 'false' && await panel.isHidden(), 'Accordion fecha com Espaço');
  await trigger.click(); await page.waitForTimeout(100); await trigger.click(); await page.waitForTimeout(400);
  check(await panel.isHidden(), 'Accordion aceita reversão rápida sem travar');
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('.hero-bottom a').click(); await page.waitForTimeout(1600);
  check(await page.evaluate(() => document.activeElement.id === 'atuacao'), 'Âncora preserva foco');
  check(await page.locator('#atuacao').evaluate(el => el.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom - 1), 'Âncora considera o header');
  check(await page.locator('.site-header').evaluate(el => el.classList.contains('is-scrolled')), 'Header reage à rolagem');
  await page.locator('.practice-card .text-link').first().click();
  await page.waitForURL('**/areas/familia-sucessoes.html');
  check(await page.locator('h1').isVisible(), 'Link de área abre página interna');
  await page.locator('.accordion-trigger').first().click(); await page.waitForTimeout(350);
  check(await page.locator('.accordion-panel').first().isVisible(), 'Accordion funciona na página interna');
  await page.locator('.contact-aside .button').click(); await page.waitForURL('**/contato.html');
  check(await page.locator('#contact-form button').isDisabled(), 'Contato preserva envio indisponível sem endpoint');
  check(await page.locator('a[href^="tel:"], a[href^="mailto:"], a[href*="wa.me"]').count() === 0, 'Nenhum contato fictício adicionado');

  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const rp = await reduced.newPage(); await rp.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  check(await rp.evaluate(() => !document.documentElement.classList.contains('lenis') && [...document.querySelectorAll('[data-reveal], .line-content, .about-copy, .steps li, .service-content, .final-contact-grid > div')].every(el => getComputedStyle(el).opacity === '1' && getComputedStyle(el).transform === 'none')), 'Movimento reduzido: conteúdo visível, sem transform ou Lenis');
  await rp.locator('.accordion-trigger').first().click();
  check(await rp.locator('.accordion-panel').first().isVisible(), 'Accordion imediato com movimento reduzido');
  await reduced.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const np = await nojs.newPage(); await np.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  check(await np.locator('.accordion-panel').first().isVisible(), 'Respostas presentes e visíveis sem JS');
  check(await np.locator('.nojs-nav').isVisible() && await np.locator('h1').isVisible(), 'Navegação e título disponíveis sem JS');
  await nojs.close();
} catch (error) { report.errors.push(error.message); }
finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
  report.errors = [...new Set(report.errors)];
  await writeFile('artifacts/editorial-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
if (report.errors.length) process.exitCode = 1;
