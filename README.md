# AWS Console Backend

Standalone **Node.js + Express MVC + MySQL** backend for the React/Vite AWS Service Console. This backend does not use Next.js.

## Start

```bash
cp .env.example .env
# Edit .env and set the real local MySQL password and random secrets.
npm install
npm run dev
# or:
node index.js
```

Database settings match the intended local `dns_harsh` setup: database `DNS`, user `harsh`. The password is only read from the ignored local `.env` file; never commit a real password.

Generate two different values using `openssl rand -hex 32`, one for `CONSOLE_ADMIN_TOKEN` and another for `CREDENTIAL_ENCRYPTION_KEY`.

## MVC structure

- `index.js`: Express bootstrap, middleware, routes and startup
- `src/routes/`: API routes
- `src/controllers/`: request and response handling
- `src/repositories/`: parameterized MySQL operations
- `src/models/`: schema initialization
- `src/services/`: 2Factor provider integration
- `src/middleware/`: admin access control
- `src/config/database.js`: MySQL pool
- `src/utils/crypto.js`: AES-256-GCM encryption

## Health

`GET http://localhost:5000/health` checks the database and responds with HTTP 503 if it is unavailable.

## 2Factor routes

Base path: `/api/v1/sms/2factor`. All routes require `X-Console-Admin-Key` equal to `CONSOLE_ADMIN_TOKEN`.

- `GET /config`
- `GET /config/:id`
- `POST /config`
- `PUT /config/:id`
- `DELETE /config/:id`
- `POST /config/:id/test-sms`
- `POST /config/:id/test-call`

Provider credentials are encrypted in MySQL and masked in responses. SMS/call tests contact the real provider and may incur charges.

## Database

Startup creates `two_factor_configs` if it does not exist in `DNS`. The MySQL user must have create-table permission. `CREATE TABLE IF NOT EXISTS` does not migrate an existing table with an older schema.
