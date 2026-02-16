import { InputAdornment, TextField } from "@mui/material";
import { FC } from "react";

type LinkTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
};

const LinkTextField: FC<LinkTextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  errorText,
  disabled,
}) => (
  <TextField
    label={label}
    fullWidth
    value={value}
    onChange={(e) => onChange(e.target.value)}
    slotProps={{
      input: {
        startAdornment: <InputAdornment position="start">https://</InputAdornment>,
      },
      htmlInput: { readOnly: disabled },
    }}
    error={error}
    helperText={errorText ?? ""}
  />
);

export default LinkTextField;
