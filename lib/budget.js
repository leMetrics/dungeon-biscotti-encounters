const budgetData = require('./budget-data.json');
const monstersByCr = require('./srd-monsters.json');

const xpByName = new Map();
for (const [cr, names] of Object.entries(monstersByCr)) {
  if (!Array.isArray(names)) continue;
  for (const name of names) xpByName.set(name, budgetData.xpByCr[cr]);
}

function budgetFor(level, players = 4) {
  const perCharacter = budgetData.perCharacter[String(level)];
  if (!perCharacter) throw new RangeError(`No budget for level ${level}`);
  return {
    low: perCharacter.low * players,
    moderate: perCharacter.moderate * players,
    high: perCharacter.high * players,
  };
}

function isSrdMonster(name) {
  return xpByName.has(name);
}

function monsterXp(name) {
  if (!isSrdMonster(name)) throw new Error(`Unknown monster: ${name}`);
  return xpByName.get(name);
}

function rosterXp(roster) {
  return roster.reduce((sum, entry) => sum + monsterXp(entry.name) * entry.count, 0);
}

module.exports = { budgetFor, isSrdMonster, monsterXp, rosterXp };
