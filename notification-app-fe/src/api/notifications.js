const API_URL = "http://4.224.186.213/evaluation-service/notifications";

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set("limit", params.limit);
  if (params.page) searchParams.set("page", params.page);
  if (params.notificationType && params.notificationType !== "All") {
    searchParams.set("notification_type", params.notificationType);
  }

  return `${API_URL}?${searchParams.toString()}`;
}

export async function fetchNotifications({
  token,
  page = 1,
  limit = 10,
  notificationType = "All",
}) {
  const url = buildQuery({ page, limit, notificationType });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }

  const data = await response.json();
  return data.notifications || [];
}
