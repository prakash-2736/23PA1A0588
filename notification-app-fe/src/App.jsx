import { useEffect } from "react";
import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import NotificationsPage from "./pages/NotificationsPage";
import PriorityNotificationsPage from "./pages/PriorityNotificationsPage";
import { Log } from "./utils/logger";

const token = import.meta.env.VITE_AFFORD_TOKEN;

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    Log("frontend", "info", "route", `Visited ${location.pathname}`, token);
  }, [location.pathname]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f9fc" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar
          sx={{ justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}
        >
          <Typography variant="h6" fontWeight={700}>
            Campus Notification Dashboard
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              variant={
                location.pathname === "/notifications" ? "outlined" : "text"
              }
              onClick={() => navigate("/notifications")}
            >
              All Notifications
            </Button>
            <Button
              color="inherit"
              variant={location.pathname === "/priority" ? "outlined" : "text"}
              onClick={() => navigate("/priority")}
            >
              Priority Inbox
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Navigate to="/notifications" replace />} />
        <Route
          path="/notifications"
          element={<NotificationsPage token={token} />}
        />
        <Route
          path="/priority"
          element={<PriorityNotificationsPage token={token} />}
        />
      </Routes>
    </Box>
  );
}
