# CareerOS Architecture Plan

## Product and delivery principles

CareerOS is a private, single-owner career operating system, not a public SaaS. Build it in verified vertical slices. Persist user-entered evidence first; show explicit empty/insufficient-data states instead of synthetic scores or sample analytics. No feature is considered complete until its data path, authorization, validation, error state, and tests work.

## Repository baseline

The inspected workspace at `d:\CareerOS` is empty. No existing application code or behavior will be overwritten. The first implementation slice is Milestone 1: the deployable Next.js foundation, private owner authentication, PostgreSQL/Prisma, responsive shell, initial dashboard, editable profile/settings, and project documentation/status.

## Target architecture

- **Web:** Next.js App Router, React, TypeScript strict mode, Tailwind CSS, shadcn/ui-compatible components, Lucide icons, Recharts, React Hook Form, and Zod. No Vite.
- **Application backend:** Next.js Server Components for read paths; server actions for same-origin mutations; route handlers for integrations and APIs. Domain services are server-only and separate from UI code.
- **Persistence:** PostgreSQL on Neon with Prisma. PostgreSQL is the source of truth; all personal records are owned/scoped by the sole User ID. Keep production state out of local disk.
- **Authentication:** custom, single-owner credential flow. A one-time CLI bootstrap creates the owner (no public registration and no committed credentials). Use Argon2id password hashes, cryptographically random opaque session tokens stored as hashes in the database, HTTP-only/Secure/SameSite cookies, expiry and rotation, CSRF-aware same-origin mutation checks, login throttling, and authorization checks inside every mutation/service boundary. Never trust a client-supplied owner ID.
- **AI:** provider-neutral server-side interface with schema-validated JSON outputs, explicit timeouts and safe failure when unconfigured. A separately deployable Python service (FastAPI) may own model/provider adapters, embedding, retrieval, and evaluation; the Next.js server calls it with a private service credential. AI is optional and cannot block core workflows. No client receives provider keys or unrestricted database tools.
- **Operations:** Vercel web deployment, Neon PostgreSQL, Docker for the Python service and local dependencies, GitHub Actions for checks, structured redacted logs, health checks, and documented database backup/restore. `.env.example` contains names and safe placeholders only.

## Module boundaries

Organize implementation by domain, with shared UI primitives and server-only infrastructure:

1. `auth` / `profile` / `settings`
2. `planning` / `productivity` / `journal`
3. `learning` with DSA, Java, CS, backend, system-design, and AI subdomains
4. `skills` and evidence-backed readiness
5. `projects` / `branding`
6. `interviews`
7. `jobs` / `companies`
8. `coach` / recommendations
9. `analytics` / exports

Modules share normalized entities through explicit service interfaces. Avoid cross-domain UI importing Prisma directly. Every query uses the authenticated owner context; every mutation validates input and rechecks authorization.

## Core data design

Use a User root and one-to-one profile/settings. Add timestamps and owner foreign keys to private records; use cascading deletion only where data ownership implies it. Add unique constraints for owner-scoped names/identifiers and indexes for owner plus date/status/topic lookups. Store provenance/source and verification time on company/job research. Store evidence references and assessment dimensions for skill ratings. Store actual time separately from planned time. Keep AI conversations and recommendations owner-scoped, with feedback and links to the evidence used. Use Prisma migrations as the schema change record.

Milestone 1 establishes User, Session, UserProfile, UserSettings, and the minimum dashboard/profile supporting records. Add remaining model families with their owning milestone rather than prematurely shipping an untested monolithic schema. All seed data is curriculum/template content; no invented user performance, job openings, offers, or project metrics.

## Evidence and readiness rules

Readiness and skill levels are calculated only from dated, attributable evidence (assessments, independent problem attempts, practical project reviews, and interview evaluations). Course completion alone does not raise a skill rating. Each displayed score must show its formula, evidence count, freshness/confidence, and an insufficient-data state. Initial dashboard has no fabricated readiness numbers. The 12-month roadmap is a suggested, editable plan beginning November 11, 2026; it adapts based on assessment evidence and the user's 180-minute default daily availability.

## Milestone plan and acceptance gates

### Milestone 1 — secure foundation (current first implementation)
- Scaffold Next.js App Router + TypeScript + Tailwind; establish premium dark shell, responsive sidebar, navigation, and design tokens.
- Add PostgreSQL/Prisma schema and migrations, secure owner bootstrap CLI, private login/logout/password change, sessions, rate limiting, protected dashboard and profile/settings.
- Dashboard uses real profile and persisted records; show honest empty states. Profile is editable and seeded with the supplied initial objective through a documented owner-only setup flow.
- Add `.env.example`, README, deployment notes, status tracking, and tests for authentication/authorization and profile mutations.
- Gate: typecheck, lint, tests, production build; review authorization and secret exposure.

### Milestone 2 — learning, DSA, planning, skills
- Curriculum/course content, problem and attempt lifecycle, hints/independent solving, 2/7/14/30-day revisions, mistakes, timed/random practice, quizzes, planner, sessions, evidence assessments.
- Gate: owner isolation, independent-solve rules, scheduling tests, evidence score tests.

### Milestone 3 — projects, journal, productivity, analytics
- Project/milestone/review, journal, focus and time logging, weekly/monthly reviews, genuine database-backed charts and CSV exports.
- Gate: actual-vs-planned calculations and export authorization tests.

### Milestone 4 — system design, interviews, CS and AI academy
- LLD/HLD cases, question bank, interview lifecycle and rubric-backed feedback, CS assessments, AI practical/evaluation tracking.
- AI feedback clearly distinguishes subjective review from verified execution; never claim code ran unless an isolated execution service actually ran it.

### Milestone 5 — branding, JobRadar, company intelligence
- Resumes/versions and uploads via private object storage, grounded job-description matching, profile checklists, manual job entry, application pipeline, sourced company records.
- No restricted scraping, invented jobs/pay, or automatic applications. External integrations require supported APIs and explicit consent.

### Milestone 6 — AI coach and recommendations
- Authorized server-side, least-privilege tools; provider abstraction; RAG over user-authorized content; structured/evaluated outputs; recommendation rationale, continuity, feedback, and safe unconfigured state.

### Milestone 7 — hardening and deployment
- Full tests, accessibility/mobile review, dependency/security review, performance, CI/CD, Vercel/Neon setup, monitoring and backup/restore drill.

## Initial dashboard behavior

Show career objective, current preparation phase and elapsed journey from the configured start date. Metrics are derived from records and remain unavailable until enough evidence exists. Today's top-three tasks come from the persisted plan or a transparent deterministic recommendation rule; they are not generated from fake stats. Include weekly time, DSA independent-solve outcomes, revisions, skill evidence, project milestones, and application follow-ups when present.

## Key risks and mitigations

- **Single-user lockout:** CLI owner bootstrap, password-change flow, expiring sessions, documented secure database recovery; no public reset endpoint.
- **Sensitive data leakage:** server-only secrets, owner-scoped access, no raw prompt/PII in logs, private file storage and bounded uploads, security headers, rate limits.
- **Misleading AI/readiness:** provenance, validation, explicit confidence and insufficient data, no synthetic metrics.
- **Scope overload:** milestone gates and status updates; don't mark incomplete modules as done.
- **Serverless database connections:** Prisma-supported Neon pooling configuration and deployment-specific connection guidance.

## Decisions to revisit only with evidence

Confirm current stable package versions when scaffolding, use compatible versions as a set, and avoid pinning speculative versions in this plan. Select the auth/session implementation and migration workflow based on actual deployed Next.js/Prisma compatibility. Choose AI provider and private object storage only when their milestones are reached.
