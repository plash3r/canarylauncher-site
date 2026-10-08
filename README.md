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

The build creates `dist/` and updates the ready-to-serve files in the repository root: `index.html`, `css/style.css`, `js/app.js`, `assets/`, `screenshots/`, `brand/`, `platforms/` and `.nojekyll`. Windows installers from the repository's `windows/` folder are copied into `dist/windows/` without deleting the originals. Commit generated website files together with source changes. Do not edit generated `index.html` directly.

The release uses a classic deferred JavaScript bundle and an ordinary external stylesheet. It supports both opening `index.html` directly on a computer and uploading the entire site to a static host. React is included in the JavaScript bundle, with no external CDN dependency.

## Hosting on Sprinthost

Upload the **contents** of `dist/` into the domain's public web directory. Keep all folders beside `index.html`. No Node.js runtime is required on the host.

```text
index.html
css/style.css
js/app.js
assets/
brand/
platforms/
screenshots/
windows/Canary_0.1.8_x64-setup.exe
.nojekyll
```

The Windows download uses this URL relative to the folder containing `index.html`:

```text
./windows/Canary_0.1.8_x64-setup.exe
```

Place the supplied Windows 0.1.8 installer in the repository's `windows/` folder before building. The build includes installers present in that folder. Upload `windows/` beside `index.html` so the installer is available at the URL above on your website host. Keep the filename and case exactly as configured in `src/release.js`. Update that file and rebuild when releasing a new version.

Linux and macOS have their own platform cards and explicitly show that installation is temporarily unavailable. Their download buttons are disabled and no installer URLs are provided.

## Updating screenshots and installers on the host

Replace screenshots in `screenshots/` using the same names: `home.png`, `discover.png` and `library.png`. Replace the installer in `windows/` using the filename configured in `src/release.js`. Screenshot and installer requests receive a fresh URL version on each page opening, so a reload requests the current files even if the browser cached an earlier version.

If an installer has a different filename or version number, update `src/release.js`, rebuild and upload the new release. The website does not automatically scan the Windows folder for new installers.

Generated JavaScript and stylesheet URLs include content versions. When uploading a rebuilt site, replace `index.html` together with `js/` and `css/`. Editing files in `src/` requires a build before those changes appear on the hosted site.

## GitHub Pages

GitHub Pages can publish `main / (root)` directly. Relative website asset and installer paths also support `/canarylauncher-site/`, other subdirectories and opening the site from disk. Configure `src/release.js` with an absolute URL only if hosting installers separately.

## Interactions and accessibility

The header includes theme and RU/EN language controls. Both preferences are saved locally, with dark mode as the initial theme. The language initially follows Russian browser preferences, otherwise English. All three pages, screenshot captions, dialogs, download status, FAQs, tooltips and accessibility labels are localized. Text inside the supplied launcher screenshots remains part of the original images.

Theme switching reveals the new appearance in a circle starting at the clicked control (or its centre for keyboard activation). It uses View Transitions when available and an inert masked snapshot fallback otherwise. Reduced-motion preferences disable the reveal. Saved light mode is applied before the page paints to avoid a dark flash on reload.

- Hash routes support direct links, reloads and browser back/forward.
- Feature cards expand to show additional details.
- Platform selection updates the installation instructions and download availability.
- The download page includes expandable FAQs.
- Gallery thumbnails and arrow buttons switch screenshots. Open the large preview for the full-size viewer; left/right arrows navigate and Escape closes it. Keyboard focus returns to the preview.
- The layout adapts to mobile screens and honours reduced-motion preferences.

## Assets

The Canary bird and wordmark are the supplied PNGs, preserved unchanged. Interface icons use [Lucide](https://lucide.dev/). Windows, Apple and Linux platform SVGs come from [Devicon](https://github.com/devicons/devicon), with its MIT licence included at `public/platforms/LICENSE` and `platforms/LICENSE`. Brand marks belong to their respective owners.

The footer Discord brand mark comes from [Simple Icons](https://github.com/simple-icons/simple-icons) (CC0). It links to the Canary community invite and opens in a new tab.
