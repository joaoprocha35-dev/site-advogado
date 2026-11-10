# Site institucional de advocacia

Implementação local, estática e multipágina em HTML semântico, SCSS modular e JavaScript ES, com Vite, GSAP/ScrollTrigger e Lenis. O site não foi publicado.

## Executar

Requer Node.js 20.19+ ou 22.12+ (validado neste ambiente com Node 24).

```sh
npm ci
npm run dev
```

O terminal informa a URL local. Para gerar e visualizar a versão de produção:

```sh
npm run build
npm run preview
```

O HTML referencia diretamente `public/assets/css/main.css`, compilado do SCSS, e pode ser visualizado também pelo Live Server. Fontes e imagens usam caminhos válidos nesse modo. Para editar o SCSS com Live Server, mantenha `npm run styles:watch` em execução; para compilar apenas uma vez, use `npm run styles`. Não edite o CSS gerado. Com `npm run dev`, a recompilação do SCSS já é automática. Utilize o Vite para carregar também GSAP e Lenis; o Live Server mantém a apresentação e as interações nativas, mas não resolve as dependências de animação.

O build gera `dist/`, incluindo as nove páginas, imagens, ícone, fontes locais e CSS compilado. `npm run check` apenas verifica o build existente, sem recompilar. A verificação estática também é executada automaticamente ao final do build.

## Páginas

- `index.html`: apresentação, áreas, escritório, etapas, atendimento, FAQ e contato.
- `sobre.html`: apresentação editorial, identificação, trajetória, formação e atendimento.
- `areas.html`: visão geral das áreas.
- `areas/familia-sucessoes.html`, `areas/civil.html`, `areas/imobiliario.html`: situações, organização do atendimento, informações iniciais, FAQ, áreas relacionadas e contato.
- `contato.html`: informações e formulário demonstrativo.
- `privacidade.html`: minuta para revisão e complementação.
- `404.html`: recuperação de navegação.

## Conteúdo compartilhado e configuração

Edite `src/js/config/site.js` para nome do escritório, profissional, OAB, cidade, telefone, e-mail, WhatsApp, endereço, horários, modalidade, região, biografia, formação e trajetória. Os campos ausentes permanecem como placeholders explícitos; não existem contatos, credenciais, depoimentos ou resultados fictícios.

O HTML completo é gerado ANTES de o Vite servir ou compilar: `scripts/render.mjs` combina os templates de `scripts/templates/` com essa configuração. Textos, links, navegação e FAQ estão presentes no HTML entregue, sem depender de renderização JavaScript no navegador. Os arquivos HTML na raiz e em `areas/` são gerados: altere os templates, não essas cópias. Após editar a configuração ou templates, reinicie `npm run dev`, execute `node scripts/render.mjs` ou gere o build.

Os textos específicos das áreas e perguntas estão em `scripts/templates/data.mjs`; as seções, em `pages.mjs`; cabeçalho, rodapé e metadados, em `layout.mjs`. A estrutura para futuros artigos está em `src/content/articles/`, sem seção pública vazia.

## Identidade e imagens

- Cores e famílias tipográficas: `src/scss/abstracts/_variables.scss`.
- Escalas de texto: `src/scss/base/_typography.scss`.
- Layout responsivo, seções e componentes: arquivos de responsabilidade específica em `src/scss/`.
- Fontes Inter 400/500 e Cormorant Garamond 500/400 itálico: copiadas dos pacotes Fontsource para `public/assets/fonts/` por `npm run styles`, servidas localmente com `font-display: swap`. Não há requisição ao Google Fonts.
- Ícones SVG: função central em `scripts/templates/components.mjs`; favicon em `public/assets/icons/favicon.svg`.

As fotografias fornecidas foram preservadas e organizadas, sem hotlink:

| Arquivo original | Novo caminho |
| --- | --- |
| `hero-advogado.jpg` | `public/assets/images/advogado-mesa.jpg` |
| `foto01.jpg` | `public/assets/images/advogado-escritorio.jpg` |
| `foto02.jpg` | `public/assets/images/advogado-atendimento.jpg` |
| `foto03.jpg` | `public/assets/images/advogado-retrato.jpg` |

As quatro fotografias usadas têm dimensões explícitas e as imagens fora da hero usam lazy loading. `advogado-atendimento.jpg` aparece na composição sobreposta da seção Sobre. Os JPEGs originais têm aproximadamente 85–98 KB; foram mantidos para preservar o material fornecido. Substitua-os pelos mesmos nomes ou atualize o helper de imagens em `pages.mjs`. Confirme a autorização de uso e a identidade do profissional antes da publicação.

## Interações e acessibilidade

Menu mobile em `dialog` nativo: abertura suave, contenção de foco, Escape, fechamento por link, retorno de foco, `aria-expanded` e bloqueio temporário da rolagem de fundo. FAQ usa botões semânticos, `aria-expanded`, `aria-controls` e animação de altura de 300 ms. As respostas permanecem no HTML, expandidas sem JavaScript. Navegação sem JS permanece disponível. Há link para pular conteúdo, breadcrumbs, foco visível, labels e mensagens de erro associadas aos campos.

GSAP/ScrollTrigger animam a hero em 1,75 s, linhas de título com máscaras, desenho dos arcos SVG, cards com stagger de 0,12 s, foto do escritório com clip-path e moldura, faixa institucional, linha das etapas, foto de atendimento com zoom discreto, CTA e rodapé. O parallax da fotografia limita-se a 20 px e existe apenas a partir de 1000 px, sem preferência por movimento reduzido. As entradas acontecem uma vez e os wrappers animados são separados dos cards com hover. A linha das etapas cresce horizontalmente no desktop e verticalmente nas telas menores.

Lenis usa uma instância e o ticker do GSAP como único loop, apenas para ponteiro preciso sem preferência por movimento reduzido. Touch mantém rolagem natural. Mudanças em `prefers-reduced-motion` revertem as animações e destroem o scroll suave. Se as bibliotecas falharem, o conteúdo e a rolagem nativa permanecem disponíveis. A navegação é inicializada antes das bibliotecas de movimento. As âncoras consideram a altura efetiva do cabeçalho.

## Ativar contatos e formulário

Links `tel:`, `mailto:` e WhatsApp só são gerados após validação básica dos dados configurados. O número do WhatsApp deve conter DDI + DDD + telefone, sem zero de operadora. Todos os CTAs levam à página real de contato. Nenhum canal alternativo é inventado quando os campos estão vazios.

O formulário está com envio explicitamente indisponível e botão desabilitado porque **não existe endpoint**. Ele não simula sucesso, nem grava mensagens em localStorage, analytics ou logs.

Para ativar:

1. Providencie um endpoint HTTPS público que receba POST JSON com `name`, `reply`, `subject` e `message`. Configure CORS para a origem real e proteções de abuso no servidor. O servidor precisa validar os dados e confirmar aceitação com HTTP 2xx; erros devem retornar 4xx/5xx.
2. Preencha `formEndpoint` em `site.js`. Não insira tokens secretos no código público.
3. Revise a finalidade, base legal, fornecedor, retenção e canal de privacidade, atualizando `privacyServices`, `privacyRetention` e o template da política.
4. Gere o build e teste envio real, erro, retorno e condições de armazenamento do fornecedor.

A integração preparada valida campos, informa carregamento/sucesso/erro, impede envios concorrentes, aplica timeout de 15 s e preserva o conteúdo em caso de erro. Uma resposta de aceitação real é necessária para mostrar sucesso. Nenhum teste de entrega real de mensagem foi possível sem o serviço configurado.

## Pendências para publicação

- [ ] Nome do escritório e do profissional, OAB e cidade/UF.
- [ ] Telefone, e-mail, WhatsApp (opcional), endereço, horários, modalidade e região.
- [ ] Biografia, trajetória e formação verificadas pelo profissional.
- [ ] Confirmação das três áreas provisórias e revisão de todos os textos pelo advogado, incluindo publicidade profissional. Esta entrega não declara aprovação jurídica.
- [ ] Confirmação de identidade e autorização das fotografias fornecidas.
- [ ] Serviço real de formulário e seu teste de entrega, caso o formulário seja ativado.
- [ ] Política revisada: responsável, finalidade/base legal, fornecedores, retenção, procedimentos, canal e data de revisão.
- [ ] Domínio HTTPS e provedor de hospedagem reais.
- [ ] Configuração e teste da página 404 no provedor.

Enquanto houver dados de demonstração, mantenha `demo: true`: todas as páginas recebem `noindex, nofollow`, e o robots bloqueia rastreamento. Só após a revisão completa mude para `demo: false` e configure `domain` com a origem HTTPS real. Isso libera os metadados de indexação, canonical e Open Graph com URL real e gera `sitemap.xml` e robots. Sem domínio configurado, canonical, OG e sitemap não são inventados. Dados estruturados não foram adicionados por dependerem de dados reais.

Para hospedagem estática, envie o conteúdo de `dist/`. Preserve `areas/` e `assets/`. Se o provedor servir o conteúdo de `404.html` em URLs arbitrárias sem redirecionamento, use o caminho base correto para assets e links nessa página ou configure redirecionamento para `/404.html`; a URL direta `404.html` está incluída no build. Não há publicação automática.

## Validação

`scripts/check-build.mjs` verifica as nove páginas do build, links internos, assets, âncoras, idioma, descrições, H1 único, IDs duplicados e ausência de folha SCSS no HTML publicado. Os resultados de execução e a inspeção de navegador desta entrega são registrados em `VALIDACAO.md`.

Para a inspeção local foi usado Playwright com o Google Chrome já instalado. A verificação atual está em `scripts/qa-editorial.mjs`, executada uma única vez após a implementação do layout editorial. Não instala navegador nem publica o site. Os scripts `qa-round1.mjs` e `qa-round2.mjs` são registros da versão anterior e usam seletores antigos. Os screenshots ficam em `artifacts/` (não versionados).
