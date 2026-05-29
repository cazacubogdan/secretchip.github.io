// Build-time fetch of the public AEGIS DNS statistics.
// Reads the [LastWeek] section only; [LastDay] and [LastMonth] are ignored
// (per product decision; they also currently return status=error upstream).
//
// Returns { available: false } on any problem so the build never breaks
// (e.g. when offline). On GitHub Actions (Node 20) global fetch is available
// and this runs during the Pages build, baking the numbers into the HTML.

const STATS_URL =
  "https://raw.githubusercontent.com/secretchip/AEGIS-DNS/refs/heads/main/public_dns_statistics/stats.txt";

function parseIni(text) {
  const out = {};
  let cur = null;
  String(text).split(/\r?\n/).forEach((raw) => {
    const line = raw.trim();
    if (!line || line[0] === "#") return;
    const sec = line.match(/^\[(.+)\]$/);
    if (sec) { cur = sec[1]; out[cur] = {}; return; }
    const i = line.indexOf("=");
    if (i > 0 && cur) out[cur][line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return out;
}

function num(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function compact(v) {
  v = Number(v);
  if (v >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(v);
}

module.exports = async function () {
  const TAG = "[aegis-stats]";
  const fallback = { available: false };

  if (typeof fetch !== "function") {
    console.warn(`${TAG} no global fetch available; skipping (strip will hydrate client-side).`);
    return fallback;
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(STATS_URL, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) {
      console.warn(`${TAG} HTTP ${res.status}; falling back.`);
      return fallback;
    }
    const s = parseIni(await res.text()).LastWeek;
    if (!s || s.status !== "ok") {
      console.warn(`${TAG} LastWeek not ok; falling back.`);
      return fallback;
    }
    const q = num(s.totalQueries);
    const blocked = num(s.totalBlocked);
    const blocklist = num(s.blockListZones);
    const cached = num(s.totalCached);
    if (q == null) return fallback;

    const out = {
      available: true,
      queries: compact(q),
      blocked: blocked != null ? blocked.toLocaleString("en-US") : "—",
      blocklist: blocklist != null ? compact(blocklist) : "—",
      cache: cached != null ? Math.round((cached / q) * 100) + "%" : "—",
    };
    console.log(`${TAG} loaded: ${out.queries} queries, ${out.blocked} blocked, ${out.blocklist} blocklist, ${out.cache} cache`);
    return out;
  } catch (e) {
    clearTimeout(timer);
    console.warn(`${TAG} ${e.message}; falling back.`);
    return fallback;
  }
};
