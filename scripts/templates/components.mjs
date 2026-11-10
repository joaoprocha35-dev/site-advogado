import { site, contactLinks } from '../../src/js/config/site.js';
import { areas, faqs, steps } from './data.mjs';

export const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  diagonal: '<path d="M6 18 18 6M6 6h12v12"/>',
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5v2"/>',
  document: '<path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8m-8 4h6"/>',
  home: '<path d="m2 11 10-8 10 8M5 9v12h14V9M9 21v-7h6v7"/>',
  location: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  phone: '<path d="m5 3 4 1 1 5-3 2a14 14 0 0 0 6 6l2-3 5 1 1 4c-1 5-9 1-13-3S0 4 5 3Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  mark: '<path d="M5 22V10a7 7 0 0 1 14 0v12M9 22V10a3 3 0 0 1 6 0v12M2 22h20"/>',
};
export const icon = (name, cls = '') => `<svg class="icon ${cls}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
export const button = (text, href = 'contato.html', cls = '', path = '') => `<a class="button ${cls}" href="${path}${href}">${text}${icon('arrow')}</a>`;
export const eyebrow = text => `<p class="eyebrow">${text}</p>`;
export const arch = (cls = '') => `<svg class="decorative-arch ${cls}" viewBox="0 0 402 582" fill="none" aria-hidden="true"><path data-draw d="M1 581V201C1 90.5 90.5 1 201 1s200 89.5 200 200v380" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
export const doubleArch = (cls = '') => `<svg class="decorative-arch ${cls}" viewBox="0 0 402 582" fill="none" aria-hidden="true"><path data-draw d="M1 581V201C1 90.5 90.5 1 201 1s200 89.5 200 200v380" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/><path data-draw d="M81 581V201c0-66.3 53.7-120 120-120s120 53.7 120 120v380" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
// Cortina em arco usada no carregamento e na transição entre páginas (ver src/js/modules/veil.js).
export const veil = () => `<div class="veil" aria-hidden="true"><div class="veil-panel"></div><div class="veil-content"><svg class="veil-mark" viewBox="1 2 22 21" fill="none" stroke="currentColor" stroke-width=".45" stroke-linecap="round" stroke-linejoin="round"><path pathLength="1" d="M5 22V10a7 7 0 0 1 14 0v12"/><path pathLength="1" d="M9 22V10a3 3 0 0 1 6 0v12"/><path pathLength="1" d="M2 22h20"/></svg><p class="veil-name"><span>${esc(site.lawyer)}</span></p><span class="veil-rule"></span><p class="veil-tag">Advocacia &amp; Consultoria</p></div></div>`;
export const lines = content => content.map(line => `<span class="line-mask"><span class="line-content">${line}</span></span>`).join(' ');
export function breadcrumb(name, path = '', parent) {
  return `<nav class="breadcrumb" aria-label="Você está em"><ol><li><a href="${path}index.html">Início</a></li>${parent ? `<li><a href="${path}areas.html">Áreas de atuação</a></li>` : ''}<li aria-current="page">${name}</li></ol></nav>`;
}
export function areaCards(path = '', home = false) {
  return `<div class="practice-grid">${areas.map(a => `<div data-reveal><article class="practice-card"><span class="card-niche">${icon(a.icon)}</span><h3><a href="${path}areas/${a.slug}.html">${home ? a.short : a.name}</a></h3><p>${a.description}</p><a class="text-link" href="${path}areas/${a.slug}.html">Conheça a atuação ${icon('diagonal')}</a></article></div>`).join('')}</div>`;
}
let accordionId = 0;
export const accordion = (items = faqs) => {
  const group = ++accordionId;
  return `<div class="accordion">${items.map(([q,a],i) => `<article class="accordion-item"><h3><button type="button" class="accordion-trigger" id="faq-${group}-${i}" aria-expanded="true" aria-controls="answer-${group}-${i}">${q}<span class="plus" aria-hidden="true"></span></button></h3><div class="accordion-panel" id="answer-${group}-${i}" role="region" aria-labelledby="faq-${group}-${i}"><div class="answer"><p>${a}</p></div></div></article>`).join('')}</div>`;
};
export const process = () => `<div class="process-track"><span class="steps-line" aria-hidden="true"></span><ol class="steps">${steps.map(([title, text],i) => `<li><span class="step-number">0${i+1}</span><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol></div>`;
export function serviceInfo() {
  const items = [ ['home','Modalidade',site.serviceMode || '[MODALIDADE A CONFIRMAR]'], ['location','Cidade e região',site.region || site.city], ['clock','Horários',site.hours || '[HORÁRIOS A CONFIRMAR]'], ['mail','Canais de contato','Consulte as informações de contato'] ];
  return `<dl class="service-info">${items.map(([i,t,v]) => `<div>${icon(i)}<dt>${t}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
}
export function contactChannels() {
  const links = contactLinks();
  const rows = [ ['phone','Telefone',site.phone || '[TELEFONE]',links.phone], ['mail','E-mail',site.email || '[E-MAIL]',links.email], ['location','Endereço',site.address || '[ENDEREÇO]',''] ];
  return `<dl class="contact-channels">${rows.map(([i,t,v,href]) => `<div>${icon(i)}<dt>${t}</dt><dd>${href ? `<a href="${esc(href)}">${esc(v)}</a>` : esc(v)}</dd></div>`).join('')}${links.whatsapp ? `<div>${icon('phone')}<dt>WhatsApp</dt><dd><a href="${esc(links.whatsapp)}" target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp ${icon('diagonal')}</a></dd></div>` : ''}</dl>`;
}
export function finalContact(path = '', home = false, about = false) {
  const channels = contactLinks();
  const contactDetails = [channels.phone ? `<a href="${esc(channels.phone)}">${esc(site.phone)}</a>` : '', channels.email ? `<a href="${esc(channels.email)}">${esc(site.email)}</a>` : '', site.address ? `<span>${esc(site.address)}</span>` : ''].filter(Boolean).join('');
  return `<section class="final-contact section"><div class="container final-contact-grid"><div>${eyebrow('O PRÓXIMO PASSO')}<h2>${home ? 'Vamos conversar<br>sobre o <em>seu momento?</em>' : about ? 'O próximo passo começa<br>com uma <em>conversa.</em>' : 'Converse com<br>o escritório<span class="gold">.</span>'}</h2></div><div>${home ? '' : '<p>Um espaço para ouvir seu contexto e organizar o primeiro atendimento.</p>'}${button('Entre em contato', 'contato.html', home ? 'button-gold' : 'button-dark', path)}${contactDetails ? `<div class="final-channels">${contactDetails}</div>` : ''}${site.demo ? '<p class="small muted contact-note">Canais de contato em configuração nesta demonstração.</p>' : ''}</div>${home || about ? '' : arch('final-arch')}</div></section>`;
}
