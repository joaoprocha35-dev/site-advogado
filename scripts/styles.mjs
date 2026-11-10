import { compile } from 'sass';
import { copyFileSync, mkdirSync, writeFileSync, watch } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(import.meta.dirname, '..');
export function buildStyles() {
  const fonts = [
    ['inter', 'Inter', 400, 'normal'],
    ['inter', 'Inter', 500, 'normal'],
    ['cormorant-garamond', 'Cormorant Garamond', 400, 'italic'],
    ['cormorant-garamond', 'Cormorant Garamond', 500, 'normal'],
  ];
  mkdirSync(resolve(root, 'public/assets/css'), { recursive: true });
  mkdirSync(resolve(root, 'public/assets/fonts'), { recursive: true });
  const faces = fonts.map(([pkg, family, weight, style]) => {
    const file = `${pkg}-latin-${weight}-${style}.woff2`;
    copyFileSync(resolve(root, `node_modules/@fontsource/${pkg}/files/${file}`), resolve(root, `public/assets/fonts/${file}`));
    return `@font-face { font-family: '${family}'; font-style: ${style}; font-weight: ${weight}; font-display: swap; src: url('../fonts/${file}') format('woff2'); }`;
  }).join('\n');
  const { css } = compile(resolve(root, 'src/scss/main.scss'), { style: 'expanded' });
  writeFileSync(resolve(root, 'public/assets/css/main.css'), `/* Gerado de src/scss/main.scss por npm run styles. */\n${faces}\n${css}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildStyles();
  console.log('SCSS compilado em public/assets/css/main.css; fontes locais preparadas.');
  if (process.argv.includes('--watch')) {
    let timer;
    watch(resolve(root, 'src/scss'), { recursive: true }, (_event, file) => {
      if (!file?.endsWith('.scss')) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        try { buildStyles(); console.log('CSS atualizado.'); }
        catch (error) { console.error(error.message); }
      }, 100);
    });
    console.log('Observando alterações em src/scss/.');
  }
}
