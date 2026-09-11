"use client";

import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { allSkills, type Skill, type SkillId } from "./SkillRegistery";

type SkillSelectProps = {
  value: SkillId[];
  onChangeAction: (value: SkillId[]) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  onBlurAction?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  name?: string;
  disabled?: boolean;
};

export default function SkillSelect({
  value,
  onChangeAction,
  label = "Select skills",
  error,
  helperText,
  onBlurAction,
  name,
  disabled,
}: SkillSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const selectedOptions = React.useMemo<Skill[]>(
    () => allSkills.filter((s) => value.includes(s.id)),
    [value],
  );

  const filtered = React.useMemo(
    () => allSkills.filter((s) => s.label.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  React.useEffect(() => {
    const onClickOutside = (evt: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(evt.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggleSkill = (id: SkillId) => {
    if (value.includes(id)) {
      onChangeAction(value.filter((x) => x !== id));
      return;
    }
    onChangeAction([...value, id]);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="relative block">
        <input type="hidden" name={name} onBlur={onBlurAction} value={value.join(",")} />

        <div className="relative">
          <button
            type="button"
            className={cn(
              "flex min-h-10 w-full items-center justify-between rounded-lg border bg-(--admin-input-bg) px-3.5 py-2.5 text-left text-sm text-(--admin-text) transition-colors",
              disabled && "opacity-50 cursor-not-allowed bg-(--admin-input-disabled-bg)",
              error
                ? "border-red-600/60 focus-visible:ring-red-500/40"
                : "border-(--admin-border-strong) focus-visible:ring-neutral-400/40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-(--admin-focus-offset)",
            )}
            onClick={() => setOpen((prev) => !prev)}
            disabled={disabled}
          >
            <span className="text-(--admin-text-muted)">
              {selectedOptions.length ? `${selectedOptions.length} selected` : label}
            </span>
            <ChevronDown
              className="h-4 w-4 text-(--admin-text-muted) transition-transform"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          {open && !disabled && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 w-full rounded-lg border border-(--admin-border-strong) bg-(--admin-surface) p-2 shadow-lg">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills..."
                className="mb-2 w-full rounded-lg border border-(--admin-border-strong) bg-(--admin-input-bg) px-3 py-2 text-sm text-(--admin-text) placeholder:text-(--admin-text-muted) outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-(--admin-focus-offset)"
              />
              <ul className="max-h-64 overflow-y-auto">
                {filtered.map((option) => {
                  const selected = value.includes(option.id);
                  return (
                    <li key={option.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm text-(--admin-text) transition-colors hover:bg-(--admin-surface-muted)"
                        onClick={() => toggleSkill(option.id)}
                      >
                        <span
                          className={cn(
                            "shrink-0 inline-flex h-4 w-4 items-center justify-center rounded border transition-colors",
                            selected
                              ? "border-(--admin-border-strong) bg-(--admin-btn-bg) text-(--admin-btn-text)"
                              : "border-(--admin-border-strong) bg-transparent text-transparent",
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="shrink-0 inline-flex items-center [svg]:h-5 [svg]:w-5">
                          {option.render()}
                        </span>
                        <span className="shrink-0">{option.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <span className="pointer-events-none absolute left-3.5 -top-2 rounded-sm bg-(--admin-field-label-bg) px-1 text-xs font-medium text-(--admin-text-muted) transition-colors">
          {label}
        </span>
      </label>

      {selectedOptions.length > 0 && (
        <div
          className={`mt-3 flex flex-wrap gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className={`inline-flex items-center gap-1 rounded-lg border border-(--admin-border-strong) bg-(--admin-surface-muted) px-2.5 py-1.5 text-xs text-(--admin-text) transition-colors ${disabled ? "opacity-70" : ""}`}
            >
              <span className="inline-flex items-center [svg]:h-4 [svg]:w-4">
                {option.render()}
              </span>
              <span className="shrink-0">{option.label}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => toggleSkill(option.id)}
                  className="ml-1 rounded p-0.5 transition-colors hover:bg-(--admin-btn-bg-hover)"
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      <p
        className={cn(
          "mt-1.5 text-xs transition-colors",
          error ? "text-red-400" : "text-transparent",
        )}
      >
        {helperText ?? "."}
      </p>
    </div>
  );
}
