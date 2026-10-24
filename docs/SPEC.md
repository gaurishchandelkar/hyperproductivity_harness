# Product Spec

A Hello World web app. It exists to show the harness at work, so the product stays deliberately small.

## Backend API

| Method | Path | Response |
|---|---|---|
| GET | `/api/health` | `200 {"status": "ok"}` |
| GET | `/api/hello` | `200 {"message": "Hello, World!"}` |

## Frontend

- A single page that fetches `/api/hello` on load.
- It shows "Loading…" while waiting, then the message as the main heading.
- If the request fails, it shows an alert that the greeting couldn't be loaded.

## Not in scope

Authentication, persistence, deployment.
