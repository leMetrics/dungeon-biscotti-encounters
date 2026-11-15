const path = require('node:path');
const { loadAllCards } = require('../lib/card');
const { validateCard } = require('../lib/validate-card');

const dir = path.join(__dirname, '..', 'cards');
const cards = loadAllCards(dir);
const errors = cards.flatMap(validateCard);

const ids = new Set();
for (const card of cards) {
  if (ids.has(card.data.id)) errors.push(`${card.file}: id "${card.data.id}" is used by another card`);
  ids.add(card.data.id);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s) in ${cards.length} card(s).`);
  process.exit(1);
}
console.log(`${cards.length} card(s) valid.`);
