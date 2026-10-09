# AWS Console Backend

Express MVC backend following the supplied `desgin_backend` folder structure and using the existing MySQL `DNS` database.

## Run locally
```bash
npm install
cp .env.example .env
# Set DB_PASSWORD to the same local password accepted by: mysql -u harsh -p DNS
npm run check
npm run dev
```

Local MySQL defaults match the existing DNS project pattern: host `localhost`, database `DNS`, user `harsh`. The password stays in the untracked local `.env`; never commit it.

## Structure
- `server.js`: Express entry point and module mounts.
- `config/db.js`: MySQL connection pool.
- `utils/crypto.js`: AES-256-GCM secret encryption and masking.
- `module/sms_module/gate.js`: SMS module entry router.
- `module/sms_module/Admin/IndexRoute.js`: admin-module route composition.
- `module/sms_module/Admin/router/config.Router.js`: REST endpoints.
- `module/sms_module/Admin/controller/config.controller.js`: validation and responses.
- `module/sms_module/Admin/model/config.model.js`: table initialization.
- `module/sms_module/Admin/query/config.query.js`: SQL queries.
- `module/sms_module/Admin/utils/provider.js`: 2Factor SMS/call integration.
- `web_panel/`, `api_user/`, `filter/`, `config/`: reserved module sections with initial placeholders.

## Endpoints
Both prefixes work:
- `/sms/2factor/config`
- `/api/v1/sms/2factor/config`

GET/list, GET/:id, POST, PUT/:id, DELETE/:id, POST/:id/test-sms and POST/:id/test-call.

Login is not implemented, so no login/admin middleware is applied yet. Do not expose configuration endpoints to the public internet until authentication and authorization are added. SMS/call tests may incur provider charges.
