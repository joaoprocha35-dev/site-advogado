import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { buildStyles } from './scripts/styles.mjs';

export default defineConfig({
  base: './',
  plugins: [{
    name: 'static-styles',
    // Os HTMLs também funcionam em Live Server; Vite serve public/ na raiz.
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(/(?:\.\.\/)*public\/assets\//g, '/assets/');
      },
    },
    configureServer(server) {
      server.watcher.add(resolve(import.meta.dirname, 'src/scss'));
      server.watcher.on('change', file => {
        if (file.endsWith('.scss')) {
          try { buildStyles(); } catch (error) { server.config.logger.error(error.message); }
        }
      });
    },
  }],
  build: {
    rollupOptions: {
      input: Object.fromEntries([
        'index', 'sobre', 'areas', 'contato', 'privacidade', '404',
        'areas/familia-sucessoes', 'areas/civil', 'areas/imobiliario',
      ].map(page => [page, resolve(import.meta.dirname, `${page}.html`)])),
    },
  },
});
