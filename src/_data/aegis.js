// Reads stats committed by the AEGIS PDNS resolver via the GitHub Contents API.
// File is written hourly by scripts/push-aegis-stats.sh running on the
// resolver. If the file is missing or unparseable, falls back to capability
// text via { available: false }.

const fs = require("fs");
const path = require("path");

const STATS_PATH = path.join(__dirname, "aegis-stats.json");

module.exports = function () {
  const TAG = "[aegis]";
  const fallback = {
    available: false,
    queriesPerDay: null,
    threatsBlockedPerDay: null,
    lastUpdated: null,
  };

  try {
    const raw = fs.readFileSync(STATS_PATH, "utf8");
    const data = JSON.parse(raw);

    const queriesPerDay = Number(data.queriesPerDay);
    const threatsBlockedPerDay = Number(data.threatsBlockedPerDay);

    if (!Number.isFinite(queriesPerDay) || !Number.isFinite(threatsBlockedPerDay)) {
      console.warn(`${TAG} stats file present but fields invalid; falling back.`);
      return fallback;
    }

    console.log(`${TAG} loaded: queries=${queriesPerDay} blocked=${threatsBlockedPerDay} lastUpdated=${data.lastUpdated || "?"}`);
    return {
      available: true,
      queriesPerDay,
      threatsBlockedPerDay,
      lastUpdated: data.lastUpdated || null,
    };
  } catch (e) {
    if (e.code === "ENOENT") {
      console.warn(`${TAG} ${STATS_PATH} not found: falling back to capability text.`);
    } else {
      console.warn(`${TAG} read/parse error: ${e.message}: falling back.`);
    }
    return fallback;
  }
};
