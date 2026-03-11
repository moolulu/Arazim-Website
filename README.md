## Arazim static website

This project lets you build a clean, modern website for the Arazim program by editing **simple text files**, without writing HTML or CSS.

- **Content files** live in the `content` folder.
- The site is generated into the `dist` folder.
- The design includes **light and dark modes**, responsive layout, and nice defaults for headings, lists, and images.

### 1. Install dependencies

From this folder (`Arazim-Website`), run:

```bash
npm install
```

This installs a small Markdown and front‑matter parser that the generator uses.

### 2. Build the site

To generate the website:

```bash
npm run build
```

This creates a `dist` folder with static `.html` files and CSS.

To view the site, you can:

- Open `dist/index.html` directly in your browser, or
- Use any simple static server (`npx serve dist`, VS Code Live Server, etc.).

### 3. Editing content (plain text)

Each page is a **Markdown** file in the `content` folder, for example:

- `content/index.md` – the home page
- `content/about.md` – an “About the program” page

At the top of each file there is a small configuration block:

```yaml
---
title: About the Program
description: Background, goals, and values of the Arazim program.
slug: about
layout: narrow
navLabel: About
navOrder: 10
---
```

- **title**: Page title shown at the top of the page.
- **description**: Short description, also used for search engines.
- **slug**: The file name in `dist` (e.g. `about` → `about.html`).
- **layout**: `narrow`, `default`, `wide`, or `split` (controls how wide the content area is).
- **navLabel**: How this page appears in the top navigation.
- **navOrder**: Lower numbers appear earlier in the navigation bar.

Under this block you simply write your text using headings, paragraphs, and bullet lists.

### 4. Adding images

1. Put your images in the `static/images` folder.
2. Refer to them in your text like this:

```markdown
![Group photo](/images/group-photo.jpg)
```

The build step copies everything from `static` into `dist`, so `/images/...` paths will work in the generated site.

### 5. Light and dark modes

The site automatically supports:

- **Automatic mode** – follows the visitor’s system preference.
- **Light mode**.
- **Dark mode**.

There is a small button in the top‑right corner that lets visitors toggle between these modes. You do not have to do anything special in your content; the CSS handles all the styling.

# Arazim-Website