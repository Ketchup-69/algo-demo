/**
 * All page copy, as typed objects. Components import from here and contain no
 * hardcoded strings (CLAUDE.md §6) — the owner edits this file weekly without
 * touching JSX.
 *
 * Anything still filler carries `placeholder: true` and a `PLACEHOLDER:`
 * comment naming what has to happen before launch.
 */

/* ------------------------------------------------------------------ hero -- */

export const hero = {
  id: "hero",
  h1: "AI agents that work inside the systems your finance team already uses.",
  sub: "Algomotive deploys agents across payables, receivables, procurement and cash. They read from your ERP, prepare the work, and wait for a person to approve it.",
  primaryCta: { label: "Talk to us", href: "/#contact" },
  secondaryCta: { label: "See how it works", href: "/#how-it-works" },
  supporting: "Compliant AI agents for regulated enterprises.",
  /** Accessible description of the hero diagram, for screen readers. */
  visualAlt:
    "Diagram of the agent pipeline: purchase order, goods received note and invoice records converge on a matching step, exceptions branch off for review, and approved items pass a human approval gate before being recorded.",
  /**
   * Labels drawn inside the hero diagram. They are real product vocabulary,
   * not decoration, which is why they live here with the rest of the copy.
   */
  visual: {
    title: "Three-way match",
    status: { pending: "Awaiting approval", approved: "Approved" },
    records: ["Purchase order", "Goods received", "Invoice"],
    match: "Match",
    exception: "Exception",
    gate: "Approval",
    ledger: "Ledger",
  },
} as const;

/* ------------------------------------------------------------- logo strip -- */

export type LogoSlot = {
  /** Accessible name of the organisation. Empty while the slot is a placeholder. */
  name: string;
  /** Path under /public, e.g. "/logos/example.svg". Empty while a placeholder. */
  src: string;
};

/**
 * PLACEHOLDER: replace when client logos are approved.
 *
 * CLAUDE.md §2 forbids client names and logos, including in placeholders, so
 * every slot below is deliberately empty and the strip renders neutral tiles
 * with a visible note. To populate: fill `name` and `src` on each slot, then
 * set `placeholder: false`. To ship without the strip: `enabled: false`.
 *
 * Edit: src/content/sections.ts → logos
 */
export const logos = {
  id: "logos",
  enabled: true,
  placeholder: true,
  placeholderNote: "Client logos pending approval",
  slotLabel: "Logo",
  slots: [
    { name: "", src: "" },
    { name: "", src: "" },
    { name: "", src: "" },
    { name: "", src: "" },
    { name: "", src: "" },
    { name: "", src: "" },
  ] as LogoSlot[],
} as const;

/* --------------------------------------------------------------- problem -- */

export type StatSlot = {
  /** The figure itself. Filler until the owner supplies a measured number. */
  value: string;
  label: string;
};

export const problem = {
  id: "problem",
  h2: "Most of a finance team's week is matching, chasing, and rebuilding the same report.",
  body: "Purchase orders against goods received against invoices. Supplier statements against the ledger. Customers against their own payment promises. The work is high-volume, rules-based, and unforgiving of a missed line — which is exactly the work people are worst at and quickest to burn out on.",
  followOn:
    "Across a multi-entity operation, that work multiplies by the number of entities, systems, and outlets. Headcount is the only lever most teams have.",

  /**
   * PLACEHOLDER: these three figures are deliberately non-numeric so they
   * cannot be mistaken for measured results. Replace `value` on each with a
   * real figure the owner can stand behind, then set `placeholder: false`.
   * While `placeholder` is true the row renders with a visible "example" flag.
   *
   * Edit: src/content/sections.ts → problem.stats[n].value / .label
   */
  stats: {
    placeholder: true,
    items: [
      { value: "—", label: "Example metric slot one" },
      { value: "—", label: "Example metric slot two" },
      { value: "—", label: "Example metric slot three" },
    ] as StatSlot[],
    note: "Example slots. Figures pending.",
  },
} as const;

/* ---------------------------------------------------------------- agents -- */

export type Agent = {
  name: string;
  /** Where this agent sits in the money cycle — used as the stage label. */
  stage: string;
  description: string;
};

export const agents = {
  id: "agents",
  h2: "Four agents, deployed on your stack.",
  intro:
    "Each one owns a defined process end to end and reports what it did. They are deployed to your environment and configured against your data, not handed to you as a generic tool.",
  items: [
    {
      name: "Purchase Order Agent",
      stage: "Commit",
      description:
        "Matches purchase order, goods received note and invoice line by line, flags what does not reconcile, and routes each exception to the person who can clear it.",
    },
    {
      name: "Accounts Payable Agent",
      stage: "Pay",
      description:
        "Reconciles supplier statements against your ledger, surfaces missing and duplicated invoices, and drafts the payment run for approval.",
    },
    {
      name: "Receivables Agent",
      stage: "Collect",
      description:
        "Builds a collection queue ordered by what is actually likely to be paid, and drafts each follow-up at the right time in the right tone.",
    },
    {
      name: "Cash and DSO Agent",
      stage: "Measure",
      description:
        "Tracks days sales outstanding as it moves, scores customer risk, and forecasts collections seven and thirty days out.",
    },
  ] as Agent[],
  closing:
    "Deployment is measured in weeks. Each agent goes live against a defined process, with a baseline agreed before it starts.",
} as const;

/* --------------------------------------------------------- how it works -- */

export type Step = {
  title: string;
  description: string;
};

export const howItWorks = {
  id: "how-it-works",
  h2: "Agents prepare. People validate. Systems record.",
  /**
   * This is a genuine sequence, which is the one place CLAUDE.md §4 permits
   * numbered markers. Do not copy this pattern to any other section.
   */
  steps: [
    {
      title: "Connect, read-only.",
      description:
        "Agents read from the ERP and PMS you already run. No schema changes, no migration, nothing rewritten. Write access is granted later, per process, only once the controls have been proven.",
    },
    {
      title: "Agents do the work.",
      description:
        "They collect the documents, reconcile them, draft the action, and show their working — including what they could not resolve and why.",
    },
    {
      title: "A person approves.",
      description:
        "Nothing posts to a system of record without a human decision. Every step, every source and every approval is logged.",
    },
  ] as Step[],
  /**
   * Labels drawn inside the process diagram that sits beside the steps. One
   * scene, three states: the reader's position in the steps is the position
   * in the process.
   */
  scene: {
    alt: "Diagram of the process: an agent reads from the ERP, property management system and bank feed; prepares matched items, exceptions and drafts; a controller approves; only then is anything posted to the system of record and logged.",
    sources: ["ERP", "PMS", "Bank feed"],
    agent: "Agent",
    access: { read: "Read-only", write: "Write, per process" },
    prepared: ["Matched", "Exception", "Draft"],
    approver: "Controller",
    approved: "Approved",
    record: "System of record",
    audit: "Logged: source, decision, approver, time",
  },
} as const;

/* ------------------------------------------------------- beyond finance -- */

export type Category = {
  label: string;
  description: string;
};

export const beyondFinance = {
  id: "beyond-finance",
  h2: "The same pattern applies past the finance function.",
  intro:
    "Finance is where the return is fastest to measure. It is not the boundary of what an agent layer can own.",
  categories: [
    {
      label: "Procurement and supply",
      description:
        "Requisition to purchase order, supplier onboarding, contract and price-list checks.",
    },
    {
      label: "Knowledge retrieval",
      description:
        "Grounded answers over policies, contracts and internal documents, with citations back to the source.",
    },
    {
      label: "Operations and maintenance",
      description:
        "Work order triage, asset and project status, exception reporting across sites.",
    },
    {
      label: "Guest and customer experience",
      description:
        "Multilingual front-of-house support and review response, handing to a person on escalation.",
    },
    {
      label: "HR and corporate",
      description:
        "Document handling, onboarding workflows, and internal request routing.",
    },
  ] as Category[],
  closing:
    "Every deployment starts with a discovery phase that identifies which processes are worth automating, and which are not.",
} as const;

/* ------------------------------------------------------------ governance -- */

export const governance = {
  id: "governance",
  h2: "The controls come first, not after.",
  intro:
    "Enterprise buyers do not stall on whether an agent can do the work. They stall on what happens when it gets something wrong.",
  points: [
    {
      label: "Human approval on every action.",
      description:
        "Agents draft and recommend. A named person authorises anything that changes a system of record.",
    },
    {
      label: "Grounded, permissioned retrieval.",
      description:
        "Agents only see what the role behind them is allowed to see, and answers cite the record they came from.",
    },
    {
      label: "Complete audit trail.",
      description:
        "Every input, decision, approval and output is logged and exportable for audit.",
    },
    {
      label: "Data residency and model tiering.",
      description:
        "Public, internal and restricted data are handled differently, up to and including self-hosted inference for restricted workloads.",
    },
  ] as Category[],
  /**
   * An illustrative approval queue, built in code rather than screenshotted.
   * Identifiers are generic document numbers, never a customer or supplier
   * name (§2). `caption` states plainly that it is not a screenshot, and it is
   * rendered whenever `illustrative` is true.
   */
  console: {
    illustrative: true,
    caption: "Illustrative interface, not a screenshot.",
    title: "Approval queue",
    columns: { item: "Item", agent: "Agent", status: "Status" },
    rows: [
      { item: "Supplier statement 0417", agent: "Accounts Payable", status: "pending" },
      { item: "Payment run, week 37", agent: "Accounts Payable", status: "pending" },
      { item: "PO 8830 three-way match", agent: "Purchase Order", status: "exception" },
      { item: "Collections queue, 14 days", agent: "Receivables", status: "approved" },
    ] as ConsoleRow[],
    statusLabels: {
      pending: "Awaiting approval",
      approved: "Approved",
      exception: "Needs review",
    },
    /** The audit line that appends when the first row is approved on reveal. */
    auditTitle: "Audit trail",
    auditLines: [
      "Source: supplier statement, ledger",
      "Decision: approve",
      "Approver: Financial Controller",
    ],
  },
} as const;

export type ConsoleRow = {
  item: string;
  agent: string;
  status: "pending" | "approved" | "exception";
};

/* ---------------------------------------------------------- integrations -- */

export const integrations = {
  id: "integrations",
  h2: "Built to sit on top of what you run.",
  body: "Agents read from your existing finance and property systems through their supported interfaces. Nothing is replaced.",

  /**
   * CLAUDE.md §2 forbids naming any other vendor or platform. The Phase 1
   * brief overrides that for this list specifically, on the grounds that these
   * are software categories the buyer already runs rather than customer or
   * partner references — and no logos are used, only plain type.
   *
   * `showSystems: false` removes the entire list in one edit if that call is
   * ever reversed; the section still renders its heading, body and closing.
   *
   * Edit: src/content/sections.ts → integrations.showSystems / .systems
   */
  showSystems: true,
  systems: [
    "SAP",
    "Oracle",
    "Oracle OPERA",
    "Microsoft Dynamics",
    "SUN Systems",
    "Sage",
    "QuickBooks Enterprise",
    "Zoho",
  ],
  closing:
    "If a system is not on this list, that is a discovery question, not a blocker.",
} as const;

/* ----------------------------------------------------------------- proof -- */

export type Outcome = {
  metric: string;
  label: string;
  context: string;
};

/**
 * PLACEHOLDER SECTION — entirely filler.
 *
 * TO POPULATE: edit `src/content/sections.ts` → the `proof` object.
 *   proof.outcomes[n].metric   the figure
 *   proof.outcomes[n].label    what it measures
 *   proof.outcomes[n].context  the qualifying detail
 *   proof.quote.text           the quotation itself
 *   proof.quote.attribution    role and sector only — CLAUDE.md §2 forbids
 *                              naming a customer, so never put a company here
 *   proof.placeholder = false  removes the "example content" banner
 *
 * TO SHIP WITHOUT IT: set `proof.enabled = false`. The section then renders
 * nothing at all and drops out of the page and the nav. That is the single
 * flag referenced in the Phase 1 brief.
 */
export const proof = {
  id: "proof",
  enabled: true,
  placeholder: true,
  h2: "Deployment outcomes",
  intro:
    "Example structure only. Figures and quotation below are filler and are not real results.",
  placeholderNotice: "Example content — not real results.",
  outcomes: [
    {
      metric: "00",
      label: "Lorem ipsum metric",
      context: "Dolor sit amet, consectetur adipiscing elit.",
    },
    {
      metric: "00",
      label: "Sed do eiusmod metric",
      context: "Tempor incididunt ut labore et dolore magna.",
    },
    {
      metric: "00",
      label: "Ut enim ad minim metric",
      context: "Quis nostrud exercitation ullamco laboris.",
    },
  ] as Outcome[],
  quote: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    // Role and sector only. Never a company name (§2).
    attribution: "Role pending, sector pending",
  },
} as const;

/* ------------------------------------------------------------ blog strip -- */

export const blogTeaser = {
  id: "blog",
  h2: "Writing",
  intro: "Notes on deploying agents inside finance functions that already work.",
  allLabel: "All posts",
  allHref: "/blog",
} as const;

/* --------------------------------------------------------------- contact -- */

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  required: boolean;
  autoComplete?: string;
};

export const contact = {
  id: "contact",
  h2: "Tell us what your finance team spends its week on.",
  body: "We will tell you honestly whether an agent is the right answer for it.",
  fields: [
    { name: "name", label: "Name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
    { name: "company", label: "Company", type: "text", required: true, autoComplete: "organization" },
    { name: "role", label: "Role", type: "text", required: true, autoComplete: "organization-title" },
    { name: "message", label: "What does the week look like?", type: "textarea", required: true },
  ] as Field[],
  submitLabel: "Send",
  /** Shown beside the button. `mailto:` is the whole mechanism (§7), so say so. */
  submitNote: "Opens in your email app.",
  /**
   * The `mailto:` composer. `{company}` and `{name}` are substituted from the
   * form. The body lists every field on its own line.
   */
  subjectTemplate: "Website enquiry from {name}, {company}",
  composer: {
    title: "Your email app should have opened.",
    body: "If nothing happened, copy the address or the message and send it from wherever you read email.",
    addressLabel: "Address",
    copyAddress: "Copy address",
    copyMessage: "Copy message",
    copied: "Copied",
    /** Shown when the clipboard is unavailable; the text is selected instead. */
    copyFailed: "Selected. Copy it with your keyboard.",
    edit: "Edit the message",
  },
  errors: {
    required: "This field is required.",
    email: "Enter a valid work email address.",
  },
} as const;

/* ------------------------------------------------------------- not found -- */

export const notFound = {
  title: "That page is not here.",
  body: "The address may have changed, or it never existed. Everything on the site is one page down from the start.",
  cta: { label: "Back to the start", href: "/" },
} as const;

/* ---------------------------------------------------------------- legal -- */

export const legalPages = {
  privacy: {
    title: "Privacy",
    // PLACEHOLDER: replace with the reviewed privacy policy before launch
    note: "This page is a placeholder. The privacy policy is pending review and will be published before launch.",
  },
  terms: {
    title: "Terms",
    // PLACEHOLDER: replace with the reviewed terms of use before launch
    note: "This page is a placeholder. The terms of use are pending review and will be published before launch.",
  },
} as const;
