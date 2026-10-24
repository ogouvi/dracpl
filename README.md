# Portail des arts et de la culture — Région des Plateaux

French cultural portal for the Direction régionale des arts et de la culture des Plateaux (Togo).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6a38da73-7231-4368-ae4c-a8df66a15811).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Work locally in VS Code

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Open the address the terminal prints (usually `http://localhost:5173`). VS Code needs no extra setup: the terminal inside VS Code (`Ctrl+Shift+\``) is enough.

Other useful commands:

```sh
npm run test    # checks the content sources and the pages
npm run lint    # code style
npm run build   # production build
```

## Connect your own content

Without any settings the portal shows clearly labelled demonstration content. To read your own publications, copy `.env.example` to `.env` and fill in the address of your content workspace:

```sh
cp .env.example .env
```

- **Hygraph** — Project settings → API Access → Content API: copy the Content Delivery API URL into `HYGRAPH_ENDPOINT`. Publish at least one item per section (only published content is read). Model API IDs: `actualites`, `evenements`, `annonces`, `galeries`, `videos`.
- **WordPress** — put your site address in `WORDPRESS_URL` and publish posts in the `actualites` and `agenda` categories. Leave `HYGRAPH_ENDPOINT` empty.

`.env` is ignored by git and never shared. On the hosted site the same names are filled in as project secrets, so nothing needs to be written into the code.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/routes/` | one file per page address |
| `src/components/portal/` | header, footer, cards, page layouts |
| `src/lib/portal/content.ts` | demonstration editorial content |
| `src/lib/portal/source.ts` | chooses Hygraph, WordPress or demonstration content |
| `src/styles.css` | colours, fonts, layout rules |
