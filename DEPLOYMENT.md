# Deployment Guide

## Current constraints on this machine

- GitHub CLI authentication is expired
- No Git remote is configured yet
- Docker is not installed locally

Because of that, the fastest live deployment path is:

1. Push the repo to GitHub
2. Deploy backend to Render or Railway
3. Deploy frontend to Vercel or Netlify
4. Use MongoDB Atlas for the database

## Recommended stack

- Database: MongoDB Atlas
- Backend: Render Web Service
- Frontend: Vercel

## 1. MongoDB Atlas

- Create a free cluster
- Create a database user
- Allow your hosting IPs or open access during setup
- Copy the connection string

## 2. Backend deployment

### Render settings

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

### Required env vars

```env
PORT=5001
MONGODB_URI=<your atlas connection string>
JWT_SECRET=<strong secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your frontend url>
NODE_ENV=production
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
```

Note:
- Ollama usually will not be available on hosted free platforms, so the app will use its built-in assistant fallback automatically.

## 3. Frontend deployment

### Vercel settings

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

### Required env vars

```env
VITE_API_URL=https://<your-backend-domain>/api
VITE_MONTHLY_BUDGET=50000
```

## 4. Post-deploy checks

- Register a user
- Load sample data
- Verify dashboard loads
- Verify goals creation works
- Verify scenario planner works
- Verify `/api/health` responds

## Optional future improvement

- Add `render.yaml` or platform-specific deployment manifests
- Add CI to run tests before deployment
- Add a custom domain and monitoring

