const IRREGULAR = { Wolf: 'Wolves', Infantry: 'Infantry' };

function pluralWord(word) {
  if (IRREGULAR[word]) return IRREGULAR[word];
  if (/(s|x|ch|sh)$/.test(word)) return word + 'es';
  return word + 's';
}

function plural(name) {
  const [head, ...rest] = name.split(' of ');
  const words = head.split(' ');
  words[words.length - 1] = pluralWord(words[words.length - 1]);
  return [words.join(' '), ...rest].join(' of ');
}

function rosterText(roster) {
  if (!Array.isArray(roster) || roster.length === 0) return 'No creatures';
  return roster.map((e) => `${e.count} ${e.count === 1 ? e.name : plural(e.name)}`).join(', ');
}

module.exports = { rosterText, plural };
