# Backend architecture

The folder organization follows the supplied `desgin_backend` ZIP; business logic is implemented inside those folders instead of a separate `src/` tree.

```text
server.js
├── config/db.js
├── utils/crypto.js
└── module/sms_module/
    ├── gate.js
    ├── Admin/
    │   ├── IndexRoute.js
    │   ├── router/config.Router.js
    │   ├── controller/config.controller.js
    │   ├── model/config.model.js
    │   ├── query/config.query.js
    │   └── utils/provider.js
    ├── web_panel/
    │   ├── controller/
    │   ├── router/
    │   ├── model/
    │   └── query/
    ├── api_user/
    │   ├── controller/
    │   ├── router/
    │   ├── model/
    │   └── query/
    ├── filter/
    └── config/
```

## Request flow
React frontend → Express `server.js` → `sms_module/gate.js` → `Admin/IndexRoute.js` → `Admin/router/config.Router.js` → `Admin/controller/config.controller.js` → `Admin/query/config.query.js` → MySQL `DNS`.

The model initializes `two_factor_configs`; provider tests are handled by `Admin/utils/provider.js`. Secrets are encrypted at rest using AES-256-GCM and masked in API responses.

Login is not implemented yet, so no login/admin guard is applied. Do not expose these configuration routes to a public internet-facing server until authentication and authorization exist.
