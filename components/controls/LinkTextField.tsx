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

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "");
}

function addHttps(url: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}

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
    value={stripProtocol(value)}
    onChange={(e) => onChange(addHttps(e.target.value))}
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
