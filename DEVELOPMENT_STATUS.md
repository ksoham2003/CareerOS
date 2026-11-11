# CareerOS Development Status

Last updated: 2026-11-11

## Current milestone
Milestones 2–3 — persisted study planning and activity slice, with a cross-platform desktop packaging foundation. The private foundation is running against Neon; study areas, planned minutes, and completed sessions are owner-entered and database-backed. Curriculum content, DSA attempts, skill assessments, and the remaining project/interview/job/coach workflows are not complete.

## Completed
- Inspected workspace; no existing files or working code were present.
- Added `ARCHITECTURE.md` with domain boundaries, security model, readiness rules, milestones, validation gates, and operational risks.
- Scaffolded Next.js App Router, TypeScript, Tailwind, ESLint, Prisma 6 and the responsive dark workspace shell in `web/`.
- Implemented private owner login/logout, Argon2id password hashing, hidden-input one-time owner bootstrap, opaque hashed 14-day sessions, password change with session revocation, and PostgreSQL-backed login throttling.
- Protected the workspace route group; implemented an owner-scoped editable career profile and settings/password screen.
- Applied the initial PostgreSQL migration for User, Session, UserProfile, UserSettings, and LoginThrottle to the configured Neon database.
- Provisioned the private owner account and verified the database connection.
- Added an owner-scoped StudySession model and applied its additive migration to Neon.
- Added owner-scoped StudyPlanItem records and a separate migration to clear verified scaffold study defaults and journey date from Neon.
- Added validated create/remove study-plan actions and session logging; dashboard, planner, learning, skills, productivity, and reports views read persisted study records only.
- Removed the hardcoded curriculum, time allocation, priority topics, assessment areas, sample report metrics, and scaffold journey date.
- Added Windows, universal macOS, and Linux x64 Electron builds, a multi-runner GitHub Release workflow, homepage download links, and configurable release redirects.
- Added all primary navigation destinations and clearly marked not-yet-built module pages without fake functionality or data.
- Added security response headers, `.env.example`, setup notes, and Prisma scripts.
- Verified Prisma schema validation, TypeScript, ESLint, and optimized production build.

## In progress
- Build the learning workflow beyond saved study areas and session logging: curriculum records, DSA problem attempts, revisions, and evidence-backed skill assessments.
- Add editing/reordering and schedule dates to study-plan items; current items store topic, focus area, and planned minutes.

## Remaining
- Add automated tests for login throttling, session expiry, owner authorization, and profile mutations.
- Improve authentication hardening (trusted-proxy configuration, stale throttle cleanup, recovery/runbook review) and perform a security review.
- Implement persisted curriculum, attempts, revisions, assessments, projects, interviews, applications, and analytics as milestone slices.
- Complete roadmap persistence and accessibility/mobile review.
- Add deployment, monitoring, and tested backup/restore guidance; production deployment has not been validated.

## Known limitations
- Study-session logging records completed sessions; it does not yet support editing, deleting, or planned-versus-actual schedule comparisons.
- DSA, skill, project, interview, job, and coach metrics remain unavailable until their data workflows are persisted and verified.
- Production deployment, login/profile browser smoke tests, backup/restore, and monitoring are not yet validated.

## Database changes
- Initial owner/auth/profile migration applied to Neon.
- `StudySession` migration applied to Neon; sessions are indexed by owner and completion timestamp.

## Deployment status
- Not deployed. The development Neon database is configured; production deployment and the GitHub remote are not configured.

## Validation results
- `npx prisma validate`: passed.
- `npm run db:migrate -- --name study_session_tracking`: passed; migration applied to Neon and Prisma Client regenerated.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: passed (11 tests after removing hardcoded study-plan tests).
- `npm run build`: passed.
- Production deployment and end-to-end browser workflows remain unverified.
- Deploy the web app, configure the GitHub remote and `CAREEROS_WEB_URL`, publish the platform installers, and set the three download URLs before homepage downloads become live release links.
