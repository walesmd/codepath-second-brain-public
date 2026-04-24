// Directory data file for src/posts/.
// When a post has `draft: true` in its frontmatter, this sets permalink to false
// so Eleventy skips writing the file to output entirely.
module.exports = {
  eleventyComputed: {
    permalink: data => data.draft ? false : undefined
  }
};
