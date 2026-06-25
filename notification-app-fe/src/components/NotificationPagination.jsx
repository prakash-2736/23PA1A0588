import { Pagination, Stack } from "@mui/material";

export default function NotificationPagination({ page, onChange }) {
  return (
    <Stack alignItems="center" sx={{ mt: 3 }}>
      <Pagination
        count={10}
        page={page}
        color="primary"
        onChange={(_, value) => onChange(value)}
      />
    </Stack>
  );
}
