# Notification System Design

## Stage 1 - REST API Design for Campus Notification Platform

### Core actions

#### Student actions

* View all notifications
* View unread notifications
* Filter notifications by type (`Placement`, `Event`, `Result`)
* View top priority notifications
* Mark one notification as read
* Mark all notifications as read

#### Admin actions

* Create a notification
* Send notification to selected students
* Broadcast notification to all students
* Store notification type, title, message, created time, and priority

---

### REST APIs

#### 1. Create notification

```http
POST /api/notifications
```

**Request**

```json
{
  "studentIds": ["23PA1A0588", "23PA1A0575"],
  "type": "Placement",
  "title": "Placement Drive Update",
  "message": "TCS Ninja drive scheduled on Friday at 10:00 AM"
}
```

---

#### 2. Get all notifications of a student

```http
GET /api/notifications?studentId=23PA1A0588
```

---

#### 3. Get unread notifications

```http
GET /api/notifications/unread?studentId=23PA1A0588
```

---

#### 4. Mark one notification as read

```http
PATCH /api/notifications/:id/read
```

**Request**

```json
{
  "studentId": "23PA1A0588"
}
```

---

#### 5. Mark all notifications as read

```http
PATCH /api/notifications/read-all
```

**Request**

```json
{
  "studentId": "23PA1A0588"
}
```

---

#### 6. Filter notifications by type

```http
GET /api/notifications?studentId=23PA1A0588&type=Placement
```

---

#### 7. Get top priority notifications

```http
GET /api/notifications/priority?studentId=23PA1A0588&limit=10
```

---

### Notification schema

```json
{
  "id": "uuid",
  "studentId": "23PA1A0588",
  "type": "Placement",
  "title": "Placement Drive Update",
  "message": "TCS Ninja drive scheduled on Friday at 10:00 AM",
  "isRead": false,
  "priorityScore": 95,
  "createdAt": "2026-06-25T09:30:00Z"
}
```

**Fields**

* `id` → notification id
* `studentId` → owner of the notification
* `type` → notification category
* `title` → short heading
* `message` → notification content
* `isRead` → read/unread state
* `priorityScore` → score used for ranking
* `createdAt` → creation time

---

### Real-time mechanism

Use **WebSocket** to push newly created notifications instantly to the frontend.
If WebSocket is not available, polling can be used as a fallback.

---

### Logging

Logging should be added for:

* notification creation requests
* fetch notification requests
* mark-as-read operations
* validation failures and API errors

---

