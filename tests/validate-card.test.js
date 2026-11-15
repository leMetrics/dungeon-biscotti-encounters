const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { validateCard } = require('../lib/validate-card');
const { loadCard } = require('../lib/card');
const { rosterText } = require('../lib/roster-text');

const combat = () => ({
  file: 'sample.md',
  data: {
    id: 'sample',
    title: 'Sample',
    type: 'combat',
    duration: 30,
    terrain: ['road'],
    twist_type: 'clock',
    levels: {
      1: { roster: [{ name: 'Bandit', count: 4 }, { name: 'Tough', count: 2 }], plus5: '+1 Bandit', dc: 12 },
      2: { roster: [{ name: 'Bandit Captain', count: 1 }, { name: 'Bandit', count: 4 }], plus5: '+1 Tough', dc: 12 },
      3: { roster: [{ name: 'Bandit Captain', count: 1 }, { name: 'Tough', count: 3 }, { name: 'Bandit', count: 2 }], plus5: '+1 Tough', dc: 13 },
      4: { roster: [{ name: 'Tough Boss', count: 1 }, { name: 'Tough', count: 4 }], plus5: '+2 Toughs', dc: 14 },
      5: { roster: [{ name: 'Gladiator', count: 1 }, { name: 'Tough Boss', count: 1 }, { name: 'Tough', count: 2 }], plus5: '+1 Bandit Captain', dc: 15 },
    },
  },
  sections: {
    Hook: 'x',
    Setup: 'x',
    Twist: 'x',
    'Terrain and tactics': 'a\nb',
    'Ways out without a fight': 'x',
    Ripple: 'x',
    'Reskin notes': 'x',
  },
});

const social = () => {
  const c = combat();
  c.data.type = 'social';
  for (const n of [1, 2, 3, 4, 5]) c.data.levels[n].roster = [];
  return c;
};

const v = (card) => validateCard(card).join('\n');

test('valid combat card passes', () => assert.deepEqual(validateCard(combat()), []));

test('social card with no creatures passes', () => assert.deepEqual(validateCard(social()), []));

test('social card with rosters missing entirely passes', () => {
  const c = social();
  for (const n of [1, 2, 3, 4, 5]) delete c.data.levels[n].roster;
  assert.deepEqual(validateCard(c), []);
});

test('combat card with an empty roster fails', () => {
  const c = combat();
  c.data.levels[2].roster = [];
  assert.match(v(c), /sample\.md: level 2: roster is empty/);
});

test('missing level is named', () => {
  const c = combat();
  delete c.data.levels[5];
  assert.match(v(c), /sample\.md: level 5 is missing/);
});

test('missing +5th is named', () => {
  const c = combat();
  c.data.levels[3].plus5 = '';
  assert.match(v(c), /sample\.md: level 3: plus5 is missing/);
});

test('wrong-case monster is rejected by name', () => {
  const c = combat();
  c.data.levels[1].roster[0].name = 'bandit';
  assert.match(v(c), /sample\.md: level 1: "bandit" is not an SRD 5\.2\.1 monster name/);
});

test('over-budget roster is rejected', () => {
  const c = combat();
  c.data.levels[1].roster = [{ name: 'Ogre', count: 1 }];
  assert.match(v(c), /sample\.md: level 1: 450 XP is above the high budget \(400\)/);
});

test('under-budget roster is rejected', () => {
  const c = combat();
  c.data.levels[5].roster = [{ name: 'Bandit', count: 3 }];
  assert.match(v(c), /sample\.md: level 5: 75 XP is below the low budget \(2000\)/);
});

test('empty Ways out section is rejected', () => {
  const c = combat();
  c.sections['Ways out without a fight'] = '  ';
  assert.match(v(c), /sample\.md: Ways out without a fight is empty/);
});

test('missing section is rejected', () => {
  const c = combat();
  delete c.sections.Ripple;
  assert.match(v(c), /sample\.md: section "Ripple" is missing/);
});

test('more than three tactics lines is rejected', () => {
  const c = combat();
  c.sections['Terrain and tactics'] = 'a\nb\nc\nd';
  assert.match(v(c), /sample\.md: Terrain and tactics has 4 lines, the limit is 3/);
});

test('bad type, twist type, duration and id are rejected', () => {
  const c = combat();
  c.data.type = 'fight';
  c.data.twist_type = 'surprise';
  c.data.duration = 90;
  c.data.id = 'other';
  const out = v(c);
  assert.match(out, /type "fight" is not one of/);
  assert.match(out, /twist_type "surprise" is not one of/);
  assert.match(out, /duration 90 is outside 20-45/);
  assert.match(out, /id "other" does not match the file name/);
});

test('a card with no front matter reports errors instead of crashing', () => {
  const out = validateCard({ file: 'empty.md', data: {}, sections: {} });
  assert.ok(out.length > 0);
});

test('loadCard reads fields and sections from a real card', () => {
  const card = loadCard(path.join(__dirname, '..', 'cards', 'toll-bridge.md'));
  assert.equal(card.file, 'toll-bridge.md');
  assert.equal(card.data.id, 'toll-bridge');
  assert.ok(card.sections.Twist.includes('alive and asleep'));
  assert.deepEqual(validateCard(card), []);
});

test('rosterText pluralises monster names', () => {
  assert.equal(rosterText([{ name: 'Bandit', count: 3 }, { name: 'Tough', count: 1 }]), '3 Bandits, 1 Tough');
  assert.equal(rosterText([{ name: 'Wolf', count: 2 }, { name: 'Goblin Boss', count: 2 }]), '2 Wolves, 2 Goblin Bosses');
  assert.equal(rosterText([{ name: 'Rug of Smothering', count: 2 }]), '2 Rugs of Smothering');
  assert.equal(rosterText([]), 'No creatures');
});
