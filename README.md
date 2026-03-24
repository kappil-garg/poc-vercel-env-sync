# POC: GitHub Actions → Vercel env sync

A GitHub Actions workflow syncs secrets from GitHub to Vercel project environment variables via the Vercel API, then triggers a deployment via Deploy Hook. No secrets are stored in the repo; Vercel builds consume the synced env vars.

## What's in this POC

- **`.github/workflows/sync-secrets-to-vercel.yml`** – Runs on `workflow_dispatch` (manual) or push to `main`. Reads `GOOGLE_OAUTH_CLIENT_ID` from GitHub Secrets, upserts it into your Vercel project env (production, preview, development), then triggers a deployment.
- **`api/check-env.js`** – Vercel serverless function that returns whether `GOOGLE_OAUTH_CLIENT_ID` is set (value never exposed).
- **`index.html`** – Simple page that calls `/api/check-env` and shows the result.

## Setup (one-time)

### 1. Create a Vercel project

- Push this folder to a GitHub repo, then import it in [Vercel](https://vercel.com) as a new project.
- Or run `vercel` in this folder and link the project. Note the **project name**.

### 2. Get a Vercel API token

Vercel Dashboard → Account Settings → [Tokens](https://vercel.com/account/tokens) → Create Token. Copy the value.

### 3. Create a Deploy Hook

Vercel Dashboard → Project → Settings → Git → Deploy Hooks → create a hook (branch: `main`). Copy the URL.

### 4. Add GitHub Secrets

Repo → Settings → Secrets and variables → Actions:

| Secret name              | Value                                     |
|--------------------------|-------------------------------------------|
| `VERCEL_TOKEN`           | Your Vercel API token                     |
| `VERCEL_DEPLOY_HOOK_URL` | Your Vercel Deploy Hook URL               |
| `GOOGLE_OAUTH_CLIENT_ID` | A test value (e.g. `test-client-id-123`)  |

Optional (team projects only): add `VERCEL_TEAM_ID` (Team Settings → General → Team ID).

### 5. Set the project name

Set the repo variable `VERCEL_PROJECT_NAME` (Settings → Variables) to your Vercel project name, or edit the default in the workflow file directly.

If you use a Vercel team, uncomment the `teamId` line in the workflow and set `VERCEL_TEAM_ID` in GitHub Secrets.

## How to run

1. **Trigger the workflow** — Actions → **Sync secrets to Vercel** → Run workflow (or push to `main`).
2. The workflow syncs the env var to Vercel, then automatically triggers a deployment via Deploy Hook.
3. **Verify** — open your deployment URL; the page calls `/api/check-env` and shows whether `GOOGLE_OAUTH_CLIENT_ID` is set.

## Flow

1. The real secret value lives only in **GitHub Secrets**.
2. The workflow calls `POST /v10/projects/{name}/env?upsert=true` on the Vercel API to push the value.
3. Vercel stores it as an encrypted project env var.
4. The workflow triggers a deployment via Deploy Hook — the build runs with the freshly synced env var.

## Adapting to an Angular app

Copy the workflow into your main app's repo. Add a pre-build script that reads `process.env.GOOGLE_OAUTH_CLIENT_ID` and writes it into `environment.*.ts` before `ng build` runs. The Vercel build will then have the synced value baked into the Angular environment file.
