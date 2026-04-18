module.exports = function(eleventyConfig) {
  // Static assets passed through unchanged
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/.nojekyll");

  // Date filter: {{ date | date }} -> "April 18, 2026"
  //               {{ date | date("iso") }} -> "2026-04-18"
  eleventyConfig.addFilter("date", (dateObj, format = "long") => {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (format === "iso") return d.toISOString().slice(0, 10);
    return d.toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
    });
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
