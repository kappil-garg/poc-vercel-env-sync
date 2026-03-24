# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A GitHub Actions workflow syncs secrets from GitHub Secrets into Vercel project environment variables via the Vercel API, then triggers a deployment via Deploy Hook. No secrets are stored in the repo; Vercel builds consume the synced env vars.

## Architecture

There is no build step, package manager, or framework. The project is a static HTML page + one Vercel serverless function, deployed directly to Vercel.

- **`.github/workflows/sync-secrets-to-vercel.yml`** — GitHub Actions workflow (triggered manually or on push to `main`) that (1) syncs `GOOGLE_OAUTH_CLIENT_ID` to Vercel via `POST /v10/projects/{projectName}/env?upsert=true`, then (2) triggers a Vercel deployment via Deploy Hook.
- **`api/check-env.js`** — Vercel serverless function (Node.js ESM `export default`). Returns `{ GOOGLE_OAUTH_CLIENT_ID: "set" | "not set" }` — never exposes the actual value.
- **`index.html`** — Static page that fetches `/api/check-env` and renders the result.
- **`vercel.json`** — Minimal Vercel config (`{ "version": 2 }`).

## Required secrets and variables

| Where | Name | Purpose |
|---|---|---|
| GitHub Secrets | `VERCEL_TOKEN` | Vercel API token with project write access |
| GitHub Secrets | `GOOGLE_OAUTH_CLIENT_ID` | The value to sync to Vercel |
| GitHub Secrets | `VERCEL_DEPLOY_HOOK_URL` | Vercel Deploy Hook URL — triggers deployment after sync |
| GitHub Secrets (optional) | `VERCEL_TEAM_ID` | Required only for team Vercel projects |
| GitHub Variables or workflow default | `VERCEL_PROJECT_NAME` | Vercel project name (default: `poc-vercel-env-sync`) |

## Workflow: how secrets flow

1. Run the **Sync secrets to Vercel** workflow (Actions tab, manual trigger or push to `main`).
2. The workflow syncs the env var to Vercel, then automatically triggers a deployment via Deploy Hook.
3. Open the deployment URL — the page calls `/api/check-env` and shows whether the var is set.

## Adapting to a real app

To use this pattern in a real Angular/Node app on Vercel, add a pre-build inject script that reads `process.env.GOOGLE_OAUTH_CLIENT_ID` and writes it into `environment.*.ts` before `ng build` runs.
