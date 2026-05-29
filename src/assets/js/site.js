// SecretChip site script. No dependencies.
// Handles: footer year, GDPR cookie consent (+ preferences panel), email reveal.
(function () {
  function $(id) { return document.getElementById(id); }

  document.addEventListener("DOMContentLoaded", function () {
    var y = $("year");
    if (y) y.textContent = String(new Date().getFullYear());
    initRevealEmail();
    initCookieConsent();
  });

  /* ---------------------------------------------------------
     Cookie consent (GDPR)
     --------------------------------------------------------- */
  var COOKIE_PREFS_KEY = "secretchip-cookie-prefs";
  var COOKIE_CONSENT_KEY = "secretchip-cookie-consent";
  var defaultCookiePrefs = { necessary: true, analytics: false, embeds: false };

  function parseCookiePrefs(raw) {
    if (!raw) return Object.assign({}, defaultCookiePrefs);
    try {
      var p = JSON.parse(raw);
      return { necessary: true, analytics: Boolean(p && p.analytics), embeds: Boolean(p && p.embeds) };
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
        '<button type="button" class="btn" data-cookie-prefs-withdraw>Withdraw optional consent</button>' +
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

  /* ---------------------------------------------------------
     Email reveal (lightweight obfuscation)
     --------------------------------------------------------- */
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
