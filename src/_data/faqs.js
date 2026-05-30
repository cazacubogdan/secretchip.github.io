// FAQ content — single source of truth for both the visible /faq/ page and
// its FAQPage structured data, so the two can never drift apart. Answers are
// plain text (one or two sentences). NIS2 framing is hedged on purpose:
// "supports / helps you meet / maps to" — never "certified" or "compliant",
// since no such certification exists and DNS filtering is one measure, not
// the whole of compliance.

module.exports = [
  {
    q: "What is protective DNS (PDNS)?",
    a: "Protective DNS is a security layer that checks every domain lookup against threat intelligence and blocks connections to malicious or unwanted domains before they are ever made. It stops malware, phishing and ransomware at the DNS layer, before a device reaches the harmful host.",
  },
  {
    q: "Does AEGIS PDNS help with NIS2 compliance?",
    a: "Yes. DNS filtering is a recognised basic cyber-hygiene practice under NIS2 Article 21(2)(g), and AEGIS resolves over encrypted DoH, DoT and DoQ, which supports the cryptography and encryption measure in Article 21(2)(h). It is one technical control that contributes to NIS2 — not a substitute for a full programme.",
  },
  {
    q: "How does AEGIS PDNS block threats?",
    a: "AEGIS resolves DNS over HTTPS (DoH), TLS (DoT) and QUIC (DoQ) and matches each query against continuously updated threat intelligence. Domains tied to malware, phishing, ransomware and command-and-control (C2) infrastructure are blocked at lookup, so the connection never completes.",
  },
  {
    q: "Can I test AEGIS PDNS before deploying it?",
    a: "Yes. We publish public test domains so you can confirm exactly what is and isn't blocked from your own network — no trial sign-up needed. The live query, threat and blocklist figures on our homepage are published openly too.",
  },
  {
    q: "Do you log or sell our DNS query data?",
    a: "We never sell DNS query data. We keep only what is needed to run and protect the service; see our Privacy Notice for the specifics.",
  },
  {
    q: "What is a virtual CISO (vCISO)?",
    a: "A virtual CISO is an experienced security leader you engage on demand — part-time, interim or ongoing — instead of hiring a full-time executive. You get strategy, governance, risk management and audit readiness without the cost and lead time of a permanent hire.",
  },
  {
    q: "How does a vCISO help with NIS2?",
    a: "A vCISO addresses the parts of NIS2 that are about leadership and process: management-body accountability and training under Article 20, the ten risk-management measures under Article 21, and incident-reporting readiness under Article 23 (the 24-hour early warning, 72-hour notification and one-month final report). We assess your gaps and build the programme on an ISO 27001 backbone.",
  },
  {
    q: "Can a vCISO get us SOC 2 or ISO 27001 ready?",
    a: "Yes. We map the controls, remediate the gaps, prepare your evidence and coordinate with the auditor. Certification itself is always issued by an independent auditor — we get you ready to pass.",
  },
  {
    q: "Which frameworks and regulations do you cover?",
    a: "NIS2, DORA, SOC 2, ISO 27001, NIST CSF, GDPR, HIPAA and PCI DSS, among others. We build one control set on an ISO 27001 backbone that satisfies several of these at once, rather than running a separate project per framework.",
  },
  {
    q: "Do I have to use both AEGIS PDNS and the vCISO service?",
    a: "No. They work well together but stand alone — take protective DNS, the security leadership, or both, depending on what you need.",
  },
  {
    q: "Where are you based, and where does our data stay?",
    a: "We are EU-based and run the service with European data residency in mind, which matters for GDPR and NIS2. If you have a specific residency requirement, raise it and we'll confirm how we meet it.",
  },
];
