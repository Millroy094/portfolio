import { TextField } from "@mui/material";
import React, { FC } from "react";

type YearTextFieldProps = {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
};

const currentYear = new Date().getFullYear();

const YearTextField: FC<YearTextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  errorText,
  disabled,
}) => (
  <TextField
    type="number"
    label={label}
    value={value}
    onChange={(e) => {
      const v = e.target.value;
      if (v === "") return onChange(undefined);
      const parsed = Number(v);
      onChange(Number.isNaN(parsed) ? undefined : parsed);
    }}
    slotProps={{
      htmlInput: {
        inputMode: "numeric",
        min: 1900,
        max: currentYear,
        step: 1,
        readOnly: disabled,
      },
    }}
    fullWidth
    error={error}
    helperText={errorText}
  />
);

export default YearTextField;
