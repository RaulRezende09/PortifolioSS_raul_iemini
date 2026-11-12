# Portfólio | Raul Rezende Iemini Aguiar

Portfólio interativo com temática espacial: a página abre numa escotilha que se abre com a rolagem, passa pela ponte de comando (as telas do console mostram os dados) e chega à janela de observação, onde os projetos orbitam o planeta central.

- **Luas:** projetos próprios
- **Satélites:** projetos em equipe
- **Planeta:** perfil resumido e download do currículo

## Tecnologias

React 18, Tailwind CSS 4, Canvas 2D e SVG. O build usa esbuild e o CLI do Tailwind.

## Estrutura

```
├── public/                  # o que vai para o ar
│   ├── index.html
│   ├── Curriculo_Raul_Rezende_Iemini_Aguiar.pdf
│   └── assets/              # gerado pelo build (app.js e styles.css)
├── src/
│   ├── main.jsx             # todo o conteúdo e os componentes
│   └── styles.css           # tema do Tailwind e estilos próprios
├── package.json
└── render.yaml
```

Projetos, habilidades, certificações e contatos ficam nas constantes do começo de `src/main.jsx` (`PERSON`, `PROJECTS`, `TIMELINE`, `SKILLS`, `BADGES`, `COURSES`, `LANGS`).

## Rodar localmente

```bash
npm install
npm run dev        # gera o build e abre em http://localhost:3000
```

## Publicar no Render

1. Suba este repositório no GitHub.
2. No Render, crie um **Static Site** a partir do repositório (ou use **Blueprint**, que lê o `render.yaml`).
3. Configure:
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `public`

Para trocar o currículo, substitua `public/Curriculo_Raul_Rezende_Iemini_Aguiar.pdf` mantendo o mesmo nome.
