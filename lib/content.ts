/**
 * LedgerOS — all copy, one file. JSX never hard-codes content.
 *
 * Business facts carried over verbatim in substance from the product repo
 * (GOALS.md): the pipeline stages, the inbox anatomy, the retrieve-only
 * grounded copilot, the module roadmap, pre-pilot status. The VOICE is new —
 * terse, imperative, machined. Nothing here claims a capability that isn't
 * built; the knowledge layer is marked unbuilt everywhere it appears.
 */

export const BRAND = {
  name: "LedgerOS",
  maker: "Precedal",
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
  kicker: "A Precedal instrument · entering pilot",
  line: ["Point it", "at the", "chaos."],
  under:
    "Your clients forward you everything. Notices, invoices, statements, scans of scans. LedgerOS is the aperture they pass through — and what comes out the other side is sorted.",
  cue: "Scroll to open",
};

export const STATEMENT = {
  /* one enormous sentence, cursor-reactive weight */
  big: "Nobody was ever promoted for sorting the post.",
  body: "An articled assistant loses the first ninety minutes of every day to triage — opening attachments, working out whose they are, filing them somewhere findable. That work is real. It is also the least valuable thing in the building. LedgerOS does it overnight.",
};

export const DRENCH = {
  /* full-bleed vermilion band — a marquee of what it reads */
  lead: "It already reads",
  types: [
    "GST notices",
    "TDS notices",
    "Tax invoices",
    "Bank statements",
    "Scanned PDFs",
    "Forwarded mail",
  ],
  note: "Typed with a confidence score. Low confidence is flagged, never quietly guessed.",
};

export const RESOLUTIONS = [
  {
    id: "sorted",
    title: "Sorted before you sit down",
    body: "Open the dashboard to a list, newest first. Document type, client, the amount, the due date. Nothing to hunt for.",
    figure: "inbox",
  },
  {
    id: "grounded",
    title: "Answers that carry receipts",
    body: "Ask in plain language. Every claim points at a source document. No source, no answer — that bar gates what ships.",
    figure: "copilot",
  },
  {
    id: "yours",
    title: "Corrections that stick",
    body: "Wrong client, wrong type, wrong value — fix it once. The system takes the shape of your practice, not the other way round.",
    figure: "override",
  },
];

export const STAGES = [
  {
    n: "01",
    key: "ingest",
    name: "Ingest",
    spec: "Gmail connector",
    line: "Clients already email you everything. LedgerOS reads the inbox you forward, and that is the entire integration.",
    detail: "No new habits. No migration project. No client-side change.",
  },
  {
    n: "02",
    key: "extract",
    name: "Extract",
    spec: "Native + scanned PDFs",
    line: "Text PDFs are parsed directly. Scans go through OCR. Fields are lifted off the page, not inferred from the vibe of it.",
    detail: "Amounts, dates, GSTIN, PAN — whatever the type carries.",
  },
  {
    n: "03",
    key: "classify",
    name: "Classify",
    spec: "Claude · typed + scored",
    line: "Each document is typed — GST notice, TDS notice, invoice, bank statement — and carries a confidence score with it.",
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
    key: "route",
    name: "Route",
    spec: "New · In progress · Handled",
    line: "Filed into the inbox with a status. Like an email client, except the sorting already happened while you slept.",
    detail: "Mark handled and the row leaves your morning.",
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
    ["Your documents only", "It answers about the inbox in front of you. Not general trivia."],
  ],
};

export const KNOWLEDGE = {
  title: "The layer we haven't built yet",
  body: "A maintained index of Indian accounting rules — GST, TDS rates, ITR forms, ICAI and Income Tax notifications — so the copilot can cross-check against the law as it stands rather than as a model remembers it. It is in development, not shipped. Until it lands the copilot stays deliberately narrow: your parsed documents, nothing else.",
  sources: ["GST rules", "TDS rates", "ITR forms", "ICAI notifications", "Income Tax notifications"],
};

export const ROADMAP = {
  title: "One module real. Six behind it.",
  body: "LedgerOS ships module by module, each one working before the next begins.",
  items: [
    { n: "01", name: "Document Inbox", state: "In pilot" },
    { n: "02", name: "Clients", state: "Next" },
    { n: "03", name: "GST reconciliation", state: "Planned" },
    { n: "04", name: "TDS / 26AS", state: "Planned" },
    { n: "05", name: "ITR preparation", state: "Planned" },
    { n: "06", name: "Compliance calendar", state: "Planned" },
    { n: "07", name: "Copilot, widened", state: "Expanding" },
  ],
};

export const ACCESS = {
  big: ["Open it", "on your", "practice."],
  body: "LedgerOS is entering pilot with Chartered Accountant firms in India. Pilot firms run it against their real document flow, keep every hour it saves, and set what gets built next. Seats are deliberately few.",
  terms: [
    ["Real flow", "You forward real client mail. It runs on your documents, not a demo set."],
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
  line: "Built by Precedal for Chartered Accountant firms in India.",
  meta: "MMXXVI",
};
