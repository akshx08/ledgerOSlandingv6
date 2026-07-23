/**
 * LedgerOS — all copy, one file. JSX never hard-codes content.
 *
 * Written to be read by someone who has never filed a GST return. The rule
 * throughout: the human sentence comes first, the compliance term second, as
 * evidence. Never a code word doing the work of an explanation. Every claim
 * matches the product repo (digi0/ledgerOS → CLAUDE.md); anything unbuilt is
 * labelled unbuilt where it appears.
 */

export const BRAND = {
  name: "LedgerOS",
  maker: "for CA practices",
  status: "PRE-PILOT",
  contact: "akshx08@gmail.com",
};

/**
 * Two destinations, not four. System and Practice were separate routes for
 * what is one continuous argument, so they are now sections of the home page
 * and these are anchors into it. `id` null means a real route.
 */
export const ROUTES = [
  { href: "/#overview", id: "overview", label: "Overview", index: "00" },
  { href: "/#plain", id: "plain", label: "Plain English", index: "01" },
  { href: "/#how", id: "how", label: "How it works", index: "02" },
  { href: "/access", id: null, label: "Access", index: "03" },
];

/** Section headers for the single-page story. */
export const HEADINGS = {
  how: {
    eyebrow: "Five steps · overnight",
    title: "What happens while you sleep",
  },
  morning: {
    eyebrow: "One morning · one assistant",
    title: "The ninety minutes you get back",
  },
  state: {
    eyebrow: "Built · building · planned",
    title: "Where it actually stands",
  },
};

/** A morning at the firm — four times, in order. */
export const HOURS = [
  {
    t: "18:40",
    title: "The day's paper lands",
    body: "Forty-odd pages from nine clients — invoices, bank statements, a notice, three photographs of receipts taken at an angle. On a normal evening this is tomorrow's problem. It goes into LedgerOS instead.",
  },
  {
    t: "02:15",
    title: "It gets read, matched and checked",
    body: "Figures lifted off each page by rule, not by guess. Each page matched to a client on its tax ID. Then the month set against the government's own record of it, so anything missing or disagreeing is already found by morning.",
  },
  {
    t: "09:00",
    title: "The assistant opens a sorted list",
    body: "Newest first. What it is, whose it is, the amount, when it's due — and four things flagged as needing a human, out of forty. The ninety minutes of triage is already spent, and it wasn't spent by a person.",
  },
  {
    t: "09:04",
    title: "Judgement, instead of sorting",
    body: "Read the page in place, correct the four, chase the supplier whose invoice never showed up — the one costing the client ₹18,000 in credit. Then export the return and file it. That last part is still yours, and always will be.",
  },
];

export const BOOT = {
  word: "LEDGEROS",
  sub: "CALIBRATING APERTURE",
};

export const OPEN = {
  kicker: "Entering pilot",
  line: ["The month's", "paperwork,", "ready to file."],
  under:
    "Every business in India owes the government a monthly account of what it bought and what it sold. Most hand that job to a chartered accountant, along with a pile — invoices, bank statements, challans, photographs of receipts. LedgerOS reads the pile, files each page to the right client, checks it against the government's own records, and hands the accountant a return that's ready to submit.",
  cue: "Scroll to open",
};

/**
 * The plain-English block. This is the page's load-bearing section for a
 * reader who isn't a CA: the four terms the rest of the site can't avoid,
 * each translated once, in the open, before it is used as shorthand.
 */
export const PLAIN = {
  eyebrow: "In plain English",
  title: "What the work actually is",
  intro:
    "Compliance has its own vocabulary, and it hides a job that is not complicated — only relentless. Four words carry most of it.",
  terms: [
    {
      term: "A return",
      meaning:
        "The monthly statement a business files with the government: everything it sold, everything it bought, and the tax on both. Late or wrong is expensive.",
    },
    {
      term: "Reconciliation",
      meaning:
        "The government already holds its own copy of what your suppliers say they sold you. Reconciling means checking your client's books against that copy, line by line, until the two agree.",
    },
    {
      term: "Input tax credit",
      meaning:
        "Tax a business already paid on its purchases, which it subtracts from what it owes. But only if the paperwork matches the government's copy. When it doesn't, that is real money gone.",
    },
    {
      term: "Filing",
      meaning:
        "Submitting the finished return at the government portal, with a chartered accountant's name against it. LedgerOS never touches this step.",
    },
  ],
  close:
    "Everything before that last word is what LedgerOS does. The accountant keeps the judgement, the signature, and the filing.",
};

export const STATEMENT = {
  big: "Nobody was ever promoted for sorting the post.",
  body: "The first ninety minutes of an articled assistant's day go to triage — opening attachments, working out whose they are, keying the numbers into Tally by hand. It is careful work, and it is the least valuable thing in the building. LedgerOS does it overnight, and it doesn't get bored on page four hundred.",
};

export const DRENCH = {
  lead: "It already reads",
  types: [
    "Tax invoices",
    "Bank statements",
    "GST returns",
    "GSTR-2B",
    "Form 26AS",
    "TDS challans",
  ],
  note: "The last three are government records — what your suppliers reported selling you, and the tax already deducted in your client's name. Those are the ones worth checking your books against, and the ones nobody has time to check by hand.",
};

export const STAGES = [
  {
    n: "01",
    key: "arrives",
    name: "It arrives",
    spec: "Upload today · channels next",
    line: "Whatever the client sent, however they sent it. Today that means dropping files in; the email reader and WhatsApp assistant are what we're building next, so the paperwork lands here without anyone forwarding anything.",
    detail: "Nothing new asked of your clients. That is the whole point.",
  },
  {
    n: "02",
    key: "read",
    name: "It gets read",
    spec: "Deterministic · no AI on numbers",
    line: "The figures are lifted off the page by rule, not by guess — read off the labels an invoice is legally required to carry. No language model is anywhere near a number, because a model that is confidently wrong about ₹4,18,200 is worse than no model at all.",
    detail: "Amounts, dates, GSTIN, PAN, tax sections — whatever that kind of document carries.",
  },
  {
    n: "03",
    key: "matched",
    name: "It finds its client",
    spec: "Tax ID first, name second",
    line: "Matched on hard identifiers before names, because two firms can share a name and no two share a GSTIN. When it can't be sure, the page sits in plain sight marked unmatched, one click from being assigned.",
    detail: "A wrong match is worse than no match. It behaves accordingly.",
  },
  {
    n: "04",
    key: "checked",
    name: "It gets checked",
    spec: "Against the government's own copy",
    line: "Your client's books, set against what the government already holds — supplier by supplier, line by line. What's missing, what doesn't agree, and what tax credit is at risk if nobody chases it. This is the step that finds money.",
    detail: "Differences are surfaced and named, never quietly averaged away.",
  },
  {
    n: "05",
    key: "ready",
    name: "It's ready to file",
    spec: "Portal JSON · Tally XML",
    line: "Out comes the return in the format the government portal accepts, and the vouchers in the format Tally accepts. Nothing is retyped, because nothing was ever typed twice.",
    detail: "LedgerOS preps the filing. The chartered accountant files it. That line does not move.",
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
    ["Your practice only", "It answers about the clients in front of you. Not general trivia."],
  ],
};

export const ROADMAP = {
  title: "The desk is built. Next we go to where the paper is.",
  body: "An invoice raised inside LedgerOS never has to be read at all — a client raises it in their own portal and it lands in the firm's books already structured, already correct. Paper is the legacy input. The next modules go and meet it where it still arrives: the inbox, and the phone.",
  items: [
    { n: "01", name: "Sorted inbox · figures read by rule", state: "Live" },
    { n: "02", name: "One client, one month — the workbench", state: "Live" },
    { n: "03", name: "Checked against government records", state: "Live" },
    { n: "04", name: "Returns out · Tally out", state: "Live" },
    { n: "05", name: "Clients raise their own invoices", state: "Live" },
    { n: "06", name: "Email reader · WhatsApp assistant", state: "Next" },
    { n: "07", name: "Client dashboards · practice CRM", state: "Planned" },
    { n: "08", name: "Tax-law knowledge layer for the assistant", state: "Planned" },
  ],
};

export const ACCESS = {
  big: ["Open it", "on your", "practice."],
  body: "LedgerOS is entering pilot with chartered accountant firms in India. Pilot firms run it against their real month — real clients, real paperwork, real deadlines — keep every hour it saves, and decide what gets built next. Seats are deliberately few, because we answer every one of them personally.",
  terms: [
    ["Your real month", "It runs on your clients and your documents, not a demo set."],
    ["Direct line", "You talk to the people building it. What you say lands in the next build."],
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
  line: "Built for chartered accountant firms in India.",
  meta: "MMXXVI",
};
