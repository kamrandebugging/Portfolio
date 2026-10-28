import labflowImg from '../assets/labflow.webp';
import fbrImg from '../assets/fbr-integrated-invoicing-system.webp';
import fundoraImg from '../assets/fundoraglobal.webp';

export interface CaseStudyFlowStep {
  title: string;
  desc: string;
}

export interface CaseStudyFeature {
  title: string;
  desc: string;
}

export interface CaseStudyLink {
  label: string;
  url: string;
}

export interface CaseStudy {
  slug: 'labflow' | 'fbr' | 'fundoraglobal';
  name: string;
  tagline: string;
  status: string;
  year: string;
  image: string;
  imageAlt: string;
  problem: string;
  built: string[];
  architecture: CaseStudyFlowStep[];
  stack: string[];
  features: CaseStudyFeature[];
  links: CaseStudyLink[];
}

export const caseStudies: Record<CaseStudy['slug'], CaseStudy> = {
  labflow: {
    slug: 'labflow',
    name: 'LabFlow',
    tagline:
      'A multi-tenant SaaS for diagnostic labs in Pakistan, built backend-first: the data model, tenancy and test suite are real and verifiable; the API and UI are the next milestone.',
    status:
      'Backend and data model built and under test. No REST API endpoints or frontend UI shipped yet — the frontend repo is a placeholder scaffold.',
    year: 'Django 5 · django-tenants · PostgreSQL',
    image: labflowImg,
    imageAlt: 'LabFlow — multi-tenant diagnostic lab platform',
    problem:
      "Diagnostic labs in Pakistan run patient registration, sample handling, results and partner billing on paper or spreadsheets, often across more than one branch with no real separation between them. Before any of that can be a product, the flow has to be modelled correctly and the data has to be provably isolated per lab — that's the part LabFlow set out to get right first.",
    built: [
      'Django 5 + django-tenants on PostgreSQL, with schema-per-tenant isolation — every clinical table lives inside its own lab’s database schema, not behind an application-level filter.',
      'Ten Django apps modelling the real flow: accounts and roles (owner, manager, reception, technician, pathologist), branches, patients, catalog (tests and panels), samples, results, reports, billing, partner revenue-share, webhook automation, and bilingual notifications.',
      'An append-only audit log, enforced at the database level, on both tenant and platform tables — rows are written once and never updated or deleted.',
      'A large pytest suite: per-app model tests, dedicated cross-tenant isolation tests, and a "definition of done" verification script for each build stage.',
      'CI on every push — ruff and mypy for the backend, ESLint and Prettier for the frontend scaffold.',
    ],
    architecture: [
      {
        title: 'Patient & invoice',
        desc: 'A patient is registered at a branch and billed; the invoice tracks status from unpaid through paid or refunded.',
      },
      {
        title: 'Sample',
        desc: 'A sample gets a Code128 accession ID and one of six statuses, with a nine-reason rejection code if it fails intake.',
      },
      {
        title: 'Result',
        desc: 'A technician enters a value per test; it is flagged low, normal, high or critical against that test’s reference range.',
      },
      {
        title: 'Pathologist approval',
        desc: 'A result moves from entered to approved — or rejected, amended or withdrawn — before it can appear on a report.',
      },
      {
        title: 'Report',
        desc: 'A report carries a version and a status — draft, final, amended or void — never soft-deleted, only voided.',
      },
      {
        title: 'Partner revenue-share',
        desc: 'If a referral partner is attached, an effective-dated share rule computes their ledger entry at settlement.',
      },
    ],
    stack: [
      'Django 5',
      'Django REST Framework',
      'django-tenants',
      'PostgreSQL 16',
      'Redis',
      'pytest · factory_boy',
      'ruff · mypy',
      'React 18 + TypeScript (frontend — scaffolded, not yet built)',
    ],
    features: [
      {
        title: 'Schema-per-tenant isolation',
        desc: 'Each lab’s data lives in its own PostgreSQL schema, checked by dedicated cross-tenant isolation tests, not just an application-level WHERE clause.',
      },
      {
        title: 'Accession and rejection workflow',
        desc: 'Every sample gets a Code128 accession ID and one of nine structured rejection reasons — unlabelled, hemolyzed, clotted, and so on — instead of a free-text note.',
      },
      {
        title: 'Reference-range flagging',
        desc: 'Results are stored as the value entered, with a separate low/normal/high/critical flag computed against that test’s reference range — never guessed when it can’t be determined.',
      },
      {
        title: 'Revenue-share ledger',
        desc: 'Referral partners carry effective-dated share rules per test category and branch, feeding a ledger and settlement model rather than a flat percentage.',
      },
      {
        title: 'Bilingual notification templates',
        desc: 'Templates are keyed by locale (English/Urdu) and channel (email/WhatsApp), so messaging isn’t hardcoded per notification.',
      },
      {
        title: 'Append-only audit log',
        desc: 'Every tenant and platform mutation is recorded in a log that permits inserts only — enforced by the schema, not just application discipline.',
      },
    ],
    links: [{ label: 'Repository', url: 'https://github.com/kamrandebugging/LabFlow' }],
  },

  fbr: {
    slug: 'fbr',
    name: 'FBR-Integrated Invoicing System',
    tagline:
      'A multi-tenant Laravel invoicing platform used day to day for bookkeeping, with an FBR digital-invoicing submission wired to FBR’s sandbox gateway.',
    status:
      'In everyday use for invoicing, customers, purchases and reporting. The FBR digital-invoicing submission currently targets FBR’s sandbox endpoint — integration is wired and working there, but it is not yet finalized for live production submission.',
    year: 'Laravel · PHP · MySQL',
    image: fbrImg,
    imageAlt: 'FBR-Integrated Invoicing System — multi-tenant invoicing platform',
    problem:
      'Businesses in Pakistan need to report invoice data to FBR (the Federal Board of Revenue) digitally, on top of ordinary bookkeeping — customers, suppliers, products, purchases and sales. The platform needed both: a real multi-tenant ledger a business runs on every day, and a path to submit invoice data to FBR’s gateway and check a party’s registration type before invoicing them.',
    built: [
      'A multi-tenant Laravel app with separate landlord and tenant databases, tenant-aware middleware, and role-gated access (owner, admin, accountant) on every route.',
      'A full bookkeeping surface: customers and suppliers (with CSV import/export), products, purchases, bulk invoice import, sale reports, role management and an audit log.',
      'A purchase "breakup" pipeline — generates the tax and line-item breakdown for a purchase as a background job, with a status-polling preview and an Excel export.',
      'An FBR integration layer: a registration-type verification call for customers and suppliers (FBR’s Get_Reg_Type gateway), and a "post to FBR" action that submits a purchase breakup to FBR’s digital-invoicing endpoint.',
    ],
    architecture: [
      {
        title: 'Customer & supplier onboarding',
        desc: 'A party is added and can be checked against FBR’s registration-type gateway before any invoice is raised against them.',
      },
      {
        title: 'Purchases & products',
        desc: 'Purchases are recorded against the product and supplier ledger, with bulk import via Excel for existing records.',
      },
      {
        title: 'Breakup generation',
        desc: 'A background job computes the tax/line-item breakup for a purchase; its status is polled until the job completes.',
      },
      {
        title: 'Review',
        desc: 'The generated breakup is previewed and can be exported before anything is sent to FBR.',
      },
      {
        title: 'Post to FBR (sandbox)',
        desc: 'The breakup is submitted to FBR’s digital-invoicing sandbox endpoint; the result is stored against the job.',
      },
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Guzzle (FBR gateway calls)', 'Laravel Excel', 'Multi-tenant middleware'],
    features: [
      {
        title: 'Multi-tenant with role-gated access',
        desc: 'Separate landlord/tenant databases and middleware, with owner/admin/accountant roles enforced per route.',
      },
      {
        title: 'FBR registration-type verification',
        desc: 'Customers and suppliers can be checked against FBR’s Get_Reg_Type gateway before they’re invoiced.',
      },
      {
        title: 'Purchase tax breakup generator',
        desc: 'A background job builds the full tax/line-item breakdown for a purchase, previewable and exportable to Excel.',
      },
      {
        title: 'Bulk invoice and customer import',
        desc: 'Excel-based bulk import for invoices, customers and purchase ledgers, with a downloadable template.',
      },
      {
        title: 'Sale reporting and audit log',
        desc: 'Printable sale reports and a tenant-scoped audit log of who changed what.',
      },
    ],
    links: [{ label: 'Repository', url: 'https://github.com/Kamrandebug/Digital_invoiceing' }],
  },

  fundoraglobal: {
    slug: 'fundoraglobal',
    name: 'FundoraGlobal',
    tagline:
      'A complete pre-build technical architecture for a prop-trading challenge-account platform — nine specification documents covering schema, every module’s API, and the delivery plan, written before application code.',
    status:
      'Architecture and specification stage: the system design is complete and build-ready. Initial repository and environment scaffolding has started; the product modules themselves (auth, rules engine, trading, and the rest) are not yet reported as built.',
    year: 'Next.js · NestJS · System design',
    image: fundoraImg,
    imageAlt: 'FundoraGlobal — prop-trading challenge platform architecture',
    problem:
      'Selling trading-challenge accounts — a user pays for an evaluation, trades on a provisioned MT4/MT5 account, passes rule-based targets, and gets funded with a profit split — touches real money, KYC and a live trading-platform integration in one product. The brief was to turn a set of Figma screens and a scope conversation into a build-ready architecture a two-developer team could execute in three months without re-deciding the hard parts mid-build.',
    built: [
      'A full relational schema (PostgreSQL) for users, challenge models/pricing/rules, trading accounts, orders, payments, withdrawals, KYC submissions, achievements, affiliate and rewards programs, leaderboard snapshots, notifications, chat and an append-only audit log.',
      'A complete API surface specified module by module: auth (with 2FA and single-use backup codes), onboarding, in-house KYC, the rules engine’s compliance calculator, orders and payments as an idempotent saga, the MT4/MT5 trading adapter, withdrawals, achievements, affiliate, rewards, leaderboard, market data, notifications, AI-plus-human chat, and the full admin dashboard.',
      'A cross-cutting design for security (concrete OWASP Top 10 mitigations, encryption at rest, tiered rate limiting), resilience (a shared circuit breaker wrapping every third-party call), real-time delivery (an internal event bus feeding a Socket.IO/Redis gateway), observability (Prometheus, Grafana, Loki) and a CI/CD pipeline.',
      'A phased delivery plan — Initialize, Website, Admin Dashboard, User Dashboard, then Hardening — mapped to Jira epics, with a documented ~11.5–14 week estimate against the three-month window.',
      'Initial repository and local-development environment scaffolding underway (Docker Compose for Postgres/Redis/Garage/Traefik, a pnpm monorepo).',
    ],
    architecture: [
      {
        title: 'Buy a challenge',
        desc: 'An order is created, payment is taken (crypto via an adapter interface), and — only once payment is confirmed — a trading account is provisioned as a background job, never inline with the request.',
      },
      {
        title: 'Trade the evaluation',
        desc: 'A compliance calculator — one pure function, shared by the backend and the dashboard — evaluates daily-loss and drawdown rules against live MT4/MT5 account data on every sync.',
      },
      {
        title: 'Pass or breach',
        desc: 'A breach transitions the account to breached and triggers a stop-out through the trading adapter; passing moves it to the next phase or to funded.',
      },
      {
        title: 'KYC, gated by funding',
        desc: 'In-house document review unlocks once an account is funded, not at registration — a deliberate, confirmed sequencing decision.',
      },
      {
        title: 'Withdraw',
        desc: 'A funded trader requests a payout; every withdrawal enters a manual admin-review queue — no automatic disbursement in v1.',
      },
    ],
    stack: [
      'Next.js (React + TypeScript)',
      'NestJS (Node + TypeScript)',
      'PostgreSQL',
      'Redis',
      'BullMQ',
      'Socket.IO',
      'Garage (S3-compatible storage)',
      'Payload CMS',
      'Docker Compose · Traefik',
    ],
    features: [
      {
        title: 'Swappable provider adapters',
        desc: 'Payments (NOWPayments) and the trading platform (MetaApi/MT4/MT5) sit behind one shared adapter interface, so a new provider is a new class, not a rewrite of orders or trading logic.',
      },
      {
        title: 'Saga-based, idempotent checkout',
        desc: 'Buying a challenge is modelled as a multi-step saga with a database-level idempotency constraint, so a duplicate or retried request can’t double-charge or double-provision.',
      },
      {
        title: 'One compliance calculator, two consumers',
        desc: 'The same pure function that enforces daily-loss and drawdown rules server-side also powers the dashboard’s progress bars — no drift between what’s enforced and what’s displayed.',
      },
      {
        title: 'Honest refund model for crypto',
        desc: 'A crypto payment can’t be reversed, so a refund is modelled as a new outbound payout requiring a destination wallet — not a one-click "refund" that doesn’t match how crypto actually works.',
      },
      {
        title: 'Event-driven engagement features',
        desc: 'Achievements, affiliate commissions and notifications all subscribe to the same internal domain-event bus instead of each hand-rolling its own trigger logic.',
      },
      {
        title: 'Redis-backed leaderboard',
        desc: 'Rankings are kept in Redis sorted sets for O(log N) updates and reads, snapshotted to Postgres hourly for history — not computed from a live table scan.',
      },
    ],
    links: [],
  },
};

export const caseStudyOrder: CaseStudy['slug'][] = ['labflow', 'fbr', 'fundoraglobal'];
