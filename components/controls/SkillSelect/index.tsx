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
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-sm font-medium text-neutral-300">{label}</label>

      <input type="hidden" name={name} onBlur={onBlurAction} value={value.join(",")} />

      <button
        type="button"
        className={cn(
          "flex min-h-10 w-full items-center justify-between rounded-lg border bg-neutral-950 px-3.5 py-2.5 text-left text-sm text-neutral-100 transition-colors",
          error
            ? "border-red-600/60 focus-visible:ring-red-500/40"
            : "border-neutral-700 focus-visible:ring-neutral-400/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
        )}
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className="text-neutral-300">
          {selectedOptions.length ? `${selectedOptions.length} selected` : label}
        </span>
        <ChevronDown
          className="h-4 w-4 text-neutral-500 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/60 px-2.5 py-1.5 text-xs text-neutral-100 transition-colors"
            >
              <span className="inline-flex items-center [svg]:h-4 [svg]:w-4">
                {option.render()}
              </span>
              {option.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => toggleSkill(option.id)}
                  className="rounded p-0.5 hover:bg-neutral-700 transition-colors"
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-900 p-2 shadow-lg max-h-80">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="mb-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 transition-colors"
          />
          <ul className="max-h-64 overflow-y-auto">
            {filtered.map((option) => {
              const selected = value.includes(option.id);
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm text-neutral-100 hover:bg-neutral-800 transition-colors"
                    onClick={() => toggleSkill(option.id)}
                  >
                    <span
                      className={cn(
                        "inline-flex h-4 w-4 items-center justify-center rounded border transition-colors",
                        selected
                          ? "border-neutral-400 bg-neutral-700 text-neutral-100"
                          : "border-neutral-600 bg-transparent text-transparent",
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="inline-flex items-center [svg]:h-5 [svg]:w-5">
                      {option.render()}
                    </span>
                    <span>{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
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
