const { budgetFor, isSrdMonster, rosterXp } = require('./budget');
const { SECTIONS, TYPES, TWIST_TYPES, LEVELS } = require('./card');

const FIGHT_TYPES = ['combat', 'mixed'];

function validateCard(card) {
  const errors = [];
  const say = (message) => errors.push(`${card.file}: ${message}`);
  const data = card.data || {};
  const sections = card.sections || {};

  const expectedId = card.file.replace(/\.md$/, '');
  if (data.id !== expectedId) say(`id "${data.id}" does not match the file name`);
  if (!data.title || !String(data.title).trim()) say('title is missing');
  if (!TYPES.includes(data.type)) say(`type "${data.type}" is not one of ${TYPES.join(', ')}`);
  if (!TWIST_TYPES.includes(data.twist_type)) {
    say(`twist_type "${data.twist_type}" is not one of ${TWIST_TYPES.join(', ')}`);
  }
  if (typeof data.duration !== 'number' || data.duration < 20 || data.duration > 45) {
    say(`duration ${data.duration} is outside 20-45`);
  }
  if (!Array.isArray(data.terrain) || data.terrain.length === 0) say('terrain needs at least one tag');

  const levels = data.levels || {};
  for (const level of LEVELS) {
    const line = levels[level];
    if (!line) {
      say(`level ${level} is missing`);
      continue;
    }
    if (!line.plus5 || !String(line.plus5).trim()) say(`level ${level}: plus5 is missing`);
    if (typeof line.dc !== 'number') say(`level ${level}: dc is missing`);

    const roster = Array.isArray(line.roster) ? line.roster : [];
    let namesOk = true;
    for (const entry of roster) {
      if (!entry || !isSrdMonster(entry.name)) {
        say(`level ${level}: "${entry && entry.name}" is not an SRD 5.2.1 monster name`);
        namesOk = false;
      } else if (!Number.isInteger(entry.count) || entry.count < 1) {
        say(`level ${level}: count for "${entry.name}" must be a whole number of 1 or more`);
        namesOk = false;
      }
    }

    if (FIGHT_TYPES.includes(data.type)) {
      if (roster.length === 0) {
        say(`level ${level}: roster is empty`);
      } else if (namesOk) {
        const xp = rosterXp(roster);
        const budget = budgetFor(level, 4);
        if (xp > budget.high) say(`level ${level}: ${xp} XP is above the high budget (${budget.high})`);
        if (xp < budget.low) say(`level ${level}: ${xp} XP is below the low budget (${budget.low})`);
      }
    }
  }

  for (const name of SECTIONS) {
    if (!(name in sections)) say(`section "${name}" is missing`);
    else if (!sections[name].trim()) say(`${name} is empty`);
  }
  const tactics = (sections['Terrain and tactics'] || '').split('\n').filter((l) => l.trim());
  if (tactics.length > 3) say(`Terrain and tactics has ${tactics.length} lines, the limit is 3`);

  return errors;
}

module.exports = { validateCard };
