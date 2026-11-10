import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true });
await mkdir('artifacts', { recursive:true });
const report = { round:1, widths:[], pages:[], interactions:[], errors:[] };
const context = await browser.newContext();
context.on('page', page => {
  page.on('pageerror', error => report.errors.push(`JS: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(`Console: ${message.text()}`); });
  page.on('requestfailed', request => report.errors.push(`Request: ${request.url()} ${request.failure()?.errorText}`));
});
const page = await context.newPage();
const check = (value, message) => { if (!value) report.errors.push(message); else report.interactions.push(message); };
async function settle() { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1100); }
async function readLayout() {
  return page.evaluate(() => ({
    width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
    horizontalOverflow:document.documentElement.scrollWidth > innerWidth + 1,
    brokenImages:[...document.images].filter(i=>!i.complete || !i.naturalWidth).map(i=>i.src),
    outside:[...document.querySelectorAll('main *')].filter(el=>{
      const r=el.getBoundingClientRect(); const s=getComputedStyle(el);
      return s.display!=='none' && r.width>0 && (r.right>innerWidth+1 || r.left < -1);
    }).map(el=>`${el.tagName}.${el.className}`).slice(0,10),
  }));
}
async function revealPage() {
  await page.evaluate(async () => {
    for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight*.7) {
      window.scrollTo(0,y); await new Promise(r=>setTimeout(r,75));
    }
  });
  await page.waitForTimeout(1000);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(200);
}
try {
  for (const width of [1440,1024,768,390,360]) {
    await page.setViewportSize({width,height:900});
    await page.goto(origin, {waitUntil:'networkidle'});
    await settle(); await revealPage();
    const layout = await readLayout();
    report.widths.push(layout);
    if (layout.horizontalOverflow || layout.brokenImages.length || layout.outside.length) report.errors.push(`Layout inicial ${width}px: ${JSON.stringify(layout)}`);
    await page.screenshot({path:`artifacts/round1-home-${width}.png`,fullPage:width===1440 || width===390});
  }
  // Accordion nativo, via teclado.
  const firstSummary = page.locator('.accordion summary').first();
  await firstSummary.focus(); await page.keyboard.press('Enter');
  check(await page.locator('.accordion details').first().getAttribute('open') !== null,'Accordion abre por Enter');
  await page.keyboard.press('Enter');
  check(await page.locator('.accordion details').first().getAttribute('open') === null,'Accordion fecha por Enter');

  await page.evaluate(()=>window.scrollTo(0,0));
  await page.locator('.menu-toggle').click();
  check(await page.locator('#mobile-menu').evaluate(el=>el.open),'Menu abre');
  check(await page.locator('.menu-toggle').getAttribute('aria-expanded')==='true','Menu atualiza aria-expanded');
  check(await page.evaluate(()=>document.body.style.overflow==='hidden'),'Menu bloqueia rolagem de fundo');
  for(let i=0;i<9;i++) {
    await page.keyboard.press('Tab');
    check(await page.evaluate(()=>Boolean(document.activeElement.closest('#mobile-menu'))),'Foco contido no menu modal');
  }
  await page.keyboard.press('Escape');
  check(await page.locator('#mobile-menu').evaluate(el=>!el.open),'Escape fecha o menu');
  check(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement),'Foco retorna ao botão');
  check(await page.evaluate(()=>document.body.style.overflow!== 'hidden'),'Rolagem restaurada');
  await page.locator('.menu-toggle').click();
  await page.locator('#mobile-menu nav a').filter({hasText:'Contato'}).click();
  await page.waitForURL('**/contato.html');
  check(await page.locator('#mobile-menu').evaluate(el=>!el.open),'Link do menu navega e fecha');
  check(await page.locator('#contact-form button').isDisabled(),'Formulário sem endpoint fica desativado');
  check(await page.locator('#form-availability').innerText().then(t=>t.includes('indisponível')),'Indisponibilidade do envio é explícita');
  check(await page.locator('a[href^="tel:"],a[href^="mailto:"],a[href*="wa.me"]').count()===0,'Nenhum canal fictício gerado');

  await page.setViewportSize({width:1440,height:1000});
  for(const file of ['index.html','sobre.html','areas.html','contato.html','privacidade.html','404.html','areas/familia-sucessoes.html','areas/civil.html','areas/imobiliario.html']) {
    const response = await page.goto(`${origin}/${file}`,{waitUntil:'networkidle'});
    await settle();
    await page.locator('img[loading="lazy"]').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
    await page.waitForTimeout(150);
    const layout = await readLayout();
    report.pages.push({file,status:response.status(),...layout});
    if(response.status()!==200 || layout.brokenImages.length || layout.horizontalOverflow) report.errors.push(`Página ${file}: ${JSON.stringify(layout)}`);
  }
  await page.goto(`${origin}/areas/familia-sucessoes.html`,{waitUntil:'networkidle'});
  await settle(); await revealPage();
  await page.screenshot({path:'artifacts/round1-area-desktop.png',fullPage:true});
  check(await page.locator('.contact-aside > div').evaluate(el=>getComputedStyle(el).position==='sticky'),'Contato lateral sticky no desktop');
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(350);
  await page.screenshot({path:'artifacts/round1-area-mobile.png',fullPage:true});
  check(await page.locator('.contact-aside > div').evaluate(el=>getComputedStyle(el).position!=='sticky'),'Contato lateral entra no fluxo mobile');
  const areaMobile = await readLayout();
  if(areaMobile.horizontalOverflow) report.errors.push('Overflow na área mobile');
  await page.locator('.related-links a').first().click();
  check(page.url().endsWith('/areas/civil.html'),'Navegação entre áreas');

  const reduced = await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:900}});
  const rp = await reduced.newPage();
  await rp.goto(origin,{waitUntil:'networkidle'}); await rp.waitForTimeout(350);
  check(await rp.evaluate(()=>!document.documentElement.classList.contains('lenis') && [...document.querySelectorAll('[data-reveal]')].every(el=>getComputedStyle(el).opacity==='1')),'Movimento reduzido desativa Lenis e exibe conteúdo imediatamente');
  await reduced.close();

  const nojs = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const np = await nojs.newPage();
  await np.goto(origin,{waitUntil:'networkidle'});
  check(await np.locator('h1').isVisible(),'Título legível sem JavaScript');
  check(await np.locator('.nojs-nav').isVisible(),'Navegação mobile disponível sem JavaScript');
  await np.locator('.accordion summary').first().click();
  check(await np.locator('.accordion details').first().getAttribute('open')!==null,'Accordion funciona sem JavaScript');
  check(await np.locator('body').evaluate(el=>getComputedStyle(el).fontFamily.includes('Inter')),'CSS compilado carregado sem JavaScript');
  await nojs.close();
} finally {
  report.errors = [...new Set(report.errors)];
  await writeFile('artifacts/round1-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();
}
if(report.errors.length) process.exitCode=1;
