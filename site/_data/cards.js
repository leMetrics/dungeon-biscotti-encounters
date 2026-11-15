const path = require('node:path');
const MarkdownIt = require('markdown-it');
const { loadAllCards, LEVELS } = require('../../lib/card');
const { rosterText } = require('../../lib/roster-text');

const md = new MarkdownIt({ html: false, breaks: true });

const TYPE_LABELS = { combat: 'Combat', social: 'Social', exploration: 'Exploration', puzzle: 'Puzzle', mixed: 'Mixed' };
const TWIST_LABELS = {
  'hidden-truth': 'Hidden truth',
  clock: 'Clock',
  'shifting-ground': 'Shifting ground',
  'third-party': 'Third party',
  'hard-choice': 'Hard choice',
  'different-goal': 'Different goal',
};

const plain = (text) => text.replace(/\s+/g, ' ').trim();

module.exports = () =>
  loadAllCards(path.join(__dirname, '..', '..', 'cards')).map(({ data, sections }) => ({
    id: data.id,
    title: data.title,
    type: data.type,
    typeLabel: TYPE_LABELS[data.type] || data.type,
    duration: data.duration,
    terrain: data.terrain || [],
    twist_type: data.twist_type,
    twistLabel: TWIST_LABELS[data.twist_type] || data.twist_type,
    hook: plain(sections.Hook || ''),
    hasHazard: LEVELS.some((n) => data.levels[n] && data.levels[n].hazard),
    levels: LEVELS.map((n) => {
      const line = data.levels[n] || {};
      return {
        level: n,
        roster: rosterText(line.roster),
        plus5: line.plus5,
        dc: line.dc,
        hazard: line.hazard || '',
      };
    }),
    html: {
      hook: md.render(sections.Hook || ''),
      setup: md.render(sections.Setup || ''),
      twist: md.render(sections.Twist || ''),
      tactics: md.render(sections['Terrain and tactics'] || ''),
      waysOut: md.render(sections['Ways out without a fight'] || ''),
      ripple: md.render(sections.Ripple || ''),
      reskin: md.render(sections['Reskin notes'] || ''),
    },
  }));
