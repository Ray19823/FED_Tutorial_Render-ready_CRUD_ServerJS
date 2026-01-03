# Render-ready Express CRUD Server + Goals UI

A simple Express server serving a small CRUD API and a static UI for managing goals. Ready to deploy to Render.

## Local Run

```bash
npm install
npm start
# Open http://localhost:3000
```

## Render Deployment

Option 1 — Blueprint (recommended for reproducible infra):
- Ensure this repo includes `render.yaml` (already added).
- In Render, click New → Blueprint → Connect this GitHub repo.
- Set repo to public and enable Auto Deploy.

Option 2 — Web Service (quick setup):
- New → Web Service → Select this GitHub repo.
- Environment: Node
- Build Command: `npm install`
- Start Command: `npm start`

Notes:
- Render provides `PORT`; the server uses `process.env.PORT` automatically.
- Keep secrets in Render environment variables; `.env` is ignored.
- Free plan is set in `render.yaml`; adjust as needed.
