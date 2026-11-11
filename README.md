# CareerOS

Private, single-owner career development operating system. CareerOS is being developed in gated milestones; see [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) for what is implemented and [ARCHITECTURE.md](ARCHITECTURE.md) for the architecture and delivery plan.

## Product guarantees

- No public signup; owner provisioning is performed through a secure CLI setup flow.
- Personal records are private and owner-scoped.
- Readiness and analytics use actual evidence and show insufficient-data states instead of invented metrics.
- AI is optional and isolated behind server-side provider interfaces.
- Study areas, planned minutes, and completed sessions are owner-entered and stored in PostgreSQL; dashboards do not contain seeded study topics or activity.

## Development

The Next.js application is in [web](web/). Use Node.js 20.19+ and npm. From that directory, install dependencies, copy `.env.example` to `.env`, and set a private PostgreSQL `DATABASE_URL`. Then run `npm run db:generate`, `npm run db:migrate`, and `npm run owner:create`. The owner command prompts for email and a hidden password; it refuses a second owner. Finally run `npm run dev`. Do not commit `.env` or credentials.

Useful checks from [web](web/): `npm run typecheck`, `npm run lint`, and `npm run build`.

## Desktop

The Electron client is in [desktop](desktop). It opens the same hosted CareerOS app and does not contain database credentials. Windows, universal macOS, and Linux x64 installers are built on native GitHub Actions runners. Packaging requires a deployed HTTPS URL in `CAREEROS_WEB_URL`; publishing a `desktop-v*` tag creates a GitHub Release. Configure the three platform-specific download URLs in the web deployment to enable the homepage links. The app is not yet deployed and this workspace has no GitHub remote, so installers cannot be published yet. macOS builds are unsigned and may show Gatekeeper warnings.

## Deployment

Target deployment is Vercel with Neon PostgreSQL. Configure the production `DATABASE_URL` only in Vercel server-side environment settings, run `npm run db:deploy` as the controlled migration step, and set `COOKIE_SECURE=true` (production also enforces Secure cookies). Configure ingress to overwrite forwarding headers used by login throttling. Use Neon backups/branching for recovery; test restoration before relying on it. Deployment, backups, restore, monitoring, and recovery are not yet validated. No deployment has been performed.
