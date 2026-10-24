# Hyper Harness

A ready-to-use template for **agentic hyper productivity**: a minimal React + FastAPI
Hello World app wrapped in the Agentic Harness (Rules, Safeguards, Verification) described in
[AI Agents in the Fast Lane: Engineering for Hyper Productivity](https://medium.com/@gaurish-chandelkar/ai-agents-in-the-fast-lane-engineering-for-hyper-productivity-fcbcd902ee9a).

## Prerequisites

- [uv](https://docs.astral.sh/uv/) (installs Python 3.12 for you)
- Node.js 22+ and npm

## Quick start

```bash
uv sync
npm install
npm run dev
```

Open http://localhost:5173. The backend runs on http://localhost:8000 (`/api/hello`, `/api/health`, `/docs`).

## Layout

| Path | Contents |
|---|---|
| `backend/` | FastAPI app, layered `api/` → `services/` → `domain/` |
| `frontend/` | React + Vite + TypeScript (strict) |
| `docs/` | Plan and harness documentation |
