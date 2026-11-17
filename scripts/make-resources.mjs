// Renders the source images that `npm run assets` (@capacitor/assets) turns into
// Android and iOS icons and splash screens. Input: resources/mark.svg (the card mark).
// Output: resources/icon-only.png, icon-foreground.png, icon-background.png,
//         splash.png and splash-dark.png.
// Run: node scripts/make-resources.mjs && npm run assets
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const res = (f) => path.join(root, 'resources', f);
const INK = '#1b1714', PAPER = '#f4eee2';

const svg = await readFile(res('mark.svg'), 'utf8');
// On ink the cards get a paper outline so the ink header still reads; on paper the outline is ink.
const mark = (size, onInk = false) => sharp(Buffer.from(svg.replaceAll('OUTLINE', onInk ? PAPER : INK)), { density: Math.ceil((72 * size) / 1024) })
  .resize(size, size).png().toBuffer();
const plate = (size, color) => sharp({ create: { width: size, height: size, channels: 4, background: color } });

// Full icon (iOS, legacy Android): paper plate, mark fills most of it.
await plate(1024, PAPER).composite([{ input: await mark(860), gravity: 'center' }]).png().toFile(res('icon-only.png'));
// Adaptive icon (Android): the generated XML insets the layer by 16.7 % and launchers crop to a circle, so the mark stays inside the safe zone.
await plate(1024, '#00000000').composite([{ input: await mark(800), gravity: 'center' }]).png().toFile(res('icon-foreground.png'));
await plate(1024, PAPER).png().toFile(res('icon-background.png'));
// Splash: plain paper (light) or ink (dark) with a modest card mark in the middle.
await plate(2732, PAPER).composite([{ input: await mark(640), gravity: 'center' }]).png().toFile(res('splash.png'));
await plate(2732, INK).composite([{ input: await mark(640, true), gravity: 'center' }]).png().toFile(res('splash-dark.png'));
console.log('resources/: icon-only, icon-foreground, icon-background, splash, splash-dark');
