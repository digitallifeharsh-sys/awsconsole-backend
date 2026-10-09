# AWS Console Backend

Backend structure follows the supplied `desgin_backend` ZIP. It uses Express MVC and the existing MySQL `DNS` database.

## Run locally
```bash
npm install
cp .env.example .env
# Set DB_PASSWORD to the local password accepted by: mysql -u harsh -p DNS
npm run check
npm run dev
```

MySQL defaults match the local DNS project style: `localhost`, database `DNS`, user `harsh`. The password is only in your untracked local `.env`; never commit it.

## Folder structure
- `server.js`: Express entry point and route mounting.
- `index.js`: backward-compatible entry point that imports `server.js`.
- `config/db.js`: MySQL pool.
- `utils/crypto.js`: encrypts provider credentials and masks them in responses.
- `module/sms_module/gate.js`: SMS module route gateway.
- `module/sms_module/Admin/IndexRoute.js`: Admin module router composition.
- `module/sms_module/Admin/router/config.Router.js`: config REST endpoints.
- `module/sms_module/Admin/controller/config.controller.js`: request validation and response handling.
- `module/sms_module/Admin/model/config.model.js`: initializes the MySQL table.
- `module/sms_module/Admin/query/config.query.js`: parameterized SQL operations.
- `module/sms_module/Admin/utils/provider.js`: 2Factor provider requests.
- `module/sms_module/web_panel/`: separate web-panel module.
- `module/sms_module/api_user/`: separate API-user module.
- `module/sms_module/filter/` and `module/sms_module/config/`: shared filters and settings.
- `module/ls/`: reserved folder from the supplied ZIP.

## Configuration endpoints
Both paths are supported:
- `/sms/2factor/config`
- `/api/v1/sms/2factor/config`

Supported methods: GET list, GET by id, POST create, PUT update, DELETE, POST test-sms, POST test-call.

Login is intentionally not enforced because the login module has not been implemented. Keep the service on localhost/private network until authentication is added. Provider SMS/call tests can incur charges.
