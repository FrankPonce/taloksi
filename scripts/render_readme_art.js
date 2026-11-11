/**
 * Renders the README artwork from the app's own character components, so the
 * pictures on GitHub are the real in-app art and never drift from it.
 *
 *   node scripts/render_readme_art.js      (or: npm run readme-art)
 *
 * Writes docs/assets/banner.svg and docs/assets/cast.svg.
 */
const Module = require('module');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
require('sucrase/register/ts');
require('sucrase/register/tsx');

// The art is written for React Native; on Node it runs through the web builds.
const stub = path.join(__dirname, 'readme_art_stub.js');
const alias = {
  'react-native': 'react-native-web',
  'react-native-svg': path.join(root, 'node_modules/react-native-svg/lib/commonjs/ReactNativeSVG.web.js'),
  '@expo/vector-icons': stub,
};
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  // Inside react-native-svg, prefer the .web.js twin of a file, the way a web bundler would
  if (request.startsWith('.') && parent && parent.filename && parent.filename.includes('react-native-svg')) {
    try {
      return resolve.call(this, request + '.web', parent, ...rest);
    } catch {}
  }
  if (request.startsWith('react-native/')) request = stub; // native-only internals
  return resolve.call(this, alias[request] || request, parent, ...rest);
};

const React = require('react');
global.React = React; // the app's files use the automatic JSX runtime and never import React
const { renderToStaticMarkup } = require('react-dom/server');
const { Sprite, Norppa } = require('../src/components/art.tsx');
const { CHARACTERS } = require('../src/content/index.ts');
const { colors } = require('../src/theme.ts');

/** The inside of the <svg> a component renders, without the wrapper */
function inner(el) {
  const html = renderToStaticMarkup(el);
  const m = html.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!m) throw new Error('no svg in output');
  return m[1];
}
const sprite = (id, mood, x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w * 1.2}" viewBox="-4 -6 108 130">${inner(React.createElement(Sprite, { id, mood }))}</svg>`;
const seal = (mood, burst, x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="-14 -14 148 148">${inner(React.createElement(Norppa, { mood, burst }))}</svg>`;

const DISPLAY = `font-family="Impact, Haettenschweiler, 'Arial Narrow Bold', 'Franklin Gothic Bold', 'Arial Black', sans-serif"`;
const LABEL = `font-family="'Arial Narrow', 'Helvetica Neue', Arial, sans-serif" font-weight="700"`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** A slanted label bar with a hard shadow, like the Tag component in the app */
function tag(text, x, y, { size = 20, bg = colors.gold, fg = colors.ink, rot = -2, pad = 12, font = DISPLAY } = {}) {
  const w = text.length * size * 0.56 + pad * 2;
  const h = size * 1.5;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <rect x="4" y="4" width="${w}" height="${h}" fill="${colors.ink}"/>
    <rect width="${w}" height="${h}" fill="${bg}" stroke="${colors.ink}" stroke-width="3"/>
    <text x="${w / 2}" y="${h * 0.72}" text-anchor="middle" font-size="${size}" fill="${fg}" letter-spacing="1.5" ${font}>${esc(text)}</text>
  </g>`;
}

const halftone = (id, color, op) => `<pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="7" cy="7" r="2.6" fill="${color}" opacity="${op}"/></pattern>`;

// ── Banner ──────────────────────────────────────────────────────────────────
function banner() {
  const W = 1280;
  const H = 440;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Taloksi. Asetu taloksi: settle in. Finnish, the way it is actually spoken.">
  <defs>${halftone('dots', '#FFFFFF', 0.07)}${halftone('dotsInk', colors.ink, 0.16)}</defs>
  <rect width="${W}" height="${H}" fill="${colors.night}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <!-- slanted colour slabs behind the cast -->
  <polygon points="700,0 1280,0 1280,440 560,440" fill="${colors.nightDeep}"/>
  <polygon points="780,0 960,0 820,440 640,440" fill="${colors.blue}"/>
  <polygon points="960,0 1100,0 960,440 820,440" fill="${colors.aurora}"/>
  <polygon points="1100,0 1280,0 1280,440 960,440" fill="${colors.red}"/>
  <polygon points="700,0 1280,0 1280,440 560,440" fill="url(#dotsInk)"/>
  <polygon points="560,440 700,0 712,0 572,440" fill="${colors.ink}"/>
  <!-- aurora streaks -->
  <polygon points="0,62 520,22 520,34 0,80" fill="${colors.aurora}" opacity="0.5"/>
  <polygon points="0,92 420,62 420,68 0,102" fill="${colors.berry}" opacity="0.55"/>

  <!-- wordmark: ink shadow, then paper -->
  <g transform="translate(64 232) skewX(-10)">
    <text x="9" y="9" font-size="168" fill="${colors.ink}" letter-spacing="2" ${DISPLAY}>TALOKSI</text>
    <text x="0" y="0" font-size="168" fill="${colors.paper}" stroke="${colors.ink}" stroke-width="5" paint-order="stroke" letter-spacing="2" ${DISPLAY}>TALOKSI</text>
  </g>
  <rect x="62" y="252" width="470" height="10" fill="${colors.gold}" stroke="${colors.ink}" stroke-width="3" transform="rotate(-1.5 62 252)"/>
  ${tag('ASETU TALOKSI · SETTLE IN', 66, 286, { size: 26, rot: -2 })}
  <text x="68" y="388" font-size="25" fill="${colors.paper}" ${LABEL}>Finnish, the way it is actually spoken.</text>
  <text x="68" y="418" font-size="19" fill="${colors.mutedOnNight}" ${LABEL}>The language · the tests · life in Finland</text>

  ${sprite('pekka', 'happy', 700, 150, 210)}
  ${sprite('aada', 'wink', 1060, 138, 220)}
  ${sprite('jere', 'excited', 880, 176, 215)}
  ${seal('excited', colors.gold, 630, 6, 172)}
  ${tag('MOI!', 792, 34, { size: 30, bg: colors.paper, rot: 5 })}
</svg>
`;
}

// ── Cast sheet ──────────────────────────────────────────────────────────────
function cast() {
  const perRow = 6;
  const cell = 206;
  const rowH = 262;
  const W = perRow * cell + 44;
  const rows = Math.ceil(CHARACTERS.length / perRow);
  const H = rows * rowH + 96;
  const moods = ['happy', 'excited', 'wink', 'happy', 'question', 'happy'];
  const cards = CHARACTERS.map((c, i) => {
    const r = Math.floor(i / perRow);
    const inRow = Math.min(perRow, CHARACTERS.length - r * perRow);
    const x0 = (W - inRow * cell) / 2;
    const x = x0 + (i % perRow) * cell + 18;
    const y = 84 + r * rowH;
    const mood = moods[(i * 5 + r) % moods.length];
    const art = c.avatar ? sprite(c.id, mood, x, y, 170) : `<svg x="${x}" y="${y}" width="170" height="204" viewBox="-4 -6 108 130">${inner(React.createElement(Sprite, { id: c.id, mood }))}</svg>`;
    const name = c.name.toUpperCase();
    const bg = c.adult ? colors.berry : colors.paper;
    return `${art}
    ${tag(name, x + 85 - (name.length * 19 * 0.56 + 20) / 2, y + 196, { size: 19, bg, fg: colors.ink, rot: i % 2 ? 2 : -2, pad: 10 })}
    <text x="${x + 85}" y="${y + 246}" text-anchor="middle" font-size="14.5" fill="${colors.mutedOnNight}" ${LABEL}>${esc(c.roleEn.split(',')[0].split(' from ')[0])}</text>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="The cast of Taloksi: seventeen characters">
  <defs>${halftone('dots', '#FFFFFF', 0.06)}</defs>
  <rect width="${W}" height="${H}" fill="${colors.night}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <polygon points="0,${H - 60} ${W},${H - 150} ${W},${H} 0,${H}" fill="${colors.nightDeep}"/>
  ${tag('HAHMOT · THE CAST', 26, 22, { size: 28, rot: -1.5 })}
  ${cards}
</svg>
`;
}

const out = path.join(root, 'docs', 'assets');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'banner.svg'), banner());
fs.writeFileSync(path.join(out, 'cast.svg'), cast());
for (const f of ['banner.svg', 'cast.svg']) console.log(f, Math.round(fs.statSync(path.join(out, f)).size / 1024) + ' KB');
