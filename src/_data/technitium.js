// Pulled at build time from the Technitium DNS Server admin API.
// Configured via env vars TECHNITIUM_API_URL and TECHNITIUM_API_TOKEN
// (set in GitHub Actions secrets). When either is missing or the API is
// unreachable, falls back to { available: false } so templates can render
// capability text instead of empty numbers.

module.exports = async function () {
  const TAG = "[technitium]";
  const fallback = {
    available: false,
    queriesPerDay: null,
    threatsBlockedPerDay: null,
    lastUpdated: new Date().toISOString(),
  };

  // Outer try/catch — guarantees we NEVER reject to Eleventy. The build
  // will always render the fallback rather than fail, even on programmer
  // error inside this file.
  try {
    const base = process.env.TECHNITIUM_API_URL;
    const token = process.env.TECHNITIUM_API_TOKEN;

    if (!base || !token) {
      console.warn(
        `${TAG} env vars missing — TECHNITIUM_API_URL=${base ? "set" : "missing"} TECHNITIUM_API_TOKEN=${token ? "set" : "missing"}. Falling back to capability text.`
      );
      return fallback;
    }

    const url = base.replace(/\/$/, "") + "/api/dashboard/stats/get?type=LastDay";
    console.log(`${TAG} fetching ${url.replace(/token=[^&]*/i, "token=***")}`);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);

    let res;
    try {
      res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        signal: ctrl.signal,
      });
    } catch (e) {
      clearTimeout(timer);
      const cause = e && e.cause ? ` cause=${e.cause.code || e.cause.name || ""}: ${e.cause.message || e.cause}` : "";
      console.warn(`${TAG} network error: ${e && e.name ? e.name + ": " : ""}${e && e.message ? e.message : String(e)}${cause}`);
      return fallback;
    }
    clearTimeout(timer);

    const ct = res.headers && res.headers.get ? (res.headers.get("content-type") || "") : "";

    if (!res.ok) {
      let bodySnippet = "";
      try {
        const text = await res.text();
        bodySnippet = (text || "").slice(0, 200).replace(/\s+/g, " ");
      } catch (_) {}
      console.warn(`${TAG} HTTP ${res.status} ${res.statusText} content-type="${ct}" body[0..200]="${bodySnippet}"`);
      return fallback;
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      console.warn(`${TAG} JSON parse failed (content-type="${ct}"): ${e && e.message ? e.message : String(e)}`);
      return fallback;
    }

    if (data && data.status && data.status !== "ok") {
      console.warn(`${TAG} API status="${data.status}" errorMessage="${data.errorMessage || ""}"`);
      return fallback;
    }

    const stats =
      (data && data.response && data.response.stats) ||
      (data && data.stats) ||
      null;

    if (!stats) {
      console.warn(`${TAG} response missing stats object. top-level keys=${Object.keys(data || {}).join(",")} response keys=${data && data.response ? Object.keys(data.response).join(",") : "(no response)"}`);
      return fallback;
    }

    const queriesPerDay = Number(stats.totalQueries) || 0;
    const threatsBlockedPerDay = Number(stats.totalBlocked) || 0;
    console.log(`${TAG} ok — queries=${queriesPerDay} blocked=${threatsBlockedPerDay}`);

    return {
      available: true,
      queriesPerDay,
      threatsBlockedPerDay,
      lastUpdated: new Date().toISOString(),
    };
  } catch (e) {
    console.warn(`${TAG} unexpected: ${e && e.stack ? e.stack : String(e)}`);
    return fallback;
  }
};
