const test = require('node:test');
const assert = require('node:assert/strict');
const { budgetFor, rosterXp, isSrdMonster, monsterXp } = require('../lib/budget');

test('budget for 4 level-1 characters', () => {
  assert.deepEqual(budgetFor(1, 4), { low: 200, moderate: 300, high: 400 });
});

test('budget for 4 level-5 characters', () => {
  assert.deepEqual(budgetFor(5, 4), { low: 2000, moderate: 3000, high: 4400 });
});

test('fifth player adds one character share', () => {
  assert.equal(budgetFor(3, 5).moderate, (budgetFor(3, 4).moderate / 4) * 5);
});

test('budgetFor rejects levels outside 1-5', () => {
  assert.throws(() => budgetFor(6, 4), /No budget for level 6/);
});

test('rosterXp sums count x xp', () => {
  assert.equal(monsterXp('Bandit'), 25);
  assert.equal(rosterXp([{ name: 'Bandit', count: 3 }, { name: 'Tough', count: 1 }]), 175);
});

test('rosterXp rejects unknown monster', () => {
  assert.throws(() => rosterXp([{ name: 'Beholder', count: 1 }]), /Unknown monster: Beholder/);
});

test('isSrdMonster is case-sensitive', () => {
  assert.equal(isSrdMonster('Bandit'), true);
  assert.equal(isSrdMonster('bandit'), false);
  assert.equal(isSrdMonster('_note'), false);
});
