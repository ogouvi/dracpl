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
npm start       # run the production Node.js server after building
```

## Deploy to a Node.js host

The production build uses Nitro's `node-server` preset. It generates a Node.js server at `.output/server/index.mjs` alongside the static assets in `.output/public`.

```sh
npm ci
npm run build
test -f .output/server/index.mjs
npm start
```

For Plesk, use a plan with Node.js application support, set the application root to the project, and configure the app to run `npm start` with the production Node.js version. Build the project after deploying its source and dependencies, then restart the application. Add `HYGRAPH_ENDPOINT` and any other required settings in Plesk's environment-variable settings; do not upload a local `.env` file. Confirm that your hosting plan's Node.js integration supports launching this Nitro server and listening on its assigned port.

## Connect your own content

Without any settings the portal shows clearly labelled demonstration content. To read your own publications, copy `.env.example` to `.env` and fill in the address of your content workspace:

```sh
cp .env.example .env
```

- **Hygraph** — Project settings → API Access → Content API: copy the Content Delivery API URL into `HYGRAPH_ENDPOINT`. Publish at least one item per section (only published content is read). Model API IDs: `actualites`, `evenements`, `annonces`, `galeries`, `videos`. If Hygraph is not configured or has no published content, the portal uses its labelled demonstration content.

`.env` is ignored by git and never shared. On the hosted site the same names are filled in as project secrets, so nothing needs to be written into the code.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/routes/` | one file per page address |
| `src/components/portal/` | header, footer, cards, page layouts |
| `src/lib/portal/content.ts` | demonstration editorial content |
| `src/lib/portal/source.ts` | chooses Hygraph or demonstration content |
| `src/styles.css` | colours, fonts, layout rules |
