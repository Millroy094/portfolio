import { FC } from "react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { addHttps, stripProtocol } from "@/utils/url";

type LinkTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
};

const LinkTextField: FC<LinkTextFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  errorText,
  disabled,
  endAdornment,
}) => (
  <Field label={label} error={error ? errorText : undefined}>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-semibold text-(--admin-text-muted)">
        https://
      </span>
      <Input
        value={stripProtocol(value)}
        onChange={(e) => onChange(addHttps(e.target.value))}
        onBlur={onBlur}
        disabled={disabled}
        className={cn("pl-[calc(0.75rem+8ch+0.25rem)] font-mono text-sm", endAdornment && "pr-12")}
      />
      {endAdornment && (
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{endAdornment}</div>
      )}
    </div>
  </Field>
);

export default LinkTextField;
