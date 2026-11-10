import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page = await browser.newPage({viewport:{width:390,height:844}});
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:4173';
const report = {round:2,checks:[],errors:[]};
page.on('pageerror',error=>report.errors.push(error.message));
page.on('console',message=>{if(message.type()==='error') report.errors.push(message.text());});
const check = (value,message) => { report.checks.push({message,passed:!!value}); if(!value) report.errors.push(message); };
try {
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.locator('.menu-toggle').click();
  for(let i=0;i<14;i++) {
    await page.keyboard.press('Tab');
    check(await page.evaluate(()=>!!document.activeElement.closest('#mobile-menu')),`Contenção de foco — Tab ${i+1}`);
  }
  for(let i=0;i<8;i++) {
    await page.keyboard.press('Shift+Tab');
    check(await page.evaluate(()=>!!document.activeElement.closest('#mobile-menu')),`Contenção de foco — Shift+Tab ${i+1}`);
  }
  await page.keyboard.press('Escape');
  check(await page.locator('#mobile-menu').evaluate(el=>!el.open),'Escape fecha o menu');
  check(await page.evaluate(()=>document.body.style.overflow!=='hidden'),'Overflow do body restaurado imediatamente');
  check(await page.locator('.menu-toggle').getAttribute('aria-expanded')==='false','aria-expanded restaurado');
  check(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement),'Foco retorna ao botão');
  await page.mouse.wheel(0,500); await page.waitForTimeout(1300);
  check(await page.evaluate(()=>scrollY>100),'Rolagem efetiva funciona após fechar o menu');
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.locator('.menu-toggle').click();
  await page.locator('.menu-close').click();
  check(await page.evaluate(()=>document.body.style.overflow!=='hidden'),'Botão fechar também restaura rolagem');
  await page.locator('.menu-toggle').click();
  await page.locator('#mobile-menu nav a').filter({hasText:'Contato'}).click();
  await page.waitForURL('**/contato.html');
  check(await page.locator('#mobile-menu').evaluate(el=>!el.open),'Navegação pelo menu segue funcionando');
  check(await page.locator('#contact-form button').isDisabled(),'Formulário real continua indisponível sem endpoint');

  // Apenas a validação/fluxo preparado, usando interceptação local. Nenhuma mensagem real.
  const formSource = await readFile('src/js/modules/contact-form.js','utf8');
  await page.route('**/__qa-contact', async route => {
    await new Promise(resolve=>setTimeout(resolve,250));
    await route.fulfill({status:200,contentType:'application/json',body:'{"accepted":true}'});
  });
  await page.evaluate(async ({source,endpoint})=>{
    const form=document.querySelector('#contact-form');
    form.dataset.endpoint=endpoint;
    form.querySelector('button').disabled=false;
    const module=await import(`data:text/javascript,${encodeURIComponent(source)}`);
    module.initContactForm();
  },{source:formSource,endpoint:`${origin}/__qa-contact`});
  await page.locator('#name').fill('Pessoa de teste');
  await page.locator('#reply').fill('--------');
  await page.locator('#subject').selectOption('civil');
  await page.locator('#message').fill('Mensagem sintética de verificação local.');
  await page.locator('#contact-form button').click();
  check(await page.locator('#reply').getAttribute('aria-invalid')==='true','Validação rejeita telefone sem dígitos');
  check(await page.locator('#reply-error').innerText().then(t=>t.includes('válido')),'Erro do canal de retorno é associado ao campo');
  await page.locator('#reply').fill('teste@example.invalid');
  await page.locator('#contact-form button').click();
  check(await page.locator('#contact-form button').isDisabled(),'Envio simulado impede cliques duplicados');
  await page.locator('.form-result').filter({hasText:'Mensagem enviada'}).waitFor();
  check(await page.locator('#message').inputValue()==='','Aceitação simulada limpa o formulário');

  await page.setViewportSize({width:1440,height:1000});
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.locator('.about-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  const img = page.locator('.about-visual img');
  check(await img.evaluate(el=>el.complete && el.naturalWidth>0),'Fotografia do escritório carregou');
  report.photo = await img.evaluate(el=>{
    const r=el.getBoundingClientRect();
    return {rect:{x:r.x,y:r.y,width:r.width,height:r.height},opacity:getComputedStyle(el).opacity,visibility:getComputedStyle(el).visibility,parentOpacity:getComputedStyle(el.parentElement).opacity,src:el.currentSrc};
  });
  await page.screenshot({path:'artifacts/round2-about-desktop.png'});
  check(await page.locator('.about-copy h2').innerText().then(t=>t.replace(/\s+/g,' ').trim()==='Conheça o escritório.'),'Título solicitado presente na seção Sobre');
  for(const width of [1440,360]) {
    await page.setViewportSize({width,height:900});
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Rodapé atualizado sem overflow em ${width}px`);
    check(await page.locator('.footer-channels a').getAttribute('href')==='contato.html',`Link de contato real no rodapé em ${width}px`);
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('.about-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  await page.screenshot({path:'artifacts/round2-about-mobile.png'});
} finally {
  await writeFile('artifacts/round2-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();
}
if(report.errors.length) process.exitCode=1;
