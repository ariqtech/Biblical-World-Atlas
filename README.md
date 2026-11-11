# Biblical World Atlas

**Research Atlas & Encyclopedia** — a free, noncommercial, English-language educational website and installable progressive web app (PWA).

## Initial live foundation

- Responsive navy-and-gold homepage, with readable light search field and KJV 2 Timothy 2:15
- Searchable **small curated starter index**, not yet a complete encyclopedia or scripture search
- Five priority scripture editions: ASV, KJV, JPS Tanakh 1917, NKJV and Amplified Bible
- Authorized external reading links for copyrighted NKJV/AMP
- Starter map and historical geography links
- Private single-note browser storage with JSON export/import
- Web app manifest and basic offline caching of the site interface

## Research and publishing commitments

The project will progressively add source-verified references, bidirectional scripture-to-ancient-text relationships, geography and historical atlases. Theories and unverified ideas are isolated from documented historical facts. The only planned hypothetical geographical overlay is the biblical river comparison to the United States, housed exclusively in that separate section.

No AI assistant, public edits, accounts, paywalls or donations are part of this project. Readers can create private notes locally; only maintainers publish shared research. The full content library, maps, multilingual source texts and offline packs **have not yet been imported**.

## Hosting

This is a no-build static website suitable for GitHub Pages. In repository **Settings → Pages**, choose **Deploy from a branch**, `main`, `/(root)`, and Save. Expected site address: https://ariqtech.github.io/Biblical-World-Atlas/

Do not place API keys in this public repository. Check original text and map edition licenses before embedding and distributing downloads. Browser notes are stored locally and can be lost if site storage is cleared: export backups regularly.

## Files

- `index.html`: accessible homepage and content sections
- `styles.css`: responsive theme
- `app.js`: research index, search/filter and local notes
- `manifest.webmanifest`: install metadata
- `icon.svg`: project icon
- `sw.js`: basic app-shell offline cache

Initial PWA support is a foundation, not a guarantee of install prompts on every device. Future releases can add platform-specific PNG icons, downloaded content packs and desktop installers.
