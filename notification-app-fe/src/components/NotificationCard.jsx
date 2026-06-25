import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";

const typeColor = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

export default function NotificationCard({ notification, showScore = false }) {
  const { Type, Message, Timestamp, isRead, priorityScore } = notification;

  return (
    <Card
      elevation={2}
      sx={{
        borderLeft: `6px solid ${isRead ? "#cfd8dc" : "#1976d2"}`,
        opacity: isRead ? 0.8 : 1,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          gap={2}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={Type}
              color={typeColor[Type] || "default"}
              size="small"
            />
            <Chip
              label={isRead ? "Viewed" : "New"}
              color={isRead ? "default" : "primary"}
              size="small"
              variant={isRead ? "outlined" : "filled"}
            />
          </Stack>
        </Stack>

        <Typography variant="body1" fontWeight={600} gutterBottom>
          {Message}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {Timestamp}
        </Typography>

        {showScore && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Priority Score: {priorityScore}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
