# Validação da entrega — 10/11/2026

## Backgrounds da página Sobre — atualização mais recente

- Quatro imagens inspecionadas antes da implementação, copiadas com os nomes originais para `public/images/sobre/`, mantendo os arquivos de `artifacts/` intactos.
- Aplicação exclusiva sob `.page-about`: hero, trajetória/formação, atendimento e chamada final. O CTA passa a mostrar “O próximo passo começa com uma conversa.” e não gera SVG decorativo adicional sobre o arco da imagem.
- Arquivos alterados: `src/scss/pages/_about.scss`, `scripts/templates/layout.mjs`, `scripts/templates/pages.mjs`, `scripts/templates/components.mjs`, `sobre.html` gerado e `public/assets/css/main.css` compilado, além das quatro cópias em `public/images/sobre/`.
- Nenhum JavaScript ou animação foi alterado. A classe exclusiva foi adicionada somente ao body de Sobre. Comparação por SHA-256 confirmou que a Início e os outros sete HTMLs permaneceram idênticos.
- Build aprovado; nove páginas, 250 links internos e 40 referências locais/âncoras válidas.
- Uma rodada de inspeção no Chrome em 1440, 390 e 768 px. Quatro backgrounds disponíveis por HTTP 200, links e menu funcionais, nenhuma rolagem horizontal e nenhum erro de console/execução registrado.
- Correção concreta feita em lote: no tablet, os textos do atendimento estavam sobre a fotografia. Até 999 px, a foto agora ocupa uma faixa acima do conteúdo em verde. O limite de largura dos textos da hero foi ajustado no tablet para preservar a região verde.
- Revalidação limitada ao tablet: faixa de 260 px acima dos textos, conteúdo sem fotografia atrás, sem overflow; enquadramento da hero e do atendimento conferidos nas capturas corrigidas. Sem nova inspeção completa ou refinamento estético.
- Relatório: `artifacts/sobre-backgrounds-report.json`. Capturas iniciais `sobre-backgrounds-*.png`, `sobre-atendimento-*.png`; capturas da correção `sobre-correcao-*.png`.

Os registros abaixo descrevem alterações anteriores.

## Redesign da Início com a referência fornecida — atualização mais recente

Aplicado em uma passagem, deixando refinamentos visuais para o usuário conforme solicitado. Referência `inspiracao-tela-inicio-designer.png` e os quatro assets foram abertos e examinados antes da edição. A imagem de referência não foi usada como fundo nem recortada para substituir componentes.

- Alterados: `scripts/templates/pages.mjs`, `components.mjs`, `layout.mjs`, `src/js/modules/animations.js`, `src/scss/main.scss`, novo `src/scss/pages/_home-redesign.scss`, HTMLs regenerados e CSS compilado.
- Fundos copiados, preservando os originais: `public/assets/images/inicio/hero-fundo.png`, `secao-cada-historia-merece.png`, `secao-perto-do-que-importa.png` e `Footer.png`.
- Retratos reutilizados: `public/assets/images/advogado-mesa.jpg` e `advogado-escritorio.jpg`.
- Todos os estilos novos estão sob `.page-home`. O conteúdo das oito páginas internas permaneceu igual; a regeneração introduziu somente linhas em branco adicionais nesses HTMLs.
- Build aprovado: nove páginas, 250 links internos e 40 referências locais/âncoras válidas; nenhum arquivo referenciado pelo CSS está ausente.
- Uma inspeção rápida no Chrome, em 1440 e 390 px: sem overflow ou imagens quebradas; menu, Escape, accordion por Enter e CTA para contato funcionaram; nenhum erro de console/execução registrado. Capturas completas em `artifacts/inicio-redesign-1440.png` e `inicio-redesign-390.png` foram examinadas. Não houve rodada de refinamentos estéticos.
- Arcos incorporados aos fundos não foram duplicados em SVG. O arco independente da hero foi preservado, com timeline total de aproximadamente 1,45 s.
- Não há asset separado da arquitetura decorativa do terceiro card; o card foi mantido sem extrair imagens da referência. Dados profissionais e contatos continuam com placeholders onde não foram fornecidos. Nenhuma informação de modalidade/localidade foi inventada.

As seções seguintes registram etapas anteriores.

## Atualização editorial e animações — última alteração

Implementação baseada nas referências anteriores e na descrição detalhada do pedido. Não foi recebida uma nova imagem neste envio, portanto a correspondência exata com essa imagem permanece sem confirmação.

Uma única rodada executada por `node scripts/qa-editorial.mjs`, com Google Chrome instalado e preview do build de produção. **35 verificações aprovadas, zero erros registrados.** Não houve correções posteriores que exigissem repetição dos testes, nem nova rodada de refinamento estético.

- Build aprovado: nove páginas, 252 links internos e 42 referências locais/âncoras válidas.
- Inicial verificada em 360, 390, 768, 1024 e 1440 px; sem overflow horizontal e com imagens carregadas.
- Capturas de desktop e celular examinadas: hero, escritório com sobreposição de fotos e página completa. As capturas longas registram o header sticky na posição de rolagem usada no teste; o enquadramento das capturas de viewport confirma o comportamento normal.
- Hero termina com título visível; cards e foto são revelados. Parallax presente no desktop e ausente no celular.
- Menu abre, mantém foco, fecha por Escape, devolve foco e restaura rolagem.
- Accordion responde a Enter/Espaço, atualiza `aria-expanded` e aceita reversão rápida da animação; verificado também em página interna.
- Âncora considera o header e transfere foco ao destino. Header reage à rolagem.
- Links para a área e para contato funcionam. Contato mantém o formulário explicitamente indisponível sem endpoint; nenhum contato fictício foi adicionado.
- Movimento reduzido remove transformações e Lenis, preserva visibilidade e mantém accordion imediato.
- Sem JavaScript, o título, a navegação alternativa e as respostas da FAQ permanecem visíveis.
- Nenhum erro de execução, console ou requisição falha foi registrado pelo script.

Arquivos alterados nesta atualização:

- Templates: `scripts/templates/pages.mjs`, `components.mjs`, `layout.mjs`.
- SCSS: `src/scss/abstracts/_variables.scss`, `base/_global.scss`, `layout/_header.scss`, `components/_buttons.scss`, `_cards.scss`, `_accordion.scss`, `main.scss` e o novo `pages/_editorial.scss`.
- JavaScript: `src/js/main.js` e os módulos `animations.js`, `navigation.js`, `accordion.js`, `smooth-scroll.js`.
- Assets: `public/assets/icons/favicon.svg` e `public/assets/css/main.css` recompilado.
- Nove HTMLs regenerados: `index.html`, `sobre.html`, `areas.html`, `contato.html`, `privacidade.html`, `404.html` e as três páginas em `areas/`.
- Verificação/documentação: novo `scripts/qa-editorial.mjs`, `README.md` e este relatório.

Configuração e fotografias existentes foram preservadas. Permanecem as pendências de dados reais, revisão profissional, privacidade, domínio/hospedagem e endpoint já documentadas abaixo. Não houve publicação. As animações GSAP/Lenis devem ser visualizadas pelo Vite (`npm run dev` ou `npm run preview` após build); o Live Server continua exibindo o CSS compilado e as interações básicas.

Os registros abaixo documentam as versões anteriores.

## Resultado

Implementação e build concluídos. Duas rodadas de inspeção no Google Chrome via Playwright, conforme o limite solicitado. Nenhuma falha crítica conhecida ao encerrar. Não houve publicação.

## Build e verificação estática

- `npm install`: dependências instaladas; lockfile gerado. A primeira tentativa encontrou restrição de rede, resolvida com a permissão de execução apropriada.
- `npm run build`: aprovado. Executado novamente somente após as correções que afetaram HTML, CSS e JavaScript.
- Resultado final do verificador: **9 páginas, 252 links internos e 40 referências locais/âncoras**, sem destinos ausentes, IDs duplicados, H1 inválido, metadados ausentes ou SCSS referenciado como folha publicada.
- Fontes locais com `font-display: swap`; quatro fotografias fornecidas organizadas e preservadas.

## Rodada 1

- Inicial inspecionada em **360, 390, 768, 1024 e 1440 px**. Sem rolagem horizontal ou elementos fora da largura da página.
- Todas as nove páginas retornaram HTTP 200 nas respectivas URLs de arquivo no preview. A página 404 foi verificada como arquivo direto; status de erro e fallback dependem da futura hospedagem.
- Assets e imagens carregaram, inclusive nas três páginas dentro de `areas/`.
- Inspeção visual da inicial em desktop/mobile e da página de Família e Sucessões em desktop/mobile. Conteúdo legível e sem sobreposições críticas observadas.
- Accordion abre e fecha por Enter. Funciona também sem JavaScript.
- Navegação mobile disponível sem JavaScript; título e CSS compilado continuam presentes.
- Movimento reduzido mantém conteúdo imediatamente visível e desativa Lenis.
- Bloco de contato lateral sticky no desktop e no fluxo normal no mobile.
- Navegação entre áreas e link de contato do menu funcionaram.
- Formulário sem endpoint desativado e indisponibilidade explícita. Nenhum `tel:`, `mailto:` ou WhatsApp fictício gerado.
- Sem erros de execução, console ou requisições falhas observados.

Lista consolidada de correções:

1. O ciclo do Tab podia alcançar o foco do navegador; adicionada contenção explícita em complemento ao dialog modal.
2. A restauração do overflow aguardava o evento assíncrono `close`; tornada imediata e idempotente, inclusive por Escape.
3. Revisão dos requisitos: contatos configuráveis adicionados ao rodapé e ao bloco final, e título “Conheça o escritório” ajustado como heading.
4. Validação de telefone corrigida para exigir dígitos, além dos caracteres de formatação.
5. Fotografia ausente em uma captura de página inteira, apesar de carregada: reservada confirmação visual no próprio viewport na segunda rodada.

## Rodada 2 — apenas correções e efeitos diretos

- Todos os 40 checks do script passaram; sem erros de console ou execução nessa rodada.
- 14 avanços com Tab e 8 retornos com Shift+Tab permaneceram dentro do menu.
- Escape e botão fechar restauram overflow; Escape devolve o foco ao botão e atualiza `aria-expanded`.
- Rolagem efetiva por roda do mouse confirmada após fechar o menu, incluindo a integração com Lenis.
- Navegação pelo link do menu permanece funcionando; formulário real segue desativado.
- Novo link do rodapé correto; sem overflow em 360 e 1440 px após a alteração compartilhada.
- Título da seção Sobre confirmado. Foto inspecionada no viewport em desktop e mobile, carregada e visível. Não foi necessário alterar a imagem nem refazer o layout.
- Validação do telefone verificada com valor inválido sem dígitos. Erro associado ao campo.
- Fluxo preparado de envio exercitado com interceptação HTTP **local simulada**: bloqueio de envio concorrente e limpeza após aceitação simulada. Nenhuma mensagem foi entregue a um serviço real.

Capturas e relatórios locais: `artifacts/round1-*.png`, `artifacts/round1-report.json`, `artifacts/round2-about-*.png` e `artifacts/round2-report.json`. Os artefatos não são versionados.

## Limites e pendências reais

- Faltam os dados e contatos reais, identificação profissional, biografia, trajetória, formação e informações de atendimento.
- As três áreas, os textos, a publicidade profissional e a política de privacidade precisam de revisão pelo advogado. Não foi declarada aprovação jurídica.
- Confirmar identidade e autorização das fotografias fornecidas.
- Não existe endpoint de formulário, portanto não foram testados entrega real, autenticação, antispam, CORS ou armazenamento de um fornecedor. O comportamento de erro de um serviço real também depende dessa integração.
- Sem domínio/hospedagem definidos. Fallback de 404, TLS, logs e políticas do provedor ainda dependem da escolha e configuração da hospedagem.
- Testes executados em Chrome com viewports responsivos, sem dispositivos físicos ou verificação separada em Safari/Firefox. Não foi realizada auditoria formal com leitor de tela.
- Demo permanece com `noindex, nofollow`, robots bloqueado e placeholders explícitos. Nenhum analytics, pixel ou mapa externo foi instalado.

Não foi iniciada terceira rodada de inspeção ou refinamento estético.

## Correção posterior: carregamento do CSS no HTML

Após o relato de ausência de estilos ao visualizar o HTML fora do Vite, foi adicionada uma folha CSS compilada diretamente ao `<head>` de todas as páginas. A compilação independente está em `scripts/styles.mjs`; fontes locais e caminhos de imagens também funcionam no servidor estático. O Vite continua resolvendo os caminhos para produção e recompila alterações de SCSS durante o desenvolvimento.

- Build após a correção: aprovado, incluindo o verificador das nove páginas e dos links.
- Verificação focada no Chrome, sem nova revisão estética: inicial e Direito Civil em servidor estático e Vite, na largura de 390 px.
- Confirmados CSS aplicado, fonte Inter carregada, imagens decodificadas sem falhas, ausência de overflow horizontal e abertura/fechamento do menu nos quatro cenários.
- A primeira execução dessa verificação tratou uma imagem lazy ainda não solicitada como falha. O verificador foi ajustado para solicitar e aguardar a decodificação das imagens antes da checagem; os quatro cenários passaram.
