## Logging Middleware

This folder contains the reusable logging utility used across the project to send logs to the Affordmed evaluation logging API.

### Purpose

The middleware is used to log important events from the frontend and backend such as:

* application initialization
* API request start and completion
* user actions like filter changes or notification clicks
* error cases and failed requests

### Main file

* `index.js` → contains the reusable `Log` function

### Log function signature

```javascript
Log(stack, level, pkg, message, token)
```

### Parameters

* `stack` → `"frontend"` or `"backend"`
* `level` → `"debug" | "info" | "warn" | "error" | "fatal"`
* `pkg` → logical package/module name such as `"component"`, `"api"`, `"page"`, `"state"`, `"utils"`, `"service"`, etc.
* `message` → log message string
* `token` → Affordmed access token used for authentication

### Example usage from frontend

```javascript
import { Log } from "../../../logging-middleware/index.js";

await Log(
  "frontend",
  "info",
  "component",
  "frontend app initialized",
  import.meta.env.VITE_AFFORD_TOKEN
);
```

### Notes

* Logging should be integrated from the beginning of the codebase as required in the evaluation instructions.
* The logger is designed to be reusable across different modules instead of duplicating logging logic in every file.
