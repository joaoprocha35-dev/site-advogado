import { mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { site } from '../src/js/config/site.js';
import { layout } from './templates/layout.mjs';
import { areas } from './templates/data.mjs';
import { homePage, aboutPage, areasPage, areaPage, contactPage, privacyPage, notFoundPage } from './templates/pages.mjs';

const pages = [
  ['index.html','Orientação jurídica com clareza','Conheça o escritório, as áreas de atuação e as informações para organizar seu primeiro atendimento.','home',homePage],
  ['sobre.html','Sobre o escritório','Conheça a apresentação do escritório, o profissional responsável e a forma de atendimento.','about',aboutPage],
  ['areas.html','Áreas de atuação','Informações sobre Família e Sucessões, Direito Civil e Direito Imobiliário.','areas',areasPage],
  ['contato.html','Contato','Consulte os canais, os horários e as modalidades de atendimento do escritório.','contact',contactPage],
  ['privacidade.html','Política de privacidade','Informações sobre os dados de contato, serviços utilizados e pontos pendentes de revisão.','',privacyPage],
  ['404.html','Página não encontrada','Encontre a página inicial e os caminhos para continuar navegando pelo escritório.','',notFoundPage],
  ...areas.map(area => [`areas/${area.slug}.html`,area.name,area.description,'areas',()=>areaPage(area)]),
];
for (const [file,title,description,active,render] of pages) {
  const path = file.includes('/') ? '../' : '';
  await mkdir(resolve(file,'..'), { recursive:true });
  await writeFile(file, layout({file,title,description,active,path,content:render(),home:file==='index.html'}));
}
if (!site.demo && /^https:\/\/[^/\s]+\/?$/.test(site.domain)) {
  const domain = site.domain.replace(/\/$/,'');
  await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter(p=>p[0]!=='404.html').map(p=>`<url><loc>${domain}/${p[0]}</loc></url>`).join('')}</urlset>`);
  await writeFile('public/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`);
} else {
  await rm('public/sitemap.xml',{force:true});
  await writeFile('public/robots.txt','User-agent: *\nDisallow: /\n');
}
console.log(`${pages.length} páginas HTML geradas a partir dos templates e da configuração central.`);
