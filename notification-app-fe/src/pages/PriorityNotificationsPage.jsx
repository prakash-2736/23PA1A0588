import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import NotificationFilter from "../components/NotificationFilter";
import NotificationCard from "../components/NotificationCard";
import TopLimitSelector from "../components/TopLimitSelector";
import useNotifications from "../hooks/useNotifications";
import { Log } from "../utils/logger";

const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function calculatePriorityScore(notification) {
  const typeWeight = TYPE_WEIGHT[notification.Type] || 0;
  const timestamp = new Date(notification.Timestamp).getTime();
  return typeWeight * 1_000_000_000_000_000 + timestamp;
}

export default function PriorityNotificationsPage({ token }) {
  const [notificationType, setNotificationType] = useState("All");
  const [topLimit, setTopLimit] = useState(10);

  const { notifications, loading, error } = useNotifications({
    token,
    page: 1,
    limit: 50,
    notificationType,
  });

  const topNotifications = useMemo(() => {
    return notifications
      .map((notification) => ({
        ...notification,
        priorityScore: calculatePriorityScore(notification),
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, topLimit);
  }, [notifications, topLimit]);

  const handleFilterChange = async (value) => {
    setNotificationType(value);
    await Log(
      "frontend",
      "info",
      "component",
      `Priority filter changed to ${value}`,
      token,
    );
  };

  const handleLimitChange = async (value) => {
    setTopLimit(value);
    await Log(
      "frontend",
      "info",
      "component",
      `Priority limit changed to ${value}`,
      token,
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Priority Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Top important unread-style notifications ranked by type and recency.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <NotificationFilter
            value={notificationType}
            onChange={handleFilterChange}
          />
          <TopLimitSelector value={topLimit} onChange={handleLimitChange} />
        </Stack>

        {loading && (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <CircularProgress />
          </Stack>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && topNotifications.length === 0 && (
          <Alert severity="info">No priority notifications found.</Alert>
        )}

        <Grid container spacing={2}>
          {topNotifications.map((notification) => (
            <Grid item xs={12} md={6} key={notification.ID}>
              <NotificationCard notification={notification} showScore />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
