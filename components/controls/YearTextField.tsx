import React, { FC } from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
  <Field label={label} error={error ? errorText : undefined}>
    <Input
      type="number"
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "") return onChange(undefined);
        const parsed = Number(v);
        onChange(Number.isNaN(parsed) ? undefined : parsed);
      }}
      inputMode="numeric"
      min={1900}
      max={currentYear}
      step={1}
      readOnly={disabled}
    />
  </Field>
);

export default YearTextField;
