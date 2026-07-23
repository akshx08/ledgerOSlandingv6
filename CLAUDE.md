# LedgerOS landing site — read this before touching copy

This is the marketing site for **LedgerOS**, the operating system a Chartered
Accountant firm runs its practice on. The product's ground truth lives in the
product repo (`digi0/ledgerOS` → `CLAUDE.md`, `README.md`, `GOALS.md`) — when
copy and code disagree, the product repo wins.

## The facts copy must never break

- **LedgerOS does not file taxes.** It preps everything a CA needs to file —
  reconciled registers, portal-ready GSTR-1 JSON, Tally XML — and the CA
  files. Prep, not filing, is the product.
- **It is not a document collector.** Documents are the legacy input the
  product works to make unnecessary: a client raises its invoice inside the
  business portal and it lands in the firm's books born-structured, no
  parsing. The deterministic parser is the migration path for paper.
- **No LLM ever touches a number.** Parsing/classification is deterministic
  (regex + an India knowledge base, confidence-scored, ambiguity flagged for
  humans). Claude powers only the copilot, which answers with citations and
  never produces figures. Do not credit classification to AI/Claude.
- **Live today:** inbox + deterministic parse, client × month workbench,
  GSTR-2B recon + GSTR-1, TDS/26AS + registers, Tally export, compliance
  calendar, business portal, grounded copilot, per-firm auth.
- **Planned, NOT built** (mark as coming, never as live): email scraper,
  WhatsApp agent (client comms + document intake), client dashboard access,
  practice CRM, knowledge layer.
- LedgerOS is **not a Precedal product**. No Precedal branding anywhere.

## Working in this repo

- All copy lives in `lib/content.ts` — JSX never hard-codes content. Edit
  copy there; keep the voice (terse, imperative, machined).
- Heavy motion work (hero shatter, stage scenes) lives in `components/` —
  Assembly/Stage/Hero. Don't touch choreography for a copy change.
- `BRAND.maker` renders as a chip after the wordmark in Dock and Foot — it's
  a tagline slot, not a company name.
