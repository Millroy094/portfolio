"use client";

import * as React from "react";
import { Path, useFormContext, useWatch } from "react-hook-form";
import { FiEye, FiEyeOff, FiPlus } from "react-icons/fi";

import type { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type VisibilityKey = keyof NonNullable<ProfileSchemaType["visibility"]>;

type FormSectionProps = {
  title: string;
  description: string;
  addLabel?: string;
  onAdd?: () => void;
  count: number;
  children: React.ReactNode;
  disabled?: boolean;
  visKey?: VisibilityKey;
  showVisibilityToggle?: boolean;
  showAddButton?: boolean;
};

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  addLabel = "Add",
  onAdd,
  count,
  children,
  disabled,
  visKey,
  showVisibilityToggle = true,
  showAddButton = false,
}) => {
  const { control, setValue } = useFormContext<ProfileSchemaType>();
  const watchedVisible = useWatch({
    control,
    name: `visibility.${visKey ?? "avatar"}` as Path<ProfileSchemaType>,
  }) as boolean | undefined;
  const isVisible = visKey ? Boolean(watchedVisible) : true;

  const toggleVisibility = () => {
    if (!visKey) return;
    setValue(`visibility.${visKey}` as Path<ProfileSchemaType>, !isVisible, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <Card className={`p-5 transition ${visKey && !isVisible ? "grayscale opacity-75" : ""}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
          {!isVisible && visKey && <Badge>Hidden</Badge>}
        </div>

        <div className="flex items-center gap-2">
          {visKey && showVisibilityToggle && (
            <Button
              type="button"
              variant={isVisible ? "outline" : "secondary"}
              size="icon"
              onClick={toggleVisibility}
              disabled={disabled}
              aria-label={isVisible ? "Visible on public page" : "Hidden on public page"}
            >
              {isVisible ? <FiEye size={18} /> : <FiEyeOff size={18} />}
            </Button>
          )}

          {showAddButton && onAdd && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onAdd}
              disabled={disabled}
              aria-label={addLabel}
            >
              <FiPlus size={18} />
            </Button>
          )}
        </div>
      </div>

      <Separator className="mb-5" />

      {showAddButton && count === 0 && onAdd ? (
        <EmptyState
          title={`No ${title.toLowerCase()} yet`}
          description={description}
          actionLabel={addLabel}
          onAction={onAdd}
          disabled={disabled}
        />
      ) : (
        <fieldset disabled={disabled} className="m-0 border-0 p-0">
          {children}
        </fieldset>
      )}
    </Card>
  );
};

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  disabled,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
}) => (
  <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/50 p-5">
    <p className="text-base font-medium text-neutral-200">{title}</p>
    <p className="mt-1 text-sm text-neutral-400">{description}</p>
    <Button type="button" variant="outline" className="mt-4" onClick={onAction} disabled={disabled}>
      <FiPlus size={16} />
      {actionLabel}
    </Button>
  </div>
);
