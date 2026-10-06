# Canary Launcher website

React website based on the supplied Canary design, with Home, About and Download pages and an interactive gallery of the three launcher screenshots.

## GitHub Pages

The repository includes a ready-to-serve static release: `index.html`, `assets/`, `screenshots/` and `.nojekyll`. GitHub Pages can publish **main / (root)** directly. No build step on the hosting service is required. Relative asset paths support both the domain root and `/canarylauncher-site/`.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

The development source entry is **/app.html** (Vite opens it automatically). Edit `src/` and `app.html`, then regenerate the static release:

```sh
npm run build
npm run preview
```

The build updates `index.html`, `assets/` and `screenshots/` in the repository root and also creates `dist/` for other static hosts. Commit the generated root files together with source changes. Do not edit the generated `index.html` directly.

## Gallery

Choose a thumbnail or use the previous/next buttons. Click the large preview to open the full-size viewer. Left/right arrow keys switch screenshots; Escape closes the viewer. The modal contains keyboard focus and restores it to the preview on close. The layout adapts to mobile screens and respects reduced-motion preferences.

The Download page keeps the supplied Coming Soon status; no release download URL was provided.
