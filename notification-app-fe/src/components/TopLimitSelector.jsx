import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function TopLimitSelector({ value, onChange }) {
  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel>Top N</InputLabel>
      <Select
        value={value}
        label="Top N"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={15}>15</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </Select>
    </FormControl>
  );
}
