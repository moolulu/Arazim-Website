import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT_DIR = new URL(".", import.meta.url).pathname;
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const STATIC_DIR = path.join(ROOT_DIR, "static");
const DIST_DIR = path.join(ROOT_DIR, "dist");

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function emptyDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await ensureDir(dir);
}

async function copyStatic() {
  try {
    const entries = await fs.readdir(STATIC_DIR, { withFileTypes: true });
    for (const entry of entries) {
      const src = path.join(STATIC_DIR, entry.name);
      const dest = path.join(DIST_DIR, entry.name);
      if (entry.isDirectory()) {
        await copyDir(src, dest);
      } else {
        await ensureDir(path.dirname(dest));
        await fs.copyFile(src, dest);
      }
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      return;
    }
    throw err;
  }
}

async function copyDir(srcDir, destDir) {
  await ensureDir(destDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDir(src, dest);
    } else {
      await fs.copyFile(src, dest);
    }
  }
}

function slugToFilename(slug) {
  return `${slug}.html`;
}

function getDefaultMeta() {
  return {
    siteTitle: "ארזים",
    siteTagline: "הופכים את הבלתי אפשרי לקשה מאוד",
  };
}

function buildHtml({ meta, navItems, bodyClass, contentHtml }) {
  const { siteTitle, siteTagline } = getDefaultMeta();
  const pageTitle = meta.title ? `${meta.title} • ${siteTitle}` : siteTitle;

  const safeDescription =
    meta.description ||
    siteTagline ||
    "Learn more about the Arazim program.";

  const activeSlug = meta.slug || "index";

  const navLinks = navItems
    .filter((item) => item.showInNav !== false)
    .map((item) => {
      const href = slugToFilename(item.slug);
      const isActive = item.slug === activeSlug;
      const label = item.navLabel || item.title || item.slug;
      return `<a href="${href}" class="nav-link${
        isActive ? " nav-link-active" : ""
      }">${label}</a>`;
    })
    .join("");

  const layoutClass = meta.layout ? `layout-${meta.layout}` : "layout-default";

  return `<!doctype html>
<html lang="he" dir="rtl" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${pageTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="stylesheet" href="./styles.css" />
    <script>
      (function() {
        try {
          const stored = localStorage.getItem('theme');
          const root = document.documentElement;
          if (stored === 'light' || stored === 'dark') {
            root.dataset.theme = stored;
          } else {
            root.dataset.theme = 'light';
          }
        } catch (e) {}
      })();
    </script>
  </head>
  <body class="${layoutClass} ${bodyClass || ""}">
    <div class="page-shell">
      <header class="site-header">
        <div class="site-branding">
          <a href="." class="site-logo-link">
            <img src="./images/logo.png" alt="ארזים" class="site-logo" />
          </a>
          <div class="site-text">
            <a href="." class="site-title">${siteTitle}</a>
            <p class="site-tagline">${siteTagline}</p>
          </div>
        </div>
        <nav class="site-nav">
          <a href="." class="nav-link">התוכנית</a>
          ${navLinks}
        </nav>
        <button class="theme-toggle" type="button" aria-label="Toggle color theme">
          <span class="theme-toggle-icon theme-toggle-icon-sun">☀</span>
          <span class="theme-toggle-icon theme-toggle-icon-moon">⏾</span>
        </button>
      </header>
      <main class="site-main">
        ${contentHtml}
      </main>
      <footer class="site-footer">
        <p>${siteTitle} ${new Date().getFullYear()} ©. כל הזכויות שמורות.</p>
      </footer>
    </div>
    <script>
      (function() {
        const btn = document.querySelector('.theme-toggle');
        if (!btn) return;
        btn.addEventListener('click', function() {
          const root = document.documentElement;
          const current = root.dataset.theme || 'light';
          const next = current === 'light' ? 'dark' : 'light';
          root.dataset.theme = next;
          try { localStorage.setItem('theme', next); } catch (e) {}
        });
      })();
    </script>
  </body>
</html>`;
}

async function loadContentPages() {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const pages = [];
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const fullPath = path.join(CONTENT_DIR, file);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = matter(raw);
      const slugFromFile = file.replace(/\.md$/, "");
      const slug = parsed.data.slug || slugFromFile;
      const navOrder =
        typeof parsed.data.navOrder === "number"
          ? parsed.data.navOrder
          : slug === "index"
          ? 0
          : 100;

      pages.push({
        slug,
        navLabel: parsed.data.navLabel || parsed.data.title || slug,
        title: parsed.data.title || "",
        description: parsed.data.description || "",
        layout: parsed.data.layout || "default",
        showInNav:
          typeof parsed.data.showInNav === "boolean"
            ? parsed.data.showInNav
            : slug !== "index",
        navOrder,
        bodyMarkdown: parsed.content,
        rawFrontmatter: parsed.data,
      });
    }
    pages.sort((a, b) => a.navOrder - b.navOrder);
    return pages;
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function build() {
  console.log("Building static site...");
  await emptyDir(DIST_DIR);

  const pages = await loadContentPages();
  if (pages.length === 0) {
    console.warn(
      "No content pages found in ./content. Create a file like content/index.md to get started."
    );
  }

  await copyStatic();

  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: true,
    mangle: false,
  });

  const navItems = pages.map((p) => ({
    slug: p.slug,
    navLabel: p.navLabel,
    title: p.title,
    showInNav: p.showInNav,
  }));

  for (const page of pages) {
    const htmlContent = marked(page.bodyMarkdown);
    const bodyClass = page.rawFrontmatter.bodyClass || "";
    const heroTitle = page.rawFrontmatter.heroTitle || page.title || "";
    const heroSubtitle =
      page.rawFrontmatter.heroSubtitle || page.description || "";
    const heroImage = page.rawFrontmatter.heroImage || "";
    const heroStyle = heroImage
      ? ` style="background-image: url('${heroImage}')"`
      : "";
    const html = buildHtml({
      meta: page,
      navItems,
      bodyClass,
      contentHtml: `<article class="page-content">
  ${
    heroTitle
      ? `<section class="page-hero"${heroStyle}>
      <div class="page-hero-overlay"></div>
      <div class="page-hero-inner">
        <h1 class="page-hero-title">${heroTitle}</h1>
        ${
          heroSubtitle
            ? `<p class="page-hero-subtitle">${heroSubtitle}</p>`
            : ""
        }
      </div>
    </section>`
      : ""
  }
  <div class="page-body">
    ${htmlContent}
  </div>
</article>`,
    });

    const outFileName = slugToFilename(page.slug);
    const outPath = path.join(DIST_DIR, outFileName);
    await ensureDir(path.dirname(outPath));
    await fs.writeFile(outPath, html, "utf8");
    console.log(`  ✓ ${outFileName}`);
  }

  console.log("Done. Files written to ./dist");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

