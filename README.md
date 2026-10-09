# AWS Console Backend

Node.js + Express + MySQL API for the existing Service Console frontend.

## Local setup

1. Create a MySQL database named `AWS_CONSOLE` (or set `DB_NAME`).
2. Copy `.env.example` to `.env` and set database credentials.
3. Generate a 32-byte encryption key: `openssl rand -hex 32`. Put the 64-character hex result in `CREDENTIAL_ENCRYPTION_KEY`.
4. Install and run:

```bash
npm install
npm run dev
```

The backend initializes the `two_factor_configs` table on startup. Check `http://localhost:5000/health`.

## API

Base path: `/api/v1/sms/2factor`

- `GET /config` — list configurations (secrets are masked)
- `GET /config/:id` — fetch one configuration (secrets are masked)
- `POST /config` — create a configuration
- `PUT /config/:id` — update configuration
- `DELETE /config/:id` — delete configuration
- `POST /config/:id/test-sms` — send a real SMS OTP
- `POST /config/:id/test-call` — place a real voice call

All configuration and test endpoints require `X-Console-Admin-Key`, checked against `CONSOLE_ADMIN_TOKEN` using a timing-safe comparison. Secrets are encrypted with AES-256-GCM before MySQL storage. The frontend must never receive plaintext credentials. Configure `FRONTEND_URL` to the exact browser origin if using direct cross-origin API requests; during local Vite development, the frontend proxy is preferred.

## Provider notes

SMS testing uses the documented 2Factor OTP endpoint `POST /API/V1/OTP/SEND` with `X-API-Key` and the configured SMS template name. Voice testing uses the 2Factor OBD voice endpoint. A valid provider account, template approval, and available credits are required; live SMS/call delivery cannot be confirmed without real credentials and a reachable provider.
