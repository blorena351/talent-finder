# Talent Finder

Talent Finder is an intelligent interview platform with AI-assisted question generation, interview analysis, and candidate profile scoring.

## Architecture

- Frontend: React 19 + TypeScript + Vite
- Backend API: Node.js + Express
- AI Provider: Google GenAI (server-side only)

## Environment

Copy `.env.example` to `.env.local` and set:

- `GEMINI_API_KEY`: Gemini key used only by backend
- `PORT`: server port (default `8787`)
- `VITE_API_BASE_URL`: keep empty in local/dev when using same server/proxy
- `VITE_ENABLE_DEMO`: `false` in production
- `ADMIN_EMAIL`: admin account email for backoffice
- `ADMIN_PASSWORD`: admin account password for backoffice
- `SHOW_VERIFICATION_CODE`: set `true` only in non-production for email-code debug
- `DISABLE_EMAIL_VERIFICATION`: set `true` to skip email-code verification in signup (recommended for demo/testing)

## Run Locally

1. Install dependencies:
   `npm install`
2. Development (API + frontend):
   `npm run dev:full`
3. Production-like local run:
   `npm run start:prod`
4. Open:
   [http://localhost:8787](http://localhost:8787)

## Deploy (Render)

1. Push this project to GitHub.
2. In Render, create a new Blueprint and point to this repo.
3. Render reads `render.yaml` automatically.
4. Set `GEMINI_API_KEY` in Render environment variables.
5. Deploy and open the generated Render URL.

## Docker Deploy

1. Build image:
   `docker build -t talent-finder .`
2. Run container:
   `docker run -p 8787:8787 --env GEMINI_API_KEY=YOUR_KEY talent-finder`
3. Open:
   [http://localhost:8787](http://localhost:8787)

## Production Notes

- Never expose `GEMINI_API_KEY` to client-side code.
- Restrict CORS to your domain before public launch.
- Add rate limiting + auth middleware for public traffic.

## Backoffice (Admin)

- Login with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- In admin dashboard, users are loaded from the server-side user database (`/api/admin/users`).
- User status changes (active/suspended) are persisted server-side.
