// SecretChip site — page-aware shared script. No dependencies.
(function () {
  function $(id) { return document.getElementById(id); }

  document.addEventListener("DOMContentLoaded", function () {
    var y = $("year");
    if (y) y.textContent = String(new Date().getFullYear());

    bindLightbox();
    initRevealEmail();
    initResolverSelector();
    initCookieConsent();
  });

  // --------------------------------------------
  // Resolver selector — drives /aegis-pdns/test/
  // --------------------------------------------
  function initResolverSelector() {
    var sel = $("resolverSelect");
    var input = $("verifyDohUrl");
    var modeLabel = $("resolverMode");
    if (!sel || !input) return;

    function sync() {
      var opt = sel.options[sel.selectedIndex];
      input.value = sel.value;
      var m = opt && opt.getAttribute("data-mode") || "filtered";
      input.setAttribute("data-mode", m);
      if (modeLabel) modeLabel.textContent = m;
    }

    sel.addEventListener("change", sync);
    sync();
  }

  function getVerifyUrl() {
    var input = $("verifyDohUrl");
    if (!input) return "";
    var v = input.value || input.textContent || "";
    return v.trim();
  }

  function getVerifyMode() {
    var input = $("verifyDohUrl");
    if (!input) return "filtered";
    return (input.getAttribute("data-mode") || "filtered").toLowerCase();
  }

  // --------------------------------------------
  // Cookie consent — banner + preferences panel
  // Ports old/lib/cookie-prefs.ts + old/components/cookies.tsx
  // --------------------------------------------
  var COOKIE_PREFS_KEY = "secretchip-cookie-prefs";
  var COOKIE_CONSENT_KEY = "secretchip-cookie-consent";
  var defaultCookiePrefs = { necessary: true, analytics: false, embeds: false };

  function parseCookiePrefs(raw) {
    if (!raw) return Object.assign({}, defaultCookiePrefs);
    try {
      var p = JSON.parse(raw);
      return {
        necessary: true,
        analytics: Boolean(p && p.analytics),
        embeds: Boolean(p && p.embeds),
      };
    } catch (_e) {
      return Object.assign({}, defaultCookiePrefs);
    }
  }

  function loadCookiePrefs() {
    try { return parseCookiePrefs(localStorage.getItem(COOKIE_PREFS_KEY)); }
    catch (_e) { return Object.assign({}, defaultCookiePrefs); }
  }

  function saveCookiePrefs(prefs) {
    try {
      localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(prefs));
      localStorage.setItem(COOKIE_CONSENT_KEY, "set");
    } catch (_e) {}
  }

  function withdrawCookieConsent() {
    try {
      localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(defaultCookiePrefs));
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    } catch (_e) {}
  }

  function hasCookieConsent() {
    try { return localStorage.getItem(COOKIE_CONSENT_KEY) === "set"; }
    catch (_e) { return false; }
  }

  function initCookieConsent() {
    var banner = $("cookie-banner");
    if (banner) {
      if (!hasCookieConsent()) banner.classList.add("is-open");
      banner.addEventListener("click", function (e) {
        var t = e.target;
        if (!(t instanceof HTMLElement)) return;
        var action = t.getAttribute("data-cookie-action");
        if (!action) return;
        if (action === "accept") {
          saveCookiePrefs({ necessary: true, analytics: true, embeds: true });
        } else if (action === "reject") {
          saveCookiePrefs(Object.assign({}, defaultCookiePrefs));
        }
        banner.classList.remove("is-open");
      });
    }

    var mount = document.querySelector("[data-cookie-prefs-panel]");
    if (mount) renderCookiePrefsPanel(mount);
  }

  function renderCookiePrefsPanel(mount) {
    var prefs = loadCookiePrefs();

    function row(key, title, locked, hint) {
      var checked = prefs[key] ? "checked" : "";
      var disabled = locked ? "disabled" : "";
      return (
        '<div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:14px;">' +
          '<div>' +
            '<h3 style="margin:0;font-size:15px;color:var(--text-strong);font-weight:600;">' + title + '</h3>' +
            '<p class="mini" style="margin:6px 0 0;">' + hint + '</p>' +
          '</div>' +
          '<input type="checkbox" data-cookie-key="' + key + '" ' + checked + ' ' + disabled +
          ' style="width:20px;height:20px;accent-color:var(--accent);" />' +
        '</div>'
      );
    }

    mount.innerHTML =
      '<p class="mini">Strictly necessary cookies are always active. You can opt in or out of optional categories below.</p>' +
      row("necessary", "Strictly necessary", true, "Required for core functionality and security.") +
      row("analytics", "Analytics (optional)", false, "Future-ready category. Enable when you want this behavior.") +
      row("embeds", "Third-party embedded content (optional)", false, "Future-ready category. Enable when you want this behavior.") +
      '<div class="btnrow">' +
        '<button type="button" class="btn primary" data-cookie-prefs-save>Save preferences</button>' +
        '<button type="button" class="btn purple" data-cookie-prefs-withdraw>Withdraw optional consent</button>' +
        '<span class="mini" data-cookie-prefs-status role="status" aria-live="polite"></span>' +
      '</div>';

    var status = mount.querySelector("[data-cookie-prefs-status]");

    mount.querySelectorAll('input[type="checkbox"]').forEach(function (el) {
      el.addEventListener("change", function () {
        var key = el.getAttribute("data-cookie-key");
        if (key && key !== "necessary") prefs[key] = el.checked;
      });
    });

    var saveBtn = mount.querySelector("[data-cookie-prefs-save]");
    var withdrawBtn = mount.querySelector("[data-cookie-prefs-withdraw]");

    saveBtn.addEventListener("click", function () {
      saveCookiePrefs(prefs);
      if (status) { status.textContent = "Preferences saved."; setTimeout(function(){ status.textContent = ""; }, 2500); }
    });

    withdrawBtn.addEventListener("click", function () {
      withdrawCookieConsent();
      prefs = Object.assign({}, defaultCookiePrefs);
      mount.querySelectorAll('input[type="checkbox"]').forEach(function (el) {
        var key = el.getAttribute("data-cookie-key");
        if (key !== "necessary") el.checked = false;
      });
      if (status) { status.textContent = "Optional consent withdrawn. Banner will reappear."; setTimeout(function(){ status.textContent = ""; }, 3500); }
    });
  }

  // ------------------------------------------------------------------
  // Clipboard helper (used by index/setup endpoint blocks)
  // ------------------------------------------------------------------
  window.copyText = async function (elementId) {
    var el = $(elementId);
    var text = el ? (el.textContent || "").trim() : "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      flash(elementId, "Copied");
    } catch (_e) {
      flash(elementId, "Copy failed");
    }
  };

  function flash(elementId, msg) {
    var holder = document.querySelector('[data-flash-for="' + elementId + '"]');
    if (!holder) return;
    holder.textContent = msg;
    holder.classList.add("visible");
    setTimeout(function () { holder.classList.remove("visible"); holder.textContent = ""; }, 1500);
  }

  // ------------------------------------------------------------------
  // Index page — quick health line
  // ------------------------------------------------------------------
  window.setHealth = function (msg, level) {
    var led = $("led"); var t = $("healthText");
    if (t) t.textContent = msg;
    if (!led) return;
    led.classList.remove("ok", "bad");
    if (level === "ok") led.classList.add("ok");
    if (level === "bad") led.classList.add("bad");
  };

  window.testDoh = async function () {
    var urlEl = $("dohUrl");
    var url = urlEl ? (urlEl.textContent || "").trim() : "";
    if (!url) return;
    window.setHealth("Testing DoH endpoint…", "");
    try {
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, 5000);
      await fetch(url, { method: "GET", mode: "no-cors", signal: ctrl.signal });
      clearTimeout(timer);
      window.setHealth("Reachable from this network.", "ok");
    } catch (_e) {
      window.setHealth("Not reachable, or blocked by firewall.", "bad");
    }
  };

  // ------------------------------------------------------------------
  // Lightbox
  // ------------------------------------------------------------------
  var lb = null;
  function ensureLightbox() {
    if (lb) return lb;
    var overlay = document.createElement("div");
    overlay.id = "sc-lightbox";
    Object.assign(overlay.style, {
      position: "fixed", inset: "0", background: "rgba(0,0,0,0.72)",
      display: "none", alignItems: "center", justifyContent: "center",
      padding: "18px", zIndex: "9999"
    });
    var box = document.createElement("div");
    Object.assign(box.style, { maxWidth: "980px", width: "100%", maxHeight: "92vh", display: "grid", gap: "10px" });
    var img = document.createElement("img");
    Object.assign(img.style, {
      width: "100%", height: "auto", maxHeight: "82vh", objectFit: "contain",
      borderRadius: "14px", border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 14px 40px rgba(0,0,0,0.45)", background: "rgba(255,255,255,0.04)"
    });
    var caption = document.createElement("div");
    Object.assign(caption.style, { color: "rgba(255,255,255,0.78)", fontSize: "13px", lineHeight: "1.4", textAlign: "center" });
    box.appendChild(img); box.appendChild(caption); overlay.appendChild(box);
    function close() { overlay.style.display = "none"; img.src = ""; caption.textContent = ""; }
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    document.body.appendChild(overlay);
    lb = { open: function (src, cap) { img.src = src; caption.textContent = cap || ""; overlay.style.display = "flex"; }, close: close };
    return lb;
  }
  function bindLightbox() {
    var nodes = document.querySelectorAll("[data-lightbox]");
    if (!nodes.length) return;
    var l = ensureLightbox();
    nodes.forEach(function (n) {
      n.addEventListener("click", function (e) {
        e.preventDefault();
        var src = n.getAttribute("data-lightbox");
        var cap = n.getAttribute("data-caption") || "";
        if (src) l.open(src, cap);
      });
    });
  }

  // ------------------------------------------------------------------
  // DoH binary helpers (RFC 8484, GET with base64url ?dns=)
  // ------------------------------------------------------------------
  function base64UrlEncode(bytes) {
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function buildDnsQuery(name, qtype) {
    var id = Math.floor(Math.random() * 65536);
    var flags = 0x0100; // RD
    var parts = name.split(".").filter(Boolean);
    var qnameLen = 1;
    for (var i = 0; i < parts.length; i++) qnameLen += 1 + parts[i].length;
    var buf = new Uint8Array(12 + qnameLen + 4);
    var dv = new DataView(buf.buffer);
    dv.setUint16(0, id);
    dv.setUint16(2, flags);
    dv.setUint16(4, 1);
    dv.setUint16(6, 0);
    dv.setUint16(8, 0);
    dv.setUint16(10, 0);
    var off = 12;
    for (var p = 0; p < parts.length; p++) {
      var s = parts[p];
      buf[off++] = s.length;
      for (var j = 0; j < s.length; j++) buf[off++] = s.charCodeAt(j);
    }
    buf[off++] = 0;
    dv.setUint16(off, qtype);
    dv.setUint16(off + 2, 1); // IN
    return buf;
  }

  function skipName(u8, off) {
    while (true) {
      if (off >= u8.length) return u8.length;
      var len = u8[off];
      if ((len & 0xC0) === 0xC0) return off + 2;
      if (len === 0) return off + 1;
      off = off + 1 + len;
    }
  }

  function ipv6FromBytes(u8, off) {
    var parts = [];
    for (var i = 0; i < 16; i += 2) parts.push(((u8[off + i] << 8) | u8[off + i + 1]).toString(16));
    return parts.join(":");
  }

  function parseDnsResponseAny(u8) {
    if (!u8 || u8.length < 12) return { ok: false, reason: "Response too small" };
    var dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    var flags = dv.getUint16(2);
    var rcode = flags & 0x000F;
    var qd = dv.getUint16(4);
    var an = dv.getUint16(6);
    var off = 12;
    for (var i = 0; i < qd; i++) {
      off = skipName(u8, off);
      off += 4;
      if (off > u8.length) return { ok: false, reason: "Truncated while skipping question" };
    }
    var ips4 = []; var ips6 = [];
    for (var k = 0; k < an; k++) {
      off = skipName(u8, off);
      if (off + 10 > u8.length) break;
      var type = dv.getUint16(off); off += 2;
      var cls = dv.getUint16(off); off += 2;
      off += 4; // TTL
      var rdlen = dv.getUint16(off); off += 2;
      if (off + rdlen > u8.length) break;
      if (type === 1 && cls === 1 && rdlen === 4) {
        ips4.push(u8[off] + "." + u8[off + 1] + "." + u8[off + 2] + "." + u8[off + 3]);
      }
      if (type === 28 && cls === 1 && rdlen === 16) {
        ips6.push(ipv6FromBytes(u8, off));
      }
      off += rdlen;
    }
    return { ok: true, rcode: rcode, ancount: an, ips4: ips4, ips6: ips6 };
  }

  async function dohQuery(dohBase, name, qtype) {
    var q = buildDnsQuery(name, qtype);
    var dnsParam = base64UrlEncode(q);
    var joiner = (dohBase.indexOf("?") !== -1) ? "&" : "?";
    var url = dohBase + joiner + "dns=" + encodeURIComponent(dnsParam);
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 6000);
    try {
      var r = await fetch(url, {
        method: "GET",
        headers: { "accept": "application/dns-message" },
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (!r.ok) return { ok: false, http: r.status, reason: r.statusText || "HTTP error" };
      var ct = (r.headers && r.headers.get) ? (r.headers.get("content-type") || "") : "";
      if (ct && ct.toLowerCase().indexOf("application/dns-message") === -1) {
        return { ok: false, http: r.status, reason: "Unexpected content-type: " + ct };
      }
      var ab = await r.arrayBuffer();
      return { ok: true, parsed: parseDnsResponseAny(new Uint8Array(ab)) };
    } catch (_e) {
      clearTimeout(timer);
      return { ok: false, reason: "Network or endpoint error" };
    }
  }

  async function publicDnsResolves(hostname) {
    var doh = "https://cloudflare-dns.com/dns-query";
    try {
      var a = await dohQuery(doh, hostname, 1);
      if (a.ok && a.parsed && a.parsed.ok && a.parsed.rcode === 0 && (a.parsed.ips4 || []).length) {
        return { ok: true, via: "A", ips: a.parsed.ips4 };
      }
      var aaaa = await dohQuery(doh, hostname, 28);
      if (aaaa.ok && aaaa.parsed && aaaa.parsed.ok && aaaa.parsed.rcode === 0 && (aaaa.parsed.ips6 || []).length) {
        return { ok: true, via: "AAAA", ips: aaaa.parsed.ips6 };
      }
      var rcode = (a.ok && a.parsed && a.parsed.ok) ? a.parsed.rcode :
                  (aaaa.ok && aaaa.parsed && aaaa.parsed.ok ? aaaa.parsed.rcode : null);
      return { ok: false, reason: (rcode === 3) ? "NXDOMAIN" : "No A/AAAA records" };
    } catch (_e) {
      return { ok: false, reason: "Public DNS check network error" };
    }
  }

  async function probeHttpsHost(host, path, timeoutMs) {
    var p = (typeof path === "string") ? path : "/";
    if (!p.startsWith("/")) p = "/" + p;
    var url = "https://" + host + p;
    url += (url.indexOf("?") === -1 ? "?" : "&") + "ts=" + Date.now();
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, timeoutMs || 7000);
    try {
      await fetch(url, { method: "GET", mode: "no-cors", cache: "no-store", signal: ctrl.signal });
      clearTimeout(timer);
      return { ok: true, detail: "HTTPS connect attempt succeeded." };
    } catch (_e) {
      clearTimeout(timer);
      return { ok: false, detail: "HTTPS connect attempt failed." };
    }
  }

  // ------------------------------------------------------------------
  // Setup verifier widget — gated on #verify
  // ------------------------------------------------------------------
  function setLedInline(el, level) {
    if (!el) return;
    el.classList.remove("ok", "bad");
    if (level === "ok") el.classList.add("ok");
    if (level === "bad") el.classList.add("bad");
  }
  window.setVerifyOverall = function (msg, level) {
    var led = $("vLed"); var st = $("vStatus");
    if (st) st.textContent = msg;
    setLedInline(led, level);
  };
  function setResult(which, status, detail, extra) {
    var r = $("r" + which); var d = $("d" + which); var e = $("d" + which + "Extra");
    if (r) r.textContent = status;
    if (d) d.textContent = detail || "";
    if (e) e.textContent = extra || "";
  }
  window.clearVerify = function () {
    if (!$("verify")) return;
    window.setVerifyOverall("Idle", "");
    ["rReach", "dReach", "rBin", "dBin", "dBinExtra", "rBlock", "dBlock", "dBlockExtra", "vSummary"].forEach(function (id) {
      var el = $(id); if (el) el.textContent = "";
    });
    if ($("rReach")) $("rReach").textContent = "Not run";
    if ($("rBin")) $("rBin").textContent = "Not run";
    if ($("rBlock")) $("rBlock").textContent = "Not run";
  };

  window.verifyReachability = async function () {
    if (!$("verify")) return;
    var url = getVerifyUrl();
    if (!url) return;
    window.setVerifyOverall("Testing reachability…", "");
    setResult("Reach", "Running", "", "");
    try {
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, 5000);
      await fetch(url, { method: "GET", mode: "no-cors", signal: ctrl.signal });
      clearTimeout(timer);
      setResult("Reach", "Pass", "Endpoint reachable from this network.", "");
      window.setVerifyOverall("Reachability passed", "ok");
      return true;
    } catch (_e) {
      setResult("Reach", "Fail", "Cannot reach DoH endpoint from this network.", "");
      window.setVerifyOverall("Reachability failed", "bad");
      return false;
    }
  };

  window.verifyBinaryExample = async function () {
    if (!$("verify")) return;
    var url = getVerifyUrl();
    if (!url) return;
    window.setVerifyOverall("Testing DoH query…", "");
    setResult("Bin", "Running", "", "");
    var res = await dohQuery(url, "google.com", 1);
    if (!res.ok) {
      setResult("Bin", "Fail", "HTTP error: " + (res.http || "") + " " + (res.reason || ""), "");
      window.setVerifyOverall("DoH query failed", "bad");
      return false;
    }
    var p = res.parsed;
    if (!p.ok) {
      setResult("Bin", "Fail", "Parse error: " + (p.reason || ""), "");
      window.setVerifyOverall("DoH query failed", "bad");
      return false;
    }
    if (p.rcode === 0 && (p.ips4 || []).length) {
      setResult("Bin", "Pass", "Resolved google.com", "A: " + p.ips4.join(", "));
      window.setVerifyOverall("DoH query passed", "ok");
      return true;
    }
    setResult("Bin", "Fail", "Unexpected response. rcode=" + p.rcode, "A: " + ((p.ips4 || []).join(", ")));
    window.setVerifyOverall("DoH query failed", "bad");
    return false;
  };

  window.verifyBlockTest = async function () {
    if (!$("verify")) return;
    var url = getVerifyUrl();
    if (!url) return;
    var mode = getVerifyMode();
    window.setVerifyOverall("Testing behavior…", "");
    setResult("Block", "Running", "", "");
    var host = ($("blockHost") ? $("blockHost").textContent.trim() : "dns-block-test.secretchip.net");
    var res = await dohQuery(url, host, 1);
    if (!res.ok) {
      setResult("Block", "Fail", "HTTP error: " + (res.http || "") + " " + (res.reason || ""), "");
      window.setVerifyOverall("Behavior check failed", "bad");
      return false;
    }
    var p = res.parsed;
    if (!p.ok) {
      setResult("Block", "Fail", "Parse error: " + (p.reason || ""), "");
      window.setVerifyOverall("Behavior check failed", "bad");
      return false;
    }
    var nx = (p.rcode === 3);
    var nullA = (p.rcode === 0 && (p.ips4 || []).indexOf("0.0.0.0") !== -1);
    var hasAnswers = ((p.ips4 || []).length > 0 || (p.ips6 || []).length > 0);

    if (mode === "filtered") {
      if (nx || nullA) {
        setResult("Block", "Pass", nx ? "Filtered resolver returned NXDOMAIN (rcode=3) for canary." : "Filtered resolver returned 0.0.0.0 for canary.", "A: " + ((p.ips4 || []).join(", ")));
        window.setVerifyOverall("Filtered resolver blocked the canary", "ok");
        return true;
      }
      setResult("Block", "Fail", "Filtered resolver returned answers for canary. rcode=" + p.rcode, "A: " + ((p.ips4 || []).join(", ")));
      window.setVerifyOverall("Filtered resolver did not block — investigate", "bad");
      return false;
    }

    // Open mode: NXDOMAIN/null = inconclusive (could be upstream issue); answers = pass
    if (mode === "open") {
      if (hasAnswers && !nullA) {
        setResult("Block", "Pass", "Open resolver returned answers for canary. rcode=" + p.rcode, "A: " + ((p.ips4 || []).join(", ")));
        window.setVerifyOverall("Open resolver returned answers (expected)", "ok");
        return true;
      }
      if (nx) {
        setResult("Block", "Inconclusive", "Open resolver returned NXDOMAIN. Domain may be inactive or blocked upstream.", "");
        window.setVerifyOverall("Open resolver result inconclusive", "");
        return false;
      }
      setResult("Block", "Inconclusive", "Open resolver returned 0.0.0.0. Could be upstream filtering.", "");
      window.setVerifyOverall("Open resolver result inconclusive", "");
      return false;
    }

    // Custom / unknown mode — just report what we got
    setResult("Block", "Info", "rcode=" + p.rcode, "A: " + ((p.ips4 || []).join(", ")));
    window.setVerifyOverall("Result reported (mode unknown)", "");
    return false;
  };

  window.verifyAll = async function () {
    if (!$("verify")) return;
    window.clearVerify();
    window.setVerifyOverall("Running checks…", "");
    var ok1 = await window.verifyReachability();
    var ok2 = await window.verifyBinaryExample();
    var ok3 = await window.verifyBlockTest();
    var summary = $("vSummary");
    if (summary) summary.textContent = "Reachability: " + (ok1 ? "pass" : "fail") + ", DoH query: " + (ok2 ? "pass" : "fail") + ", Block: " + (ok3 ? "pass" : "fail");
    if (ok1 && ok2 && ok3) window.setVerifyOverall("All checks passed", "ok");
    else window.setVerifyOverall("One or more checks failed", "bad");
  };

  // ------------------------------------------------------------------
  // Status page — 3-host control + allow + block probe (device-level)
  // ------------------------------------------------------------------
  window.runAll = async function () {
    if (!$("overallText")) return;

    setLedInline($("overallLed"), "");
    setText("overallText", "Running checks");
    ["doh", "block", "device"].forEach(function (k) {
      setText(k + "Text", "Running");
      setText(k + "Detail", "");
      setLedInline($(k + "Led"), "");
    });

    var dohUrl = ($("dohUrl") ? $("dohUrl").textContent.trim() : "");
    var controlHost = ($("controlHost") ? $("controlHost").textContent.trim() : "dns.secretchip.net");
    var allowHost = ($("allowHost") ? $("allowHost").textContent.trim() : "dns-allow-test.secretchip.net");
    var blockHost = ($("blockHost") ? $("blockHost").textContent.trim() : "dns-block-test.secretchip.net");

    // 1) DoH reachability
    var okDoh = false;
    try {
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, 5000);
      await fetch(dohUrl, { method: "GET", mode: "no-cors", signal: ctrl.signal });
      clearTimeout(timer);
      okDoh = true;
      setText("dohText", "Reachable");
      setText("dohDetail", "Network path looks OK.");
      setLedInline($("dohLed"), "ok");
    } catch (_e) {
      setText("dohText", "Unreachable");
      setText("dohDetail", "Cannot reach DoH endpoint from this network.");
      setLedInline($("dohLed"), "bad");
    }

    // 2) Filter block via DoH
    var okBlock = false;
    var bres = await dohQuery(dohUrl, blockHost, 1);
    if (bres.ok && bres.parsed && bres.parsed.ok) {
      var p = bres.parsed;
      var nx = (p.rcode === 3);
      var nullA = (p.rcode === 0 && (p.ips4 || []).indexOf("0.0.0.0") !== -1);
      if (nx || nullA) {
        okBlock = true;
        setText("blockText", "Blocked");
        setText("blockDetail", nx ? "NXDOMAIN (rcode=3)." : "0.0.0.0 A record.");
        setLedInline($("blockLed"), "ok");
      } else {
        setText("blockText", "Not blocked");
        setText("blockDetail", "rcode=" + p.rcode + ", A=" + ((p.ips4 || []).join(", ") || "none"));
        setLedInline($("blockLed"), "bad");
      }
    } else {
      setText("blockText", "Fail");
      setText("blockDetail", bres.reason || "DoH query failed.");
      setLedInline($("blockLed"), "bad");
    }

    // 3) Device-level block probe (control + allow + block)
    if ($("deviceText")) {
      var d = await deviceBlockProbe(controlHost, allowHost, blockHost);
      if (d.ok && d.blocked) {
        setText("deviceText", "On Aegis");
        setText("deviceDetail", d.detail);
        setLedInline($("deviceLed"), "ok");
      } else if (d.ok && !d.blocked) {
        setText("deviceText", "Not on Aegis");
        setText("deviceDetail", d.detail);
        setLedInline($("deviceLed"), "bad");
      } else {
        setText("deviceText", "Inconclusive");
        setText("deviceDetail", d.reason + " — " + d.detail);
        setLedInline($("deviceLed"), "");
      }
    }

    if (okDoh && okBlock) {
      setText("overallText", "Operational");
      setLedInline($("overallLed"), "ok");
    } else if (okDoh) {
      setText("overallText", "Degraded");
      setLedInline($("overallLed"), "bad");
    } else {
      setText("overallText", "Outage");
      setLedInline($("overallLed"), "bad");
    }
  };

  function setText(id, t) { var el = $(id); if (el) el.textContent = t; }

  async function deviceBlockProbe(controlHost, allowHost, testHost) {
    var control = await probeHttpsHost(controlHost, "/", 7000);
    if (!control.ok) return { ok: false, reason: "Control unreachable", detail: control.detail };
    var pubAllow = await publicDnsResolves(allowHost);
    if (!pubAllow.ok) return { ok: false, reason: "Allow host public DNS check failed", detail: pubAllow.reason || "" };
    var pubTest = await publicDnsResolves(testHost);
    if (!pubTest.ok) return { ok: false, reason: "Test host public DNS check failed", detail: pubTest.reason || "" };
    var allow = await probeHttpsHost(allowHost, "/", 7000);
    if (!allow.ok) return { ok: false, reason: "Allow host unreachable", detail: allow.detail };
    var test = await probeHttpsHost(testHost, "/", 7000);
    if (!test.ok) return { ok: true, blocked: true, detail: "Test host failed while allow host reachable." };
    return { ok: true, blocked: false, detail: "Test host succeeded — DNS path is not blocking it." };
  }

  // ------------------------------------------------------------------
  // Email reveal (rot13 obfuscation defeated by JS click)
  // ------------------------------------------------------------------
  function rot13(s) {
    return s.replace(/[a-zA-Z]/g, function (c) {
      var k = c.charCodeAt(0) < 91 ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - k + 13) % 26) + k);
    });
  }
  function initRevealEmail() {
    var nodes = document.querySelectorAll("[data-rot13-mailto]");
    nodes.forEach(function (n) {
      n.addEventListener("click", function (e) {
        e.preventDefault();
        var addr = rot13(n.getAttribute("data-rot13-mailto") || "");
        var subj = n.getAttribute("data-subject") || "";
        var body = n.getAttribute("data-body") || "";
        var href = "mailto:" + addr;
        var qs = [];
        if (subj) qs.push("subject=" + encodeURIComponent(subj));
        if (body) qs.push("body=" + encodeURIComponent(body));
        if (qs.length) href += "?" + qs.join("&");
        n.textContent = addr;
        window.location.href = href;
      });
    });
  }

  // Contact form on /contact/ is a Tally iframe embed — no client-side
  // wiring needed. Tally handles submission, validation, and delivery.
})();
