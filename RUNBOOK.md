# Shell Collection — RUNBOOK

"The Shell Cabinet": a museum-styled web app for a Southwest Florida shell collection.
Built 2026-09-12. Verified building and rendering on this machine the same day.

- **Repo:** https://github.com/JohnDSmall/shell-collection (HTTPS remote; no SSH key on this machine)
- **Live:** https://johndsmall.github.io/shell-collection/ — deployed by GitHub Actions on every push to `main`
- **Local:** `C:\Users\Cameron Corse\projects\shell-collection`
- **Source of truth for the inventory:** the Google Sheet
  <https://docs.google.com/spreadsheets/d/1qLVgj_1Iiwz-Ud4y5aOK9hyX4hOZ68FYyNwKKvL3xL8/edit>
  (tab gid `1400138359`). The app's data is a hand transcription of it — see [Updating data](#updating-data).

| Component | What it is | Status |
|---|---|---|
| `src/data/inventory.ts` | every row of the sheet's detailed inventory (115 lots, 5,057 shells, $10,012) | ✅ matches sheet totals exactly |
| `src/data/species.ts` | catalog of 112 species: 49 held + 33 more SW Florida targets + 30 world grails | ✅ facts from general knowledge — spot-check before quoting |
| `src/pages/Dashboard.tsx` | "Cabinet" — stats, scrolling gallery, top-8 bars, notable finds, curator's notes | ✅ |
| `src/pages/Library.tsx` | every held species as a numbered plate; search + sort | ✅ |
| `src/pages/SpeciesDetail.tsx` | one species: facts + the size × colour "drawer" table | ✅ |
| `src/pages/FieldGuide.tsx` | checklist by rarity tier, SW Florida vs World, progress rings | ✅ |
| `.github/workflows/deploy.yml` | GitHub Pages deploy on push to `main` | ✅ repo created 2026-09-12; `configure-pages` enables Pages itself |

## Stack

Vite 8 + React 19 + TypeScript. **No router, no state library, no backend** — routing is a
30-line hash router in `App.tsx` (`#/`, `#/library`, `#/library/<id>`, `#/guide`) and all data is
static TypeScript. The only persisted state is the field guide's "Mark found" toggles, in
`localStorage` under `shell-collection:found`.

```
npm install       # once
npm run dev       # http://localhost:5173/shell-collection/   (note the base path)
npm run build     # tsc -b && vite build  → dist/
npm run preview   # serves dist/ on :4173
```

**Gotcha (Windows):** Vite 8 bundles with rolldown, whose native binary is an optional dep that
npm sometimes drops. If `npm run build` dies with `Cannot find module '@rolldown/binding-win32-x64-msvc'`,
run `npm install`. It is pinned in `optionalDependencies` at the version matching `rolldown`
(1.2.8 today) — bump both together if Vite is upgraded.

## Data model

Two files, both plain arrays so they can be edited by hand or regenerated from the sheet.

**`species.ts`** — one row per species. Fields: `id` (slug, referenced by the inventory), `common`
(the name used in the sheet), `scientific`, `family`, `group`, `region` (`Southwest Florida` |
`World`), `habitat`, `sizeIn` [min,max inches], `rarity` 1–5, `glyph` (which SVG silhouette),
`palette` [base, accent], `blurb`, `facts[]`, `rarityFromSheet`. The last flag is `true` for the
47 rarities that came from the sheet's "Rarity (1-5)" column; everything else is my estimate.

**`inventory.ts`** — `LOTS`: one row per sheet line: `[speciesId, size band, variant, unit $, qty, note]`.
Zero-quantity rows are kept on purpose so the detail page shows gaps in the size/colour grid.
Also holds `NOTABLE_FINDS`, `TODO`, `NEEDS_STORAGE`, `EQUIPMENT` from the sheet's side tables.

`lib/stats.ts` derives everything else (totals, per-species holdings, size-band ordering).
It throws at startup if a lot references an unknown species id, so typos surface immediately.

### Name mapping worth knowing

The sheet uses local names; the app maps them to species. Judgement calls made:

| Sheet | App species | Note |
|---|---|---|
| Moon Shell | *Naticarius canrena* (colorful Atlantic moon) | separate from Shark Eye, *Neverita duplicata* |
| Jewery Box | *Arcinella cornuta* (Florida spiny jewelbox) | "Spiney" variant implies this; leafy jewelbox is a separate guide entry |
| Rose Murex | *Chicoreus florifer* | some sources lump with lace murex |
| Florida Conch | Florida Fighting Conch, *Strombus alatus* | |
| Butterfly | Coquina, *Donax variabilis* | |
| Scallop | Calico scallop, *Argopecten gibbus* | bay scallop also possible |
| Top Shell | *Calliostoma euglyptum* | genus-level guess |
| Auger | *Terebra dislocata* | genus-level guess |
| ? | `unknown` species | 3 shells, shows in library, hidden from field guide |
| Sand Dollar | echinoderm, 0 qty | kept so it shows as "not found" |

**Sheet discrepancy:** the sheet's summary tab omits Apple Murex (249), Turkey Wing (44), Worm
Shell (151) and Scallop (60) from its per-species list, but its totals (5,057 / $10,012) include
them. The app computes from the detailed rows, so it agrees with the totals, not the summary list.

## Updating data

When the sheet changes: edit `inventory.ts` to match (or ask Claude to re-read the sheet via the
Google Drive connector — file id `1qLVgj_1Iiwz-Ud4y5aOK9hyX4hOZ68FYyNwKKvL3xL8`). New species need
a row in `species.ts` first; pick a `glyph` from the list in `types.ts` and two palette colours.
Then `npm run build` — the build fails if an id is wrong.

The dashboard footer says "Inventory as of 12 Sep 2026" — it is hard-coded in `App.tsx`; update it.

## Theme

Single light "museum" palette, all in `:root` of `src/index.css`: parchment paper, ink text,
brass accents, wax-seal red for "collected" stamps. Fonts: Cormorant Garamond (display) +
Source Sans 3 (body) from Google Fonts, loaded in `index.html`. No dark mode by design.

Shell illustrations are hand-drawn SVG paths in `components/ShellGlyph.tsx`, 26 silhouettes
in a 100×120 box, coloured per species. `muted` renders line-art for not-yet-found species.

## GitHub

Repo created by hand 2026-09-12. `gh` is not installed; pushes go over HTTPS via Git Credential
Manager (the SSH URL fails — no key on this machine). The workflow calls
`actions/configure-pages` with `enablement: true`, so Pages did not need to be switched on in
Settings. If a deploy fails with a Pages permission error, check Settings → Pages → Source is
**GitHub Actions**. If the repo name changes, change `base` in `vite.config.ts` to match.

## Possible next steps

- Real photographs per species instead of glyphs (`public/photos/<id>.jpg`, fall back to glyph).
- Read the Google Sheet directly at build time so the transcription step goes away.
- A "log a find" form → needs a backend (Supabase, like `codex`) or a Sheets API write.
- Size-band value curves per species (the sheet already prices each band).
- Per-beach map of where finds came from (only 2 locations recorded so far).
