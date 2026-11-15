const loadCards = require('./cards');

module.exports = () => {
  const cards = loadCards();
  const unique = (values) => [...new Set(values)].sort();
  const labels = (key, labelKey) =>
    unique(cards.map((c) => c[key])).map((id) => ({ id, label: cards.find((c) => c[key] === id)[labelKey] }));
  return {
    types: labels('type', 'typeLabel'),
    twists: labels('twist_type', 'twistLabel'),
    terrains: unique(cards.flatMap((c) => c.terrain)),
  };
};
