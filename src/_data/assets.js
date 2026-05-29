// Content-hash fingerprints for static assets, so their URLs change only
// when the file content changes. Used to cache-bust the CSS/JS links
// (?v=hash) — prevents browsers from serving a stale stylesheet/script
// after a deploy. Falls back to a timestamp if a file can't be read.

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

function hash(relPath) {
  try {
    const buf = fs.readFileSync(path.join(__dirname, "..", relPath));
    return crypto.createHash("md5").update(buf).digest("hex").slice(0, 10);
  } catch (e) {
    return String(Date.now());
  }
}

module.exports = {
  css: hash("assets/css/site.css"),
  js: hash("assets/js/site.js"),
};
