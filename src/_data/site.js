module.exports = {
  company: "SecretChip",
  product: "AEGIS PDNS",
  productShort: "AEGIS PDNS",
  productMark: "AEGIS PDNS",
  productTagline: "Practical security products and services",
  domain: "secretchip.net",
  url: "https://secretchip.net",
  contactEmail: "hello@secretchip.net",
  abuseEmail: "abuse@secretchip.net",
  endpoints: {
    doh: "https://dns.secretchip.net/dns-query",
    dohOpen: "https://nofilter.dns.secretchip.net/dns-query",
    dotHost: "dns.secretchip.net",
    dotPort: 853,
  },
  github: {
    aegisDns: "https://github.com/secretchip/AEGIS-DNS",
    aegisDnsReleases: "https://github.com/secretchip/AEGIS-DNS/releases",
    aegisDnsIssues: "https://github.com/secretchip/AEGIS-DNS/issues/new/choose",
  },
  // Tally embed: handles contact form submission, validation, and delivery.
  tallyContactFormUrl: "https://tally.so/embed/QKxLNY?alignLeft=1&hideTitle=1&dynamicHeight=1&formEventsForwarding=1",
  // One-page site: primary nav scrolls to sections; Contact is its own page.
  nav: [
    { label: "AEGIS PDNS", href: "/#aegis" },
    { label: "vCISO", href: "/#vciso" },
    { label: "About", href: "/#about" },
  ],
  footerGroups: {
    Explore: [
      { label: "AEGIS PDNS", href: "/#aegis" },
      { label: "vCISO", href: "/#vciso" },
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/contact/" },
    ],
    Legal: [
      { label: "Legal Hub", href: "/legal/" },
      { label: "Privacy Notice", href: "/legal/privacy-notice/" },
      { label: "Cookie Policy", href: "/legal/cookie-policy/" },
      { label: "Cookie Preferences", href: "/legal/cookie-preferences/" },
      { label: "Terms & Conditions", href: "/legal/terms-and-conditions/" },
      { label: "Acceptable Use Policy", href: "/legal/acceptable-use-policy/" },
      { label: "Privacy Requests", href: "/legal/privacy-requests/" },
    ],
  },
};
