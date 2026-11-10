import { site, contactLinks } from '../../src/js/config/site.js';
import { esc, icon, button, finalContact, veil } from './components.mjs';

export function layout({title, description, active = '', path = '', file = '', content, home = false}) {
  const nav = [['index.html','Início','home'],['sobre.html','Sobre','about'],['areas.html','Áreas de atuação','areas'],['contato.html','Contato','contact']];
  const navLinks = nav.map(([href, label, key]) => `<a href="${path}${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const brand = `<a class="brand" href="${path}index.html" aria-label="${esc(site.name)} — início">${icon('mark')}<span>${esc(site.name)}<small>ADVOCACIA & CONSULTORIA</small></span></a>`;
  const validDomain = /^https:\/\/[^/\s]+\/?$/.test(site.domain) && !site.demo;
  const canonical = validDomain ? `${site.domain.replace(/\/$/,'')}/${file}` : '';
  const channels = contactLinks();
  const footerChannels = [channels.phone ? `<a href="${esc(channels.phone)}">${esc(site.phone)}</a>` : '', channels.email ? `<a href="${esc(channels.email)}">${esc(site.email)}</a>` : '', `<a href="${path}contato.html">Informações de contato ${icon('diagonal')}</a>`].filter(Boolean).join('');
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | ${esc(site.name)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${site.demo ? 'noindex, nofollow' : 'index, follow'}">
  <meta name="theme-color" content="#122720">
  ${canonical ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website">` : ''}
  <script>(function(){var d=document.documentElement,c=d.classList,s='veil-load';c.add('js');try{if(sessionStorage.getItem('veil')){s='veil-enter';sessionStorage.removeItem('veil')}}catch(e){}c.add(s);setTimeout(function(){if(!c.contains('veil-ok'))c.remove('veil-load','veil-enter')},5000)})()</script>
  <link rel="icon" type="image/svg+xml" href="${path}public/assets/icons/favicon.svg">
  <link rel="stylesheet" href="${path}public/assets/css/main.css">
  <script type="module" src="${path}src/js/main.js"></script>
</head>
<body class="${home ? 'page-home' : 'page-inner'}${active === 'about' ? ' page-about' : ''}">
  ${veil()}
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  ${site.demo ? '<div class="demo-notice">Versão demonstrativa <span>· Dados e conteúdo sujeitos à revisão do escritório</span></div>' : ''}
  <header class="site-header"><div class="container header-inner">${brand}<nav class="desktop-nav" aria-label="Navegação principal">${navLinks}</nav>${button('Entre em contato','contato.html','button-outline header-cta',path)}<button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-menu" hidden><span></span><span></span></button><noscript><nav class="nojs-nav" aria-label="Navegação">${navLinks}</nav></noscript></div></header>
  <dialog class="mobile-menu" id="mobile-menu" aria-label="Menu de navegação" data-lenis-prevent><div class="menu-top"><span>NAVEGAÇÃO</span><button class="menu-close" aria-label="Fechar menu">×</button></div><nav aria-label="Navegação mobile">${navLinks}</nav><p>Clareza para compreender.<br>Atenção para orientar.</p>${button('Entre em contato','contato.html','button-gold',path)}</dialog>
  <main id="conteudo" tabindex="-1">${content}</main>
  ${home ? `<div class="home-ending">${finalContact('', true)}` : ''}
  <footer class="site-footer"><div class="container"><div class="footer-grid"><div>${brand}<p class="footer-professional">${esc(site.lawyer)}<br>${esc(site.oab)}</p></div><nav aria-label="Navegação do rodapé">${navLinks}</nav><div><div class="footer-location">${icon('location')}<span>${esc(site.city)}<small>${site.demo ? 'Informações de atendimento a confirmar.' : esc(site.hours || '')}</small></span></div><div class="footer-channels">${footerChannels}</div></div></div><div class="footer-bottom"><p>© <span data-year>${new Date().getFullYear()}</span> ${esc(site.name)}. Conteúdo informativo.</p><a href="${path}privacidade.html">Política de privacidade ${icon('diagonal')}</a></div></div></footer>
  ${home ? '</div>' : ''}
</body>
</html>`;
}
