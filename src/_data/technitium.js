// Pulled at build time from the Technitium DNS Server admin API.
// Configured via env vars TECHNITIUM_API_URL and TECHNITIUM_API_TOKEN
// (set in GitHub Actions secrets). When either is missing or the API is
// unreachable, falls back to { available: false } so templates can render
// capability text instead of empty numbers.

module.exports = async function () {
  const fallback = {
    available: false,
    queriesPerDay: null,
    threatsBlockedPerDay: null,
    lastUpdated: new Date().toISOString(),
  };

  const base = process.env.TECHNITIUM_API_URL;
  const token = process.env.TECHNITIUM_API_TOKEN;
  if (!base || !token) return fallback;

  const url = base.replace(/\/$/, "") + "/api/dashboard/stats/get?type=LastDay";
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);

  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return fallback;

    const data = await res.json();
    const stats =
      (data && data.response && data.response.stats) ||
      (data && data.stats) ||
      null;
    if (!stats) return fallback;

    return {
      available: true,
      queriesPerDay: Number(stats.totalQueries) || 0,
      threatsBlockedPerDay: Number(stats.totalBlocked) || 0,
      lastUpdated: new Date().toISOString(),
    };
  } catch (_e) {
    clearTimeout(timer);
    return fallback;
  }
};
