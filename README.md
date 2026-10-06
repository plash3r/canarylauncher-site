# Canary Launcher website

React website based on the supplied Canary design, with Home, About and Download pages. The Home gallery includes the three actual launcher screenshots: Home, Discover and Library.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host. Relative asset paths support hosting at a domain root or a subdirectory such as `/canarylauncher-site/`. The repository's root `index.html` is the Vite entry point and requires the build step.

## Gallery

Choose a thumbnail or use the previous/next buttons. Click the large preview to open the full-size viewer. Left/right arrow keys switch screenshots; Escape closes the viewer. The modal contains keyboard focus and restores it to the preview on close. The layout adapts to mobile screens and respects reduced-motion preferences.

The Download page keeps the supplied Coming Soon status; no release download URL was provided.
