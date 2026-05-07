// SecretChip site: page-aware shared script. No dependencies.
(function () {
  function $(id) { return document.getElementById(id); }

  var VERIFY_STATE = {
    reachability: null,
    doh: null,
    behavior: null,
    publicCanaries: null,
    device: null,
  };

  document.addEventListener("DOMContentLoaded", function () {
    var y = $("year");
    if (y) y.textContent = String(new Date().getFullYear());

    bindLightbox();
    initRevealEmail();
    initResolverSelector();
    initCookieConsent();
  });

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
      window.clearVerify();
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

  function textOf(id, fallback) {
    var el = $(id);
    var value = el ? (el.textContent || "").trim() : "";
    return value || fallback;
  }

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
        if (action === "accept") saveCookiePrefs({ necessary: true, analytics: true, embeds: true });
        if (action === "reject") saveCookiePrefs(Object.assign({}, defaultCookiePrefs));
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

    mount.querySelector("[data-cookie-prefs-save]").addEventListener("click", function () {
      saveCookiePrefs(prefs);
      if (status) {
        status.textContent = "Preferences saved.";
        setTimeout(function () { status.textContent = ""; }, 2500);
      }
    });

    mount.querySelector("[data-cookie-prefs-withdraw]").addEventListener("click", function () {
      withdrawCookieConsent();
      prefs = Object.assign({}, defaultCookiePrefs);
      mount.querySelectorAll('input[type="checkbox"]').forEach(function (el) {
        var key = el.getAttribute("data-cookie-key");
        if (key !== "necessary") el.checked = false;
      });
      if (status) {
        status.textContent = "Optional consent withdrawn. Banner will reappear.";
        setTimeout(function () { status.textContent = ""; }, 3500);
      }
    });
  }

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
    setTimeout(function () {
      holder.classList.remove("visible");
      holder.textContent = "";
    }, 1500);
  }

  window.setHealth = function (msg, level) {
    var led = $("led");
    var t = $("healthText");
    if (t) t.textContent = msg;
    setLedInline(led, level);
  };

  window.testDoh = async function () {
    var urlEl = $("dohUrl");
    var url = urlEl ? (urlEl.textContent || "").trim() : "";
    if (!url) return;
    window.setHealth("Testing DoH endpoint...", "");
    var reachable = await endpointReachable(url);
    if (reachable.ok) window.setHealth("Reachable from this network.", "ok");
    else window.setHealth("Not reachable, or blocked by firewall.", "bad");
  };

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
    box.appendChild(img);
    box.appendChild(caption);
    overlay.appendChild(box);
    function close() { overlay.style.display = "none"; img.src = ""; caption.textContent = ""; }
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    document.body.appendChild(overlay);
    lb = { open: function (src, cap) { img.src = src; caption.textContent = cap || ""; overlay.style.display = "flex"; }, close: close };
    return lb;
  }

  function toSafeLightboxSrc(raw) {
    if (!raw) return null;
    var v = String(raw).trim();
    if (!v) return null;
    try {
      var u = new URL(v, window.location.href);
      if (u.protocol === "http:" || u.protocol === "https:") return u.href;
    } catch (_e) {}
    return null;
  }

  function bindLightbox() {
    var nodes = document.querySelectorAll("[data-lightbox]");
    if (!nodes.length) return;
    var l = ensureLightbox();
    nodes.forEach(function (n) {
      n.addEventListener("click", function (e) {
        e.preventDefault();
        var safeSrc = toSafeLightboxSrc(n.getAttribute("data-lightbox"));
        if (safeSrc) l.open(safeSrc, n.getAttribute("data-caption") || "");
      });
    });
  }

  function base64UrlEncode(bytes) {
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function buildDnsQuery(name, qtype) {
    var id = Math.floor(Math.random() * 65536);
    var parts = name.split(".").filter(Boolean);
    var qnameLen = 1;
    for (var i = 0; i < parts.length; i++) qnameLen += 1 + parts[i].length;
    var buf = new Uint8Array(12 + qnameLen + 4);
    var dv = new DataView(buf.buffer);
    dv.setUint16(0, id);
    dv.setUint16(2, 0x0100);
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
    dv.setUint16(off + 2, 1);
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
    var ips4 = [];
    var ips6 = [];
    for (var k = 0; k < an; k++) {
      off = skipName(u8, off);
      if (off + 10 > u8.length) return { ok: false, reason: "Truncated answer header" };
      var type = dv.getUint16(off); off += 2;
      var cls = dv.getUint16(off); off += 2;
      off += 4;
      var rdlen = dv.getUint16(off); off += 2;
      if (off + rdlen > u8.length) return { ok: false, reason: "Truncated answer data" };
      if (type === 1 && cls === 1 && rdlen === 4) ips4.push(u8[off] + "." + u8[off + 1] + "." + u8[off + 2] + "." + u8[off + 3]);
      if (type === 28 && cls === 1 && rdlen === 16) ips6.push(ipv6FromBytes(u8, off));
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
      var r = await fetch(url, { method: "GET", cache: "no-store", signal: ctrl.signal });
      clearTimeout(timer);
      if (!r.ok) return { ok: false, type: "http", http: r.status, reason: r.statusText || "HTTP error" };
      var ct = (r.headers && r.headers.get) ? (r.headers.get("content-type") || "") : "";
      if (!ct || ct.toLowerCase().indexOf("application/dns-message") === -1) {
        return { ok: false, type: "content-type", http: r.status, reason: "Unexpected content type: " + (ct || "missing") };
      }
      var ab = await r.arrayBuffer();
      var parsed = parseDnsResponseAny(new Uint8Array(ab));
      if (!parsed.ok) return { ok: false, type: "parse", http: r.status, reason: parsed.reason || "DNS packet parse failed" };
      return { ok: true, parsed: parsed, contentType: ct };
    } catch (e) {
      clearTimeout(timer);
      var msg = e && e.name === "AbortError" ? "DoH query timed out." : "DoH endpoint is reachable, but browser DoH query failed. Check Access-Control-Allow-Origin on the DoH response.";
      return { ok: false, type: "cors-or-network", reason: msg };
    }
  }

  async function endpointReachable(url) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 5000);
    try {
      await fetch(url, { method: "GET", mode: "no-cors", cache: "no-store", signal: ctrl.signal });
      clearTimeout(timer);
      return { ok: true };
    } catch (_e) {
      clearTimeout(timer);
      return { ok: false, reason: "Resolver endpoint not reachable from this browser or network. Further resolver tests skipped." };
    }
  }

  async function probeHttpsHost(host, path, timeoutMs) {
    var p = (typeof path === "string") ? path : "/";
    if (p.charAt(0) !== "/") p = "/" + p;
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

  function setLedInline(el, level) {
    if (!el) return;
    el.classList.remove("ok", "bad");
    if (level === "ok") el.classList.add("ok");
    if (level === "bad") el.classList.add("bad");
  }

  window.setVerifyOverall = function (msg, level) {
    setText("vStatus", msg);
    setLedInline($("vLed"), level);
  };

  function setResult(which, status, detail, extra) {
    setText("r" + which, status);
    setText("d" + which, detail || "");
    setText("d" + which + "Extra", extra || "");
  }

  function setSummary(status, detail) {
    setText("rSummary", status || "");
    setText("vSummary", detail || "");
  }

  function resetVerifyState() {
    VERIFY_STATE.reachability = null;
    VERIFY_STATE.doh = null;
    VERIFY_STATE.behavior = null;
    VERIFY_STATE.publicCanaries = null;
    VERIFY_STATE.device = null;
  }

  window.clearVerify = function () {
    if (!$("verify")) return;
    resetVerifyState();
    window.setVerifyOverall("Idle", "");
    ["Reach", "Bin", "Block", "Public", "Device"].forEach(function (key) {
      setResult(key, "Not run", "", "");
    });
    setSummary("Idle", "");
  };

  window.verifyReachability = async function () {
    if (!$("verify")) return false;
    var url = getVerifyUrl();
    if (!url) return false;
    window.setVerifyOverall("Testing endpoint reachability...", "");
    setResult("Reach", "Running", "Checking whether the endpoint can be reached from this browser.", "");
    var result = await endpointReachable(url);
    VERIFY_STATE.reachability = result.ok;
    if (result.ok) {
      setResult("Reach", "Pass", "Resolver endpoint is reachable from this browser or network.", "");
      window.setVerifyOverall("Endpoint reachability passed", "ok");
      return true;
    }
    setResult("Reach", "Fail", result.reason, "");
    setResult("Bin", "Skipped", result.reason, "");
    setResult("Block", "Skipped", result.reason, "");
    window.setVerifyOverall("Endpoint reachability failed", "bad");
    return false;
  };

  window.verifyBinaryExample = async function (overrideHost) {
    if (!$("verify")) return false;
    var url = getVerifyUrl();
    if (!url) return false;
    if (VERIFY_STATE.reachability === false) {
      setResult("Bin", "Skipped", "Resolver endpoint not reachable from this browser or network. Further resolver tests skipped.", "");
      return false;
    }
    var allowHost = textOf("allowHost", "dns-allow-test.secretchip.net");
    var host = (typeof overrideHost === "string" && overrideHost) ? overrideHost : allowHost;
    window.setVerifyOverall("Testing DoH query correctness...", "");
    setResult("Bin", "Running", "Querying " + host + " A via RFC 8484 GET.", "");
    var a = await dohQuery(url, host, 1);
    if (!a.ok) {
      VERIFY_STATE.doh = false;
      setResult("Bin", "Fail", a.reason || "DoH query failed.", "Host: " + host);
      setResult("Block", "Skipped", "DoH query failed, so behavior check is not meaningful.", "");
      window.setVerifyOverall("DoH query failed", "bad");
      return false;
    }
    var p = a.parsed;
    if (p.rcode === 0 && ((p.ips4 || []).length || (p.ips6 || []).length)) {
      VERIFY_STATE.doh = true;
      setResult("Bin", "Pass", "DoH response parsed with rcode=0 and at least one A or AAAA answer.", "A: " + ((p.ips4 || []).join(", ") || "none") + " AAAA: " + ((p.ips6 || []).join(", ") || "none"));
      window.setVerifyOverall("DoH query passed", "ok");
      return true;
    }
    VERIFY_STATE.doh = false;
    setResult("Bin", "Fail", "Unexpected DNS response. rcode=" + p.rcode + ".", "A: " + ((p.ips4 || []).join(", ") || "none") + " AAAA: " + ((p.ips6 || []).join(", ") || "none"));
    setResult("Block", "Skipped", "DoH query failed, so behavior check is not meaningful.", "");
    window.setVerifyOverall("DoH query failed", "bad");
    return false;
  };

  window.verifyBlockTest = async function () {
    if (!$("verify")) return false;
    var url = getVerifyUrl();
    if (!url) return false;
    if (VERIFY_STATE.reachability === false) {
      setResult("Block", "Skipped", "Resolver endpoint not reachable from this browser or network. Further resolver tests skipped.", "");
      return false;
    }
    if (VERIFY_STATE.doh === false) {
      setResult("Block", "Skipped", "DoH query failed, so behavior check is not meaningful.", "");
      return false;
    }
    var mode = getVerifyMode();
    var host = textOf("blockHost", "dns-block-test.secretchip.net");
    window.setVerifyOverall("Testing filter behavior...", "");
    setResult("Block", "Running", "Querying " + host + " A through the selected " + mode + " resolver.", "");
    var res = await dohQuery(url, host, 1);
    if (!res.ok) {
      VERIFY_STATE.behavior = false;
      setResult("Block", "Fail", res.reason || "DoH behavior query failed.", "");
      window.setVerifyOverall("Behavior check failed", "bad");
      return false;
    }
    var p = res.parsed;
    var nx = p.rcode === 3;
    var nullA = p.rcode === 0 && (p.ips4 || []).indexOf("0.0.0.0") !== -1;
    var hasPublicAnswers = p.rcode === 0 && ((p.ips4 || []).length > 0 || (p.ips6 || []).length > 0) && !nullA;
    var details = "rcode=" + p.rcode + ", A=" + ((p.ips4 || []).join(", ") || "none") + ", AAAA=" + ((p.ips6 || []).join(", ") || "none");

    if (mode === "filtered") {
      if (nx || nullA) {
        VERIFY_STATE.behavior = true;
        setResult("Block", "Pass", nx ? "Filtered resolver returned NXDOMAIN for the block-test canary." : "Filtered resolver returned 0.0.0.0 for the block-test canary.", details);
        window.setVerifyOverall("Filtered resolver blocked the canary", "ok");
        return true;
      }
      VERIFY_STATE.behavior = false;
      setResult("Block", "Fail", "Filtered resolver did not block the block-test canary.", details);
      window.setVerifyOverall("Filtered resolver did not block the canary", "bad");
      return false;
    }

    if (mode === "open") {
      if (hasPublicAnswers) {
        VERIFY_STATE.behavior = true;
        setResult("Block", "Pass", "Open resolver returned public answers for the block-test canary.", details);
        window.setVerifyOverall("Open resolver behavior passed", "ok");
        return true;
      }
      VERIFY_STATE.behavior = false;
      setResult("Block", "Unexpected", "Open resolver did not return public answers for the block-test canary.", details);
      window.setVerifyOverall("Open resolver result unexpected", "bad");
      return false;
    }

    VERIFY_STATE.behavior = false;
    setResult("Block", "Inconclusive", "Unknown resolver mode.", details);
    window.setVerifyOverall("Behavior check inconclusive", "");
    return false;
  };

  window.verifyPublicCanaries = async function () {
    if (!$("verify")) return false;
    var allowHost = textOf("allowHost", "dns-allow-test.secretchip.net");
    var blockHost = textOf("blockHost", "dns-block-test.secretchip.net");
    window.setVerifyOverall("Testing public canary HTTPS reachability...", "");
    setResult("Public", "Running", "Checking public HTTPS reachability for both canary hosts.", "");
    var allow = await probeHttpsHost(allowHost, "/", 7000);
    var block = await probeHttpsHost(blockHost, "/", 7000);
    VERIFY_STATE.publicCanaries = Boolean(allow.ok && block.ok);
    if (allow.ok && block.ok) {
      setResult("Public", "Pass", "Both canary hosts are reachable over public HTTPS.", "This is a diagnostic control, not proof that this device uses AEGIS PDNS.");
      window.setVerifyOverall("Public canaries reachable", "ok");
      return true;
    }
    setResult("Public", "Fail", "One or more public HTTPS canary hosts could not be reached.", allowHost + ": " + allow.detail + " " + blockHost + ": " + block.detail);
    window.setVerifyOverall("Public canary check failed", "bad");
    return false;
  };

  window.verifyDeviceProbe = async function () {
    if (!$("verify")) return false;
    var controlHost = textOf("controlHost", "dns.secretchip.net");
    var allowHost = textOf("deviceAllowHost", textOf("allowHost", "dns-allow-test.secretchip.net"));
    var blockHost = textOf("deviceBlockHost", textOf("blockHost", "dns-block-test.secretchip.net"));
    setResult("Device", "Running", "Running best-effort device resolver probe.", "");
    var d = await deviceBlockProbe(controlHost, allowHost, blockHost);
    VERIFY_STATE.device = Boolean(d.ok && d.blocked);
    if (d.ok && d.blocked) {
      setResult("Device", "Pass", "This device appears to be using AEGIS PDNS filtering.", d.detail);
      return true;
    }
    if (d.ok && !d.blocked) {
      setResult("Device", "Unexpected", "This device does not appear to be using filtered AEGIS PDNS.", d.detail);
      return false;
    }
    setResult("Device", "Inconclusive", d.reason || "Device probe could not complete.", d.detail || "");
    return false;
  };

  window.verifyAll = async function () {
    if (!$("verify")) return;
    window.clearVerify();
    window.setVerifyOverall("Running checks...", "");
    var okReach = await window.verifyReachability();
    if (!okReach) {
      setSummary("Stopped", "Resolver endpoint not reachable from this browser or network. Further resolver tests skipped.");
      return;
    }
    var okDoh = await window.verifyBinaryExample();
    if (!okDoh) {
      setSummary("Stopped", "DoH query failed, so behavior check is not meaningful.");
      await window.verifyPublicCanaries();
      await window.verifyDeviceProbe();
      return;
    }
    var okBehavior = await window.verifyBlockTest();
    var okPublic = await window.verifyPublicCanaries();
    var okDevice = await window.verifyDeviceProbe();
    var summary = "Reachability: pass, DoH query: pass, behavior: " + (okBehavior ? "pass" : "fail") + ", public canaries: " + (okPublic ? "pass" : "fail") + ", device probe: " + (okDevice ? "pass" : "not confirmed");
    setSummary(okBehavior ? "Complete" : "Attention needed", summary);
    window.setVerifyOverall(okBehavior ? "Resolver checks complete" : "One or more checks need attention", okBehavior ? "ok" : "bad");
  };

  window.runAll = async function () {
    if (!$("overallText")) return;
    setLedInline($("overallLed"), "");
    setText("overallText", "Running checks");
    ["doh", "block", "device"].forEach(function (k) {
      setText(k + "Text", "Running");
      setText(k + "Detail", "");
      setLedInline($(k + "Led"), "");
    });

    var controlHost = textOf("controlHost", "dns.secretchip.net");
    var allowHost = textOf("deviceAllowHost", textOf("allowHost", "dns-allow-test.secretchip.net"));
    var blockHost = textOf("deviceBlockHost", textOf("blockHost", "dns-block-test.secretchip.net"));
    var d = await deviceBlockProbe(controlHost, allowHost, blockHost);

    if (d.controlOk) {
      setText("dohText", "Reachable");
      setText("dohDetail", "Control host HTTPS check succeeded.");
      setLedInline($("dohLed"), "ok");
    } else {
      setText("dohText", "Unreachable");
      setText("dohDetail", d.controlDetail || "Control host HTTPS check failed.");
      setLedInline($("dohLed"), "bad");
    }

    if (d.blocked) {
      setText("blockText", "Blocked");
      setText("blockDetail", d.detail);
      setLedInline($("blockLed"), "ok");
    } else if (d.ok) {
      setText("blockText", "Not blocked");
      setText("blockDetail", d.detail);
      setLedInline($("blockLed"), "bad");
    } else {
      setText("blockText", "Inconclusive");
      setText("blockDetail", d.reason || "Probe did not complete.");
      setLedInline($("blockLed"), "");
    }

    if (d.ok && d.blocked) {
      setText("deviceText", "Likely on AEGIS PDNS");
      setText("deviceDetail", "Best-effort probe matched expected filtered behavior.");
      setLedInline($("deviceLed"), "ok");
      setText("overallText", "Likely configured");
      setLedInline($("overallLed"), "ok");
    } else if (d.ok) {
      setText("deviceText", "Not confirmed");
      setText("deviceDetail", "Best-effort probe did not see filtered block behavior.");
      setLedInline($("deviceLed"), "bad");
      setText("overallText", "Not confirmed");
      setLedInline($("overallLed"), "bad");
    } else {
      setText("deviceText", "Inconclusive");
      setText("deviceDetail", (d.reason || "") + (d.detail ? ": " + d.detail : ""));
      setLedInline($("deviceLed"), "");
      setText("overallText", "Inconclusive");
      setLedInline($("overallLed"), "");
    }
  };

  function setText(id, t) {
    var el = $(id);
    if (el) el.textContent = t;
  }

  async function deviceBlockProbe(controlHost, allowHost, testHost) {
    var control = await probeHttpsHost(controlHost, "/", 7000);
    if (!control.ok) return { ok: false, controlOk: false, controlDetail: control.detail, reason: "Control unreachable", detail: control.detail };
    var allow = await probeHttpsHost(allowHost, "/", 7000);
    if (!allow.ok) return { ok: false, controlOk: true, reason: "Allow host unreachable", detail: allow.detail };
    var test = await probeHttpsHost(testHost, "/", 7000);
    if (!test.ok) return { ok: true, controlOk: true, blocked: true, detail: "Block canary failed while allow canary was reachable." };
    return { ok: true, controlOk: true, blocked: false, detail: "Block canary loaded over HTTPS, so current device resolver did not block it." };
  }

  function rot13(s) {
    return s.replace(/[a-zA-Z]/g, function (c) {
      var k = c.charCodeAt(0) < 91 ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - k + 13) % 26) + k);
    });
  }

  function isSafeEmailAddress(addr) {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(addr);
  }

  function initRevealEmail() {
    var nodes = document.querySelectorAll("[data-rot13-mailto]");
    nodes.forEach(function (n) {
      n.addEventListener("click", function (e) {
        e.preventDefault();
        var addr = rot13(n.getAttribute("data-rot13-mailto") || "").trim();
        if (!isSafeEmailAddress(addr)) return;
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
})();
