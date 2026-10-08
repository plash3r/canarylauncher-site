# Canary Launcher website

React website for Canary Launcher, with Home, About and Download pages. The design keeps the dark background, amber accents, translucent cards and the launcher screenshot gallery.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

The source entry is `/app.html` (Vite opens it automatically). Edit `src/` and `app.html`, then regenerate the static release:

```sh
npm run build
npm run preview
```

The build creates `dist/` and updates the ready-to-serve files in the repository root: `index.html`, `assets/`, `screenshots/`, `brand/`, `platforms/` and `.nojekyll`. Commit these generated files together with source changes. Do not edit generated `index.html` directly.

## Hosting on Sprinthost

Upload the **contents** of `dist/` into the domain's public web directory. Keep all folders beside `index.html`. No Node.js runtime is required on the host.

The Windows download uses this site-root URL:

```text
/windows/Canary_0.1.8_x64-setup.exe
```

Place the real Windows installer at that public URL on `plash3r.xsph.ru`. The installer is not part of the website repository or build. Keep the filename and case exactly as configured in `src/release.js`. Update that file and rebuild when releasing a new version.

Linux and macOS have their own platform cards and explicitly show that installation is temporarily unavailable. Their download buttons are disabled and no installer URLs are provided.

## GitHub Pages

GitHub Pages can publish `main / (root)` directly. Relative website asset paths also support `/canarylauncher-site/`. The installer URL is deliberately rooted at `/windows/` for Sprinthost; configure `src/release.js` with the correct URL if using a different download host.

## Interactions and accessibility

- Hash routes support direct links, reloads and browser back/forward.
- Feature cards expand to show additional details.
- Platform selection updates the installation instructions and download availability.
- The download page includes expandable FAQs.
- Gallery thumbnails and arrow buttons switch screenshots. Open the large preview for the full-size viewer; left/right arrows navigate and Escape closes it. Keyboard focus returns to the preview.
- The layout adapts to mobile screens and honours reduced-motion preferences.

## Assets

The Canary bird and wordmark are the supplied PNGs, preserved unchanged. Interface icons use [Lucide](https://lucide.dev/). Windows, Apple and Linux platform SVGs come from [Devicon](https://github.com/devicons/devicon), with its MIT licence included at `public/platforms/LICENSE` and `platforms/LICENSE`. Brand marks belong to their respective owners.
