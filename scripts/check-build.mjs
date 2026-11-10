import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const files = ['index.html','sobre.html','areas.html','contato.html','privacidade.html','404.html','areas/familia-sucessoes.html','areas/civil.html','areas/imobiliario.html'];
const root = resolve('dist');
const errors = [];
let links = 0;
let assets = 0;
for (const file of files) {
  const full = resolve(root,file);
  let html;
  try { html = await readFile(full,'utf8'); } catch { errors.push(`Página ausente: ${file}`); continue; }
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`H1 inválido: ${file}`);
  if (!html.includes('lang="pt-BR"')) errors.push(`Idioma ausente: ${file}`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`Descrição ausente: ${file}`);
  if (/<link[^>]+href="[^"]+\.scss"/.test(html)) errors.push(`SCSS publicado: ${file}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  if (new Set(ids).size !== ids.length) errors.push(`IDs repetidos: ${file}`);
  for (const [,attr,url] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    if (!url || url === '#') { errors.push(`Link vazio: ${file}`); continue; }
    if (/^(https?:|tel:|mailto:|data:)/.test(url)) continue;
    const [pathname,hash] = url.split('#');
    const target = pathname ? resolve(dirname(full),pathname) : full;
    if (!target.startsWith(root + '/') && target !== root) { errors.push(`Caminho fora do build: ${url}`); continue; }
    try {
      await access(target);
      if (hash) {
        const destination = target === full ? html : await readFile(target,'utf8');
        if (!destination.includes(`id="${hash}"`)) errors.push(`Âncora ausente: ${file} → ${url}`);
      }
    } catch { errors.push(`Destino ausente: ${file} → ${url}`); }
    attr === 'href' && pathname.endsWith('.html') ? links++ : assets++;
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Verificação aprovada: ${files.length} páginas, ${links} links internos e ${assets} referências locais/âncoras. H1, metadados e IDs válidos.`);
