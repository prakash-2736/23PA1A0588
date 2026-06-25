import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function NotificationFilter({ value, onChange }) {
  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel>Type</InputLabel>
      <Select
        value={value}
        label="Type"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
      </Select>
    </FormControl>
  );
}
