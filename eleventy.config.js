const fonts = {
  'node_modules/@fontsource/alegreya/files/alegreya-latin-500-normal.woff2': 'alegreya-500.woff2',
  'node_modules/@fontsource/alegreya/files/alegreya-latin-700-normal.woff2': 'alegreya-700.woff2',
  'node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff2': 'source-sans-3-400.woff2',
  'node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-400-italic.woff2': 'source-sans-3-400-italic.woff2',
  'node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-600-normal.woff2': 'source-sans-3-600.woff2',
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'site/assets': 'assets' });
  for (const [from, name] of Object.entries(fonts)) {
    eleventyConfig.addPassthroughCopy({ [from]: `assets/fonts/${name}` });
  }
  eleventyConfig.addWatchTarget('cards/');

  return {
    dir: { input: 'site', output: '_site', includes: '_includes', data: '_data' },
    pathPrefix: process.env.PATH_PREFIX || '/',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
