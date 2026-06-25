# Notification App Backend

This folder contains the backend work done for the campus notification system evaluation.

## Stage 6 - Priority Inbox
For Stage 6, I implemented a backend script that fetches notifications from the provided API and returns the top 10 priority notifications.

### File
- `priorityInbox.js`

### What it does
- fetches notifications from the evaluation API
- assigns priority based on:
  - notification type (`Placement > Result > Event`)
  - recency within the same type
- sorts notifications by score
- prints the top 10 notifications in the terminal

### Logging
The backend script uses the shared logging middleware from `../logging-middleware`.

### Run command
```bash
node priorityInbox.js