module.exports = class {
  data() {
    return { permalink: 'cards.json', eleventyExcludeFromCollections: true };
  }

  render({ cards }) {
    return JSON.stringify(
      cards.map((c) => ({
        id: c.id,
        title: c.title,
        type: c.type,
        duration: c.duration,
        terrain: c.terrain,
        twist_type: c.twist_type,
        hook: c.hook,
        url: `cards/${c.id}/`,
      })),
      null,
      2
    );
  }
};
