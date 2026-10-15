# Portfólio · Diagnóstico de lojas em Power BI

Site estático com dois estudos de caso (Raio-X Vendas 360 e Diagnóstico Financeiro 360) e demonstrações interativas. Funciona no GitHub Pages sem build: é só HTML, CSS e JavaScript.

**Todos os dados são fictícios.** `scripts/gerar_dados.py` gera uma rede inventada de 60 lojas, com semente fixa. Nenhuma loja, pessoa ou valor é real, e nenhum arquivo dos projetos originais está neste repositório.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `index.html`, `raio-x-vendas/`, `diagnostico-financeiro/` | páginas em português |
| `en/` | as mesmas páginas em inglês |
| `assets/css/site.css` | estilos (tema claro e escuro) |
| `assets/js/demos.js` | demonstrações em SVG, sem bibliotecas |
| `assets/data/rede.json` | dados fictícios usados pelas demonstrações |
| `scripts/gerar_dados.py` | gera `rede.json` |
| `scripts/build_site.py` | gera as páginas a partir dos textos em PT e EN |

## Publicar no GitHub Pages

1. Crie um repositório (por exemplo `portfolio`) e envie todos os arquivos desta pasta, incluindo `.nojekyll`.
2. No repositório, abra **Settings → Pages**. Em **Build and deployment**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.
3. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/portfolio/`.

Para o site ficar em `https://SEU-USUARIO.github.io/`, dê ao repositório o nome `SEU-USUARIO.github.io`.

## Editar

- Nome e links de contato: no topo de `scripts/build_site.py` (`PERFIL`). Os campos vazios não aparecem no site.
- Textos: dicionários `TXT`, `RX` e `FIN` no mesmo arquivo.
- Depois de editar, rode `python scripts/build_site.py` para regerar as páginas.
- Para ver localmente: `python -m http.server` na pasta e abra `http://localhost:8000`. Abrir o arquivo direto no navegador não carrega os dados.

---

# Portfolio · Store diagnostics in Power BI

A static site with two case studies (Sales X-Ray 360 and Financial Diagnosis 360) and interactive demos. It runs on GitHub Pages with no build step: plain HTML, CSS and JavaScript.

**All data is fictitious.** `scripts/gerar_dados.py` generates an invented network of 60 stores with a fixed seed. No real store, person or value is included, and no file from the original projects is in this repository.

To publish: upload everything (including `.nojekyll`), then go to **Settings → Pages → Deploy from a branch → main / (root)**. Edit names, links and copy in `scripts/build_site.py` and run `python scripts/build_site.py`. Preview locally with `python -m http.server`.
