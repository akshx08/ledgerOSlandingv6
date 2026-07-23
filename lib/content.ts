/**
 * LedgerOS — all copy, one file. JSX never hard-codes content.
 *
 * Business facts carried over verbatim in substance from the product repo
 * (CLAUDE.md + README.md, synced 2026-07-23): the deterministic no-LLM
 * parse, the client × month workbench, live recon/registers/exports, the
 * business portal, the prep-not-filing boundary. The VOICE is unchanged —
 * terse, imperative, machined. Nothing here claims a capability that isn't
 * built; the channel wave (email scraper, WhatsApp agent, CRM) and the
 * knowledge layer are marked unbuilt everywhere they appear.
 */

export const BRAND = {
  name: "LedgerOS",
  maker: "for CA practices",
  status: "PRE-PILOT",
  contact: "akshx08@gmail.com",
};

export const ROUTES = [
  { href: "/", label: "Aperture", index: "00" },
  { href: "/system", label: "System", index: "01" },
  { href: "/practice", label: "Practice", index: "02" },
  { href: "/access", label: "Access", index: "03" },
];

export const BOOT = {
  word: "LEDGEROS",
  sub: "CALIBRATING APERTURE",
};

export const OPEN = {
  /* the cold open — set bottom-left, not centered */
  kicker: "Entering pilot",
  line: ["Point it", "at the", "chaos."],
  under:
    "Your clients send their financial lives in fragments — invoices over email, statements as scans, challans by hand. LedgerOS is the aperture it all passes through: sorted, matched to a client, reconciled, prepped to file.",
  cue: "Scroll to open",
};

export const STATEMENT = {
  /* one enormous sentence, cursor-reactive weight */
  big: "Nobody was ever promoted for sorting the post.",
  body: "An articled assistant loses the first ninety minutes of every day to triage — opening attachments, working out whose they are, keying numbers into Tally. That work is real. It is also the least valuable thing in the building. LedgerOS does the sorting, and preps everything the filing needs. The CA files.",
};

export const DRENCH = {
  /* full-bleed vermilion band — a marquee of what it reads */
  lead: "It already reads",
  types: [
    "Tax invoices",
    "Bank statements",
    "GST returns",
    "GSTR-2B",
    "Form 26AS",
    "TDS challans",
  ],
  note: "Typed with a confidence score. Low confidence is flagged, never quietly guessed.",
};

export const RESOLUTIONS = [
  {
    id: "sorted",
    title: "Sorted before you sit down",
    body: "Open the inbox to a sorted list. Then the workbench: one client, one month — documents in, matched, confirmed, input tax — with recon, registers and exports beside the numbers that decide if you need them.",
    figure: "inbox",
  },
  {
    id: "grounded",
    title: "Answers that carry receipts",
    body: "Ask in plain language. Every claim points at a source document. No source, no answer — and it never produces a number of its own.",
    figure: "copilot",
  },
  {
    id: "yours",
    title: "Corrections that stick",
    body: "Wrong client, wrong type, wrong value — fix it once. Even a full re-parse keeps every field a human corrected. The system takes the shape of your practice, not the other way round.",
    figure: "override",
  },
];

export const STAGES = [
  {
    n: "01",
    key: "intake",
    name: "Intake",
    spec: "Upload today · channels next",
    line: "Drop in what clients send. The email scraper and WhatsApp agent are the next wave — intake that meets clients where they already are.",
    detail: "No new habits asked of your clients. Ever.",
  },
  {
    n: "02",
    key: "extract",
    name: "Extract",
    spec: "Deterministic · no LLM",
    line: "Fields are read off the labels an invoice legally must carry — never inferred from position, never guessed by a model. Regex and an India knowledge base, nothing else near a number.",
    detail: "Amounts, dates, GSTIN, PAN, TDS sections — whatever the type carries.",
  },
  {
    n: "03",
    key: "classify",
    name: "Classify",
    spec: "Typed + scored",
    line: "Each document is typed — invoice, bank statement, GST return, 26AS — by a provider that scores its own confidence.",
    detail: "Below threshold it is flagged for a human, not quietly filed.",
  },
  {
    n: "04",
    key: "match",
    name: "Match",
    spec: "GSTIN · PAN · name",
    line: "Matched to the client on hard identifiers first, name second. Unmatched is a visible state with a one-click fix.",
    detail: "A wrong match is worse than no match. It behaves accordingly.",
  },
  {
    n: "05",
    key: "prep",
    name: "Prep",
    spec: "Recon · registers · exports",
    line: "Reconciled against GSTR-2B and Form 26AS, built into registers, exported as portal-ready GSTR-1 JSON and Tally XML. LedgerOS preps the filing. You file it.",
    detail: "Prep, not filing, is the product. Ambiguous documents are refused, not averaged in.",
  },
];

export const INBOX_ROWS = [
  {
    type: "GST Notice",
    form: "ASMT-10",
    client: "Meridian Textiles",
    field: "₹4,18,200 mismatch",
    due: "18 Aug",
    status: "NEW",
  },
  {
    type: "TDS Notice",
    form: "200A",
    client: "Sahni & Rao Traders",
    field: "₹36,540 short deduction",
    due: "Q1",
    status: "NEW",
  },
  {
    type: "Bank Statement",
    form: "Scanned",
    client: "Meridian Textiles",
    field: "HDFC ····2841",
    due: "June",
    status: "OPEN",
  },
  {
    type: "GST Notice",
    form: "DRC-01",
    client: "Unassigned",
    field: "₹1,02,350 demand",
    due: "FY 24-25",
    status: "NEW",
  },
];

export const INBOX_NOTE = "Illustrative records · pilot build";

export const COPILOT = {
  ask: "What's still open for Meridian Textiles?",
  answer:
    "Two. The ASMT-10 — ₹4,18,200 mismatch, reply due 18 Aug. And the June HDFC statement is parsed but unreviewed.",
  cites: ["ASMT-10 · 12 Jul", "HDFC stmt · June"],
  rules: [
    ["Grounded, or silent", "If a claim can't cite a document, it doesn't get made."],
    ["Reads, never acts", "It retrieves and summarises. It does not file, reply, or alter a record."],
    ["Your documents only", "It answers about the practice in front of you. Not general trivia."],
  ],
};

export const KNOWLEDGE = {
  title: "The layer we haven't built yet",
  body: "A maintained index of Indian accounting rules — GST, TDS rates, ITR forms, ICAI and Income Tax notifications — so the copilot can cross-check against the law as it stands rather than as a model remembers it. It is in development, not shipped. Until it lands the copilot stays deliberately narrow: your parsed documents, nothing else.",
  sources: ["GST rules", "TDS rates", "ITR forms", "ICAI notifications", "Income Tax notifications"],
};

export const ROADMAP = {
  title: "The workbench is real. The next wave is channels.",
  body: "An invoice born inside LedgerOS needs no parser at all — a firm's client raises it in the portal and it lands in the books, structured from the first keystroke. Paper is the legacy input. The next modules go to where it still arrives.",
  items: [
    { n: "01", name: "Document inbox + deterministic parse", state: "Live" },
    { n: "02", name: "Client × month workbench", state: "Live" },
    { n: "03", name: "GST reconciliation + GSTR-1", state: "Live" },
    { n: "04", name: "TDS / 26AS + registers · Tally export", state: "Live" },
    { n: "05", name: "Business portal — clients raise invoices", state: "Live" },
    { n: "06", name: "Email scraper · WhatsApp agent", state: "Next" },
    { n: "07", name: "Client dashboards · practice CRM", state: "Planned" },
  ],
};

export const ACCESS = {
  big: ["Open it", "on your", "practice."],
  body: "LedgerOS is entering pilot with Chartered Accountant firms in India. Pilot firms run it against their real document flow, keep every hour it saves, and set what gets built next. Seats are deliberately few.",
  terms: [
    ["Real flow", "It runs on your documents and your clients, not a demo set."],
    ["Direct line", "You talk to the people building it. Feedback lands in the next build."],
    ["No lock-in", "It's your data. Leave whenever, and take it with you."],
  ],
  form: {
    heading: "Request a seat",
    note: "We onboard in small batches and reply personally.",
    fields: {
      name: "Name",
      email: "Work email",
      firm: "Firm",
      role: "Role",
      city: "City",
      volume: "Documents / month",
    },
    roles: ["Partner", "Chartered Accountant", "Articled assistant", "Staff accountant", "Other"],
    submit: "Request access",
    sending: "Transmitting",
    done: "You're on the list.",
    doneSub: "We reply personally — usually within a few days.",
    invalid:
      "That didn't validate. Check the email has a full domain, and that name and firm aren't blank.",
    unconfigured: "The waitlist store isn't connected on this deployment. Write to us directly and we'll add you by hand:",
    failed: "Something broke on our side. Try again, or write to",
  },
};

export const FOOT = {
  line: "Built for Chartered Accountant firms in India.",
  meta: "MMXXVI",
};
