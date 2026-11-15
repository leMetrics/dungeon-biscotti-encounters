const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const out = path.join(root, '_site');
const prefixedOut = path.join(root, '_site_prefixed');

execSync('npx eleventy --quiet', { cwd: root, env: { ...process.env, PATH_PREFIX: '' }, stdio: 'pipe' });
execSync('npx eleventy --quiet --output=_site_prefixed', {
  cwd: root,
  env: { ...process.env, PATH_PREFIX: '/dungeon-biscotti-encounters/' },
  stdio: 'pipe',
});

const read = (...parts) => fs.readFileSync(path.join(...parts), 'utf8');
const html = read(out, 'cards', 'toll-bridge', 'index.html');
const indexHtml = read(out, 'index.html');
const cards = JSON.parse(read(out, 'cards.json'));
const TWIST_PHRASE = /alive and asleep/;

test('card page exists with five level rows', () => {
  for (const n of [1, 2, 3, 4, 5]) assert.match(html, new RegExp(`data-level="${n}"`));
});

test('twist and ripple are inside closed details', () => {
  assert.match(html, /<details class="dm-only">\s*<summary>DM only: Twist/);
  assert.match(html, /<details class="dm-only">\s*<summary>DM only: Ripple/);
  assert.doesNotMatch(html, /<details class="dm-only" open/);
});

test('twist text is on the page but not in head', () => {
  assert.match(html, TWIST_PHRASE);
  const head = html.split('</head>')[0];
  assert.doesNotMatch(head, TWIST_PHRASE);
  assert.doesNotMatch(head, /walked off in the night/);
  assert.match(head, /<title>The Toll Bridge · Dungeon Biscotti Encounters<\/title>/);
  assert.match(head, /<meta name="description" content="A rope bars an old stone bridge\./);
});

test('all rows visible without JavaScript', () => {
  assert.doesNotMatch(html, /data-level="\d"[^>]*hidden/);
});

test('level row shows roster, fifth player line and DC', () => {
  assert.match(html, /4 Bandits, 2 Toughs/);
  assert.match(html, /5th player: \+2 Bandits/);
  assert.match(html, /DC 12/);
});

test('cards.json has only public fields', () => {
  const allowed = ['id', 'title', 'type', 'duration', 'terrain', 'twist_type', 'hook', 'url'];
  assert.ok(cards.length > 0);
  for (const c of cards) assert.deepEqual(Object.keys(c).sort(), [...allowed].sort());
});

test('twist text is absent from index and cards.json', () => {
  assert.doesNotMatch(indexHtml + JSON.stringify(cards), TWIST_PHRASE);
});

test('index lists every card with filter attributes', () => {
  assert.match(indexHtml, /data-type="mixed"[^>]*data-terrain="river road"/);
  for (const c of cards) assert.match(indexHtml, new RegExp(`href="/cards/${c.id}/"`));
});

test('index has an empty-result message and works without JavaScript', () => {
  assert.match(indexHtml, /No encounters match these filters\./);
  assert.doesNotMatch(indexHtml, /<li[^>]*data-type="[^"]*"[^>]*\shidden[\s>=]/);
});

test('pages carry the SRD attribution', () => {
  for (const page of [html, indexHtml]) assert.match(page, /System Reference Document 5\.2\.1/);
});

test('links and assets respect the path prefix', () => {
  const prefixed = read(prefixedOut, 'index.html');
  assert.match(prefixed, /href="\/dungeon-biscotti-encounters\/cards\/toll-bridge\/"/);
  assert.match(prefixed, /href="\/dungeon-biscotti-encounters\/assets\/style\.css"/);
  assert.ok(fs.existsSync(path.join(prefixedOut, 'assets', 'fonts', 'alegreya-700.woff2')));
});

test('quotes in a hook are escaped once in the description', () => {
  const page = read(out, 'cards', 'wrong-ambush', 'index.html');
  assert.match(page, /<meta name="description" content="[^"]*&quot;Purses on the ground/);
  assert.doesNotMatch(page, /&amp;(quot|#39|amp);/);
});
