## Project Structure

Inside the project, you'll see the following folders and files:

```text
/
├── public/
│   ├── favicon.png
│   ├── logo.png
│   └── axes
├── src
│   ├── assets
│   │   └── images
│   ├── components
│   │   ├── Header.astro
│   │   └── <Stations>.astro
│   ├── layouts
│   │   └── Layout.astro
│   ├── pages
│   │   └── <pages>.astro
│   └── config.js
├── .github
│   └── workflows
│       └── deploy.yml
└── package.json
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
