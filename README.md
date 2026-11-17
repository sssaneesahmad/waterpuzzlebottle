# Aqua Alchemy — Liquid Sort Puzzle

A polished, responsive browser-based Water Sort Puzzle game built with React, TypeScript, Vite, Tailwind CSS, SVG graphics, and the Web Audio API.

## Features

- **Playable Puzzle Engine**: Deterministic level generation verified by a state-space solver so every level is guaranteed solvable.
- **Complexity-Based Timer & Move Limits**: Each level sets a tight countdown timer (`25s` on Level 1 up to `120s` on 10-color levels) and a move limit (`12` moves on Level 1 up to `56` moves on 10-color levels). Running out of time or moves opens a continue prompt to watch a rewarded ad for `+20s` or `+5 Moves` (repeatable) or restart.
- **Rewarded Ad Extra Bottle**: Clicking `+ Bottle` opens a rewarded ad first before adding an extra empty bottle to the board.
- **Smooth Pour Animations**: Physical bottle lifting, tilting toward the target bottle, curved glowing liquid stream, meniscus surface highlights, and completion bubbles.
- **Audio & Accessibility**: Synthesized Web Audio API chimes and water droplets, optional ambient melody, vibration haptics, keyboard shortcuts (`1-0`, `R`, `Z`, `H`, `Esc`), and optional Colorblind liquid symbols.
- **Local Persistence**: Saves level progress, coin balance, remaining level timer, settings, daily rewards, and active board state in `localStorage`.

## Managing Rewarded Ads

All rewarded ad requests route through `src/utils/adManager.ts` (`triggerRewardedAd`):

1. **Google AdSense H5 Games Ads (`adBreak`)**:
   - Add your AdSense H5 Games script to `index.html` (`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>`) and initialize `window.adBreak` / `window.adConfig`.
   - `AD_CONFIG.provider` is already set to `'adsense_h5'`. Once `window.adBreak` is present on your live Hostinger domain, `+30s Time` and `+ Bottle` will automatically serve real Google rewarded ads.
2. **Other Web Ad Networks (Monetag, AdinPlay, Poki, GameDistribution, CrazyGames)**:
   - Update `triggerRewardedAd` in `src/utils/adManager.ts` to call your network's rewarded ad SDK promise/callback, then invoke `onGranted()` when the user finishes viewing the ad or `onDismissed()` if skipped.
3. **Built-in Preview / Custom Sponsor Mode**:
   - When no external ad script is loaded (such as during local development), `triggerRewardedAd` falls back to `RewardedAdModal` with a 5-second countdown configured by `AD_CONFIG` in `src/utils/adManager.ts`.

## Local Development

```bash
npm install
npm run dev
```

Run engine verification tests:

```bash
npx tsx src/game/engine.test.ts
```

## Production Build & Hostinger Deployment

1. Build the static production bundle:

```bash
npm run build
```

2. Upload the entire contents of the generated `dist/` folder to your Hostinger `public_html/` directory (via File Manager, FTP, or Git deployment).
3. No backend server or environment variables are required for deployment.
