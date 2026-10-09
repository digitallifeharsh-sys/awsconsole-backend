# AWS Console Backend Architecture

This backend follows the intent of the supplied `desgin_backend` ZIP but fills in the route, controller, repository, database, encryption and provider layers with working logic.

## Request flow

```text
React + Vite frontend
  -> src/lib/twoFactorConfig.api.js
  -> Express entry point: index.js
  -> /sms/2factor or /api/v1/sms/2factor
  -> src/routes/sms.routes.js
  -> src/controllers/twoFactor.controller.js
  -> src/repositories/twoFactorConfig.repository.js
  -> src/config/database.js -> MySQL database DNS
```

Live provider tests travel from the controller through `src/services/twoFactor.service.js`. Secrets are encrypted/decrypted via `src/utils/crypto.js`.

## Existing project folders

- `index.js`: application entrypoint, middleware, route mounting and startup.
- `src/config/database.js`: MySQL pool; local defaults match the existing `dns_harsh` DB style.
- `src/routes/`: HTTP endpoint definitions only.
- `src/controllers/`: validates request data and sends API responses.
- `src/repositories/`: SQL queries for create/read/update/delete.
- `src/models/initDatabase.js`: creates the 2Factor config table when it does not exist.
- `src/services/`: outbound 2Factor provider requests.
- `src/utils/crypto.js`: AES-256-GCM encryption and secret masking.
- `src/middleware/`: middleware placeholders; login authorization is intentionally inactive until login exists.

## Supplied ZIP structure

The uploaded ZIP contains a basic `server.js`, `module/sms_module/gate.js`, `Admin/IndexRoute.js`, and planned `Admin/controller`, `router`, `model`, `query`, `utils`, `web_panel`, `api_user`, `filter`, and `config` folders. Most planned files in that ZIP are empty or missing, so there was no existing MySQL/MVC implementation to copy. The active backend implements the same separation of routing, controller, database/query layer, provider service and configuration, under the clearer `src/` MVC structure.

## Security note

Login is not implemented, so configuration endpoints do not currently require a login/admin key. Keep this backend local or on a trusted private network until authentication and authorization are implemented. Do not expose credential management publicly yet.
