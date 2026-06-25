require("dotenv").config();

const { Log } = require("../logging-middleware");

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchNotifications(token) {
  if (!token) {
    await Log(
      "backend",
      "error",
      "utils",
      "AFFORD_TOKEN not found in .env",
      token,
    );
    throw new Error("AFFORD_TOKEN not found in .env");
  }

  await Log(
    "backend",
    "info",
    "api",
    "Fetching notifications from evaluation API",
    token,
  );

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    await Log(
      "backend",
      "error",
      "api",
      `Notifications API request failed with status ${response.status}`,
      token,
    );
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.notifications || !Array.isArray(data.notifications)) {
    await Log(
      "backend",
      "error",
      "api",
      "Invalid API response format received",
      token,
    );
    throw new Error("Invalid API response format");
  }

  await Log(
    "backend",
    "info",
    "api",
    `Fetched ${data.notifications.length} notifications successfully`,
    token,
  );

  return data.notifications;
}

function calculatePriorityScore(notification) {
  const typeWeight = TYPE_WEIGHT[notification.Type] || 0;
  const timestamp = new Date(notification.Timestamp).getTime();

  return typeWeight * 1_000_000_000_000_000 + timestamp;
}

function getTopPriorityNotifications(notifications, limit = 10) {
  return notifications
    .map((notification) => ({
      ...notification,
      priorityScore: calculatePriorityScore(notification),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, limit);
}

function printTopNotifications(topNotifications) {
  console.log("\n========== TOP 10 PRIORITY NOTIFICATIONS ==========\n");

  topNotifications.forEach((notification, index) => {
    console.log(`${index + 1}. ${notification.Type} - ${notification.Message}`);
    console.log(`   ID        : ${notification.ID}`);
    console.log(`   Timestamp : ${notification.Timestamp}`);
    console.log(`   Score     : ${notification.priorityScore}`);
    console.log("");
  });
}

async function main() {
  const token = process.env.AFFORD_TOKEN;

  try {
    await Log(
      "backend",
      "info",
      "route",
      "Stage 6 priority inbox execution started",
      token,
    );

    const notifications = await fetchNotifications(token);
    const topNotifications = getTopPriorityNotifications(notifications, 10);

    await Log(
      "backend",
      "info",
      "service",
      `Calculated top ${topNotifications.length} priority notifications`,
      token,
    );

    printTopNotifications(topNotifications);

    await Log(
      "backend",
      "info",
      "route",
      "Stage 6 priority inbox execution completed",
      token,
    );
  } catch (error) {
    await Log(
      "backend",
      "error",
      "route",
      `Stage 6 execution failed: ${error.message}`,
      token,
    );
    console.error("\nStage 6 Error:", error.message);
  }
}

main();
