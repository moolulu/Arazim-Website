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
│   │   ├── images
│   │   └── code-snippets
│   ├── components
│   │   ├── Header.astro
│   │   └── stations
│   ├── layouts
│   │   └── Layout.astro
│   ├── pages
│   └── config.js
└── package.json
```

Alongside meta and development specific files such as:

```text
/
├── .github
│   └── workflows
│       └── deploy.yml
├── .gitignore
├── .gitattributes
├── LICENSE
└── README.md
```


## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |

## Contribute

To contribute, fork the repository to test your changes on a seperate domain, and open a pull request when done.
