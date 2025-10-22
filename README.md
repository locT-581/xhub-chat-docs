# XHub Chat Documentation Site

This directory contains the Docusaurus-based documentation website for XHub Chat.

## 🚀 Getting Started

### Installation

Make sure you're in the root directory and run:

```bash
# From root directory
pnpm install
```

### Development

Start the development server:

```bash
# From root directory
pnpm docs:dev

# Or from docs-site directory
cd docs-site
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation site.

### Building

Build the static site:

```bash
# From root directory
pnpm docs:build

# Or from docs-site directory
cd docs-site
pnpm build
```

### Preview Production Build

Preview the production build locally:

```bash
# From root directory
pnpm docs:serve

# Or from docs-site directory
cd docs-site
pnpm serve
```

## 📁 Structure

```
docs-site/
├── docs/                      # Documentation content
│   ├── getting-started/       # Installation, quick start, requirements
│   ├── core-concepts/         # Architecture, design philosophy, FAQ
│   ├── api/                   # API reference documentation
│   ├── guides/                # How-to guides and tutorials
│   ├── platforms/             # Platform-specific docs (core, react)
│   ├── advanced/              # Advanced topics
│   ├── examples/              # Code examples
│   └── index.md               # Documentation homepage
├── src/
│   ├── components/            # React components
│   ├── css/                   # Custom styles
│   │   └── custom.css         # Theme customization
│   └── pages/                 # Static pages
│       └── index.tsx          # Landing page
├── static/                    # Static assets (images, fonts, etc.)
├── docusaurus.config.ts       # Docusaurus configuration
├── sidebars.ts                # Sidebar navigation structure
└── package.json               # Dependencies and scripts
```

## 🎨 Customization

### Theme Colors

Edit `src/css/custom.css` to customize colors (currently using purple/blue gradient theme).

### Navigation

Edit `sidebars.ts` to modify sidebar navigation.

## 📝 Writing Documentation

Create new `.md` files in the appropriate `docs/` subdirectory with frontmatter:

```md
---
sidebar_position: 1
title: Your Title
description: Your description
---

# Your Content Here
```

## 🚀 Deployment

### GitHub Pages

```bash
GIT_USER=<your-github-username> pnpm deploy
```

### Vercel / Netlify

Set build command: `pnpm build` and output directory: `build`

## 📚 Resources

- [Docusaurus Documentation](https://docusaurus.io/)

## 📄 License

Documentation © 2025 TekNix Corporation
