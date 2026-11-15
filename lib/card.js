const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

const SECTIONS = [
  'Hook',
  'Setup',
  'Twist',
  'Terrain and tactics',
  'Ways out without a fight',
  'Ripple',
  'Reskin notes',
];
const TYPES = ['combat', 'social', 'exploration', 'puzzle', 'mixed'];
const TWIST_TYPES = ['hidden-truth', 'clock', 'shifting-ground', 'third-party', 'hard-choice', 'different-goal'];
const LEVELS = [1, 2, 3, 4, 5];

function splitSections(body) {
  const sections = {};
  let current = null;
  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^## +(.+?)\s*$/);
    if (heading) {
      current = heading[1];
      sections[current] = '';
    } else if (current) {
      sections[current] += line + '\n';
    }
  }
  for (const key of Object.keys(sections)) sections[key] = sections[key].trim();
  return sections;
}

function loadCard(filePath) {
  const parsed = matter(fs.readFileSync(filePath, 'utf8'));
  return {
    file: path.basename(filePath),
    data: parsed.data || {},
    sections: splitSections(parsed.content || ''),
  };
}

function loadAllCards(dir) {
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => loadCard(path.join(dir, name)));
}

module.exports = { loadCard, loadAllCards, splitSections, SECTIONS, TYPES, TWIST_TYPES, LEVELS };
