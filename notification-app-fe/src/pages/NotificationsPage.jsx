import { useState } from "react";
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
import NotificationPagination from "../components/NotificationPagination";
import useNotifications from "../hooks/useNotifications";
import { Log } from "../utils/logger";

export default function NotificationsPage({ token }) {
  const [page, setPage] = useState(1);
  const [notificationType, setNotificationType] = useState("All");

  const { notifications, loading, error } = useNotifications({
    token,
    page,
    limit: 10,
    notificationType,
  });

  const handleFilterChange = async (value) => {
    setNotificationType(value);
    setPage(1);
    await Log(
      "frontend",
      "info",
      "component",
      `Filter changed to ${value}`,
      token,
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            All Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View all campus notifications with filtering and pagination.
          </Typography>
        </Box>

        <NotificationFilter
          value={notificationType}
          onChange={handleFilterChange}
        />

        {loading && (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <CircularProgress />
          </Stack>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && notifications.length === 0 && (
          <Alert severity="info">No notifications found.</Alert>
        )}

        <Grid container spacing={2}>
          {notifications.map((notification) => (
            <Grid item xs={12} md={6} key={notification.ID}>
              <NotificationCard notification={notification} />
            </Grid>
          ))}
        </Grid>

        <NotificationPagination page={page} onChange={setPage} />
      </Stack>
    </Container>
  );
}
