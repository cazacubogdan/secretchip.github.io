// Generates /sitemap.xml from all built pages. JS template so the output
// starts exactly with the XML prolog (no leading whitespace).
module.exports = class {
  data() {
    return {
      permalink: "/sitemap.xml",
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections, site }) {
    const urls = (collections.all || [])
      .map((p) => `  <url><loc>${site.url}${p.url}</loc></url>`)
      .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  }
};
