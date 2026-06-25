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

## Stage 2 - Database Design

### DB choice

I would use **PostgreSQL** because the system has structured data and clear relations between students, notifications, and read status. It also supports joins, indexing, and filtering well.

---

### Schema

#### students

* `id`
* `rollNumber`
* `name`
* `email`

#### notifications

* `id`
* `notificationType` (`Placement`, `Event`, `Result`)
* `title`
* `message`
* `createdAt`

#### student_notifications

* `id`
* `studentId`
* `notificationId`
* `isRead`
* `readAt`
* `deliveredAt`

---

### Why this schema

* `notifications` stores the actual notification content
* `student_notifications` stores which student received it and whether it was read
* this avoids duplicating full notification content for every student

---

### Example queries

#### Create notification

```sql
INSERT INTO notifications (notificationType, title, message, createdAt)
VALUES ('Placement', 'Placement Drive Update', 'TCS Ninja drive on Friday', NOW());
```

#### Map notification to students

```sql
INSERT INTO student_notifications (studentId, notificationId, isRead, deliveredAt)
VALUES (101, 5001, false, NOW());
```

#### Get unread notifications

```sql
SELECT n.id, n.notificationType, n.title, n.message, n.createdAt
FROM student_notifications sn
JOIN notifications n ON n.id = sn.notificationId
WHERE sn.studentId = 101 AND sn.isRead = false
ORDER BY n.createdAt DESC;
```

#### Mark one notification as read

```sql
UPDATE student_notifications
SET isRead = true, readAt = NOW()
WHERE studentId = 101 AND notificationId = 5001;
```

---

### Problems at scale

* unread queries may become slow
* sorting by latest notifications may become expensive
* `student_notifications` can grow very large

---

### Solutions

* add indexes on `studentId`, `notificationId`, `isRead`, `createdAt`
* use pagination for notification listing
* use batch inserts when sending one notification to many students

