# Spider Panel — Base44 Dev Environment

## What this is
A FastAPI-based VLESS/XHTTP proxy management panel. Single Python app (`main.py`, ~6000 lines) serving both the API and static HTML frontend. No database — uses JSON file persistence in `DATA_DIR` (default `/data`).

## How to run
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
App listens on port 8080 inside the container, mapped to host port 3000.

## Key details
- **Entry point**: `python main.py` → starts uvicorn on `0.0.0.0:8080` (port is hardcoded in `CONFIG["port"]`, not overridable by env).
- **Static frontend**: login at `/login`, dashboard at `/dashboard`. Root `/` returns a JSON status object.
- **Persistence**: JSON state file at `$DATA_DIR/spider_state.json`. A Docker volume (`spider_data`) is mounted at `/data`.
- **Xray binary**: downloaded at runtime from GitHub releases on first startup (stored in `./xray/`). Falls back to Python `cryptography` lib if download fails.
- **Auth**: Session-based, default password `admin` (set via `ADMIN_PASSWORD` env var). Change after first login.
- **No external credentials needed to boot**: All env vars (`SECRET_KEY`, `ADMIN_PASSWORD`, `RAILWAY_PUBLIC_DOMAIN`, `DATA_DIR`) have defaults. The Cloudflare Worker integration is optional and configured through the UI.

## Environment variables
| Variable | Default | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | `admin` | Initial dashboard password |
| `SECRET_KEY` | `spider-panel-secret-key-v2` | Session/hashing secret |
| `DATA_DIR` | `/data` | Persistence directory |
| `RAILWAY_PUBLIC_DOMAIN` | `localhost` | Public domain for config generation |

## Health check
`GET /` returns HTTP 200 with JSON status. The compose healthcheck uses this.

## Files
- `main.py` — main FastAPI app (routes, auth, state, config generation)
- `pages.py` — page rendering helpers
- `xhttp_siz10.py` — XHTTP transport router
- `relay_vless.py` — VLESS WebSocket relay
- `shared.py` — shared mutable state between modules
- `static/` — frontend HTML/CSS/JS assets
- `worker/_worker.js` — Cloudflare Worker relay script (deployed via UI)
