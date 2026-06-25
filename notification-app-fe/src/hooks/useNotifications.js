import { useCallback, useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "../utils/logger";

export default function useNotifications({
  token,
  page,
  limit,
  notificationType,
}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await Log("frontend", "info", "api", "Fetching notifications", token);

      const data = await fetchNotifications({
        token,
        page,
        limit,
        notificationType,
      });

      const enriched = data.map((item, index) => ({
        ...item,
        isRead: index % 3 === 0, // temporary visual distinction for Stage 7 UI
      }));

      setNotifications(enriched);

      await Log(
        "frontend",
        "info",
        "api",
        `Fetched ${enriched.length} notifications successfully`,
        token,
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
      await Log(
        "frontend",
        "error",
        "api",
        `Fetch failed: ${err.message}`,
        token,
      );
    } finally {
      setLoading(false);
    }
  }, [token, page, limit, notificationType]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    error,
    refetch: loadNotifications,
  };
}
