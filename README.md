# AWS Console Backend

Node.js + Express MVC backend for the Service Console, backed by the existing MySQL `DNS` database.

## Run locally
```bash
npm install
cp .env.example .env
# Set DB_PASSWORD to the same password that works with: mysql -u harsh -p DNS
npm run dev
```

The default local DB connection follows the existing DNS project pattern: MySQL on `localhost`, database `DNS`, user `harsh`. Environment variables override these defaults when needed. Never commit `.env`.

## Health
`GET /health`

## 2Factor configuration endpoints
Both prefixes are supported for frontend compatibility:
- `/sms/2factor/config`
- `/api/v1/sms/2factor/config`

Routes: GET/list, GET/:id, POST, PUT/:id, DELETE/:id, POST/:id/test-sms, POST/:id/test-call. No login guard is active yet because the console login module has not been implemented. Add authentication before deploying this configuration API to a public internet-facing environment.

2Factor API/token secrets are encrypted at rest and masked in response payloads. Real SMS/call tests may incur provider charges.
