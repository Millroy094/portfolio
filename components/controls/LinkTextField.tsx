import { FC } from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { addHttps, stripProtocol } from "@/utils/url";

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
  <Field label={label} error={error ? errorText : undefined}>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--admin-text-muted)]">
        https://
      </span>
      <Input
        value={stripProtocol(value)}
        onChange={(e) => onChange(addHttps(e.target.value))}
        disabled={disabled}
        className="pl-16 font-mono text-sm"
      />
    </div>
  </Field>
);

export default LinkTextField;
