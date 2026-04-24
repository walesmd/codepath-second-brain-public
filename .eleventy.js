module.exports = function(eleventyConfig) {
  // Static assets passed through unchanged
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/gate.js");
  eleventyConfig.addPassthroughCopy("src/.nojekyll");

  // Relative URL filter: resolves a root-relative path to a path relative to
  // the current page, so assets load correctly from both file:// and https://.
  // Usage: {{ 'style.css' | relative(page.url) }}
  // Guard against non-string pageUrl (e.g. false when permalink: false is set on drafts).
  eleventyConfig.addFilter("relative", (assetPath, pageUrl) => {
    if (!pageUrl || typeof pageUrl !== "string") return assetPath.replace(/^\//, "");
    const depth = (pageUrl.match(/\//g) || []).length - 1;
    const prefix = "../".repeat(depth);
    return prefix + assetPath.replace(/^\//, "");
  });

  // Date filter: {{ date | date }} -> "April 18, 2026"
  //               {{ date | date("iso") }} -> "2026-04-18"
  eleventyConfig.addFilter("date", (dateObj, format = "long") => {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (format === "iso") return d.toISOString().slice(0, 10);
    return d.toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
    });
  });

  // Published posts only — excludes any post with draft: true in frontmatter.
  // Use collections.livePosts anywhere you want to list posts publicly.
  eleventyConfig.addCollection("livePosts", function(collectionApi) {
    return collectionApi.getFilteredByTag("post").filter(post => !post.data.draft);
  });

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      data: "_data"
    },
    pathPrefix: "/codepath-second-brain-public/",
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
