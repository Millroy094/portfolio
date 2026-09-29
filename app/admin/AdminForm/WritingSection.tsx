"use client";

import { ArrowDown, ArrowUp, Check, Pencil, Sparkles, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Control, Controller, FieldErrors, useFormContext } from "react-hook-form";

import {
  fetchMediumPostMeta,
  MediumPostMeta,
} from "@/app/admin/AdminForm/actions/fetchMediumPostMeta";
import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import LinkTextField from "@/components/controls/LinkTextField";
import { FormSection } from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type MediumPostRecord = {
  title: string;
  link: string;
  description?: string;
  imageUrl?: string;
  publishedAt?: string;
};

export interface WritingSectionProps {
  control: Control<ProfileSchemaType>;
  errors: FieldErrors<ProfileSchemaType>;
  disabled: boolean;
  posts: {
    fields: { id: string }[];
    append: (v: MediumPostRecord) => void;
    remove: (index: number) => void;
    move: (from: number, to: number) => void;
  };
}

export default function WritingSection({ control, errors, disabled, posts }: WritingSectionProps) {
  const { setValue, getValues, setError, clearErrors } = useFormContext<ProfileSchemaType>();
  const [fetchingIndex, setFetchingIndex] = useState<number | null>(null);
  const [pendingMeta, setPendingMeta] = useState<Record<number, MediumPostMeta>>({});

  const fetchDetails = async (index: number) => {
    const link = getValues(`mediumPosts.${index}.link`);
    if (!link) return;

    setFetchingIndex(index);
    try {
      const meta = await fetchMediumPostMeta(link);
      clearErrors(`mediumPosts.${index}.link`);
      setPendingMeta((prev) => ({ ...prev, [index]: meta }));
    } catch (error) {
      setError(`mediumPosts.${index}.link`, {
        type: "manual",
        message:
          error instanceof Error ? error.message : "Couldn't retrieve post details from that link.",
      });
    } finally {
      setFetchingIndex(null);
    }
  };

  const updateDraft = (index: number, key: keyof MediumPostMeta, value: string) => {
    setPendingMeta((prev) => ({ ...prev, [index]: { ...prev[index], [key]: value } }));
  };

  const reviewCommitted = (index: number) => {
    const current = getValues(`mediumPosts.${index}`);
    setPendingMeta((prev) => ({
      ...prev,
      [index]: {
        title: current.title ?? "",
        description: current.description ?? "",
        imageUrl: current.imageUrl ?? "",
        publishedAt: current.publishedAt ?? "",
      },
    }));
  };

  const removeDraft = (index: number) => {
    setPendingMeta((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const commitDraft = (index: number) => {
    const draft = pendingMeta[index];
    if (!draft) return;

    setValue(`mediumPosts.${index}.title`, draft.title, { shouldDirty: true });
    setValue(`mediumPosts.${index}.description`, draft.description, { shouldDirty: true });
    setValue(`mediumPosts.${index}.imageUrl`, draft.imageUrl, { shouldDirty: true });
    setValue(`mediumPosts.${index}.publishedAt`, draft.publishedAt, { shouldDirty: true });
    removeDraft(index);
  };

  const shiftPendingMeta = (remap: (index: number) => number | null) => {
    setPendingMeta((prev) => {
      const next: Record<number, MediumPostMeta> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const newIndex = remap(Number(key));
        if (newIndex !== null) next[newIndex] = value;
      });
      return next;
    });
  };

  const handleRemove = (index: number) => {
    posts.remove(index);
    shiftPendingMeta((i) => (i === index ? null : i > index ? i - 1 : i));
  };

  const handleMove = (from: number, to: number) => {
    posts.move(from, to);
    shiftPendingMeta((i) => (i === from ? to : i === to ? from : i));
  };

  return (
    <FormSection
      title="Writing"
      description="Paste a Medium post link (friend links supported), fetch details, review, then commit."
      visKey="posts"
      showVisibilityToggle
      showAddButton
      addLabel="Add post"
      onAdd={() =>
        posts.append({
          title: "",
          link: "",
          description: "",
          imageUrl: "",
          publishedAt: "",
        })
      }
      count={posts.fields.length}
      disabled={disabled}
    >
      <div className="flex flex-col gap-4">
        {posts.fields.map((post, index) => {
          const draft = pendingMeta[index];

          return (
            <div
              key={post.id}
              className="flex flex-col gap-3 rounded-lg border border-(--admin-border) p-4"
            >
              <Controller
                control={control}
                name={`mediumPosts.${index}.link`}
                render={({ field, fieldState }) => (
                  <LinkTextField
                    label="Post link (friend link supported)"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={() => {
                      field.onBlur();
                      void fetchDetails(index);
                    }}
                    error={!!fieldState.error}
                    errorText={errors.mediumPosts?.[index]?.link?.message}
                    disabled={disabled}
                    endAdornment={
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => void fetchDetails(index)}
                        disabled={disabled || fetchingIndex !== null || !field.value}
                        className="h-8 w-8"
                        aria-label={`Fetch details for post ${index + 1}`}
                        title="Fetch title, description, image and date from this link"
                      >
                        <Sparkles
                          className={`h-4 w-4 ${fetchingIndex === index ? "animate-spin" : ""}`}
                        />
                      </Button>
                    }
                  />
                )}
              />

              {draft && (
                <div className="flex flex-col gap-3 rounded-lg border border-dashed border-(--admin-border-strong) bg-(--admin-surface-muted) p-3">
                  <p className="text-xs font-medium text-(--admin-text-muted)">
                    Fetched details — review, edit if needed, then commit.
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Post title">
                      <Input
                        value={draft.title}
                        onChange={(e) => updateDraft(index, "title", e.target.value)}
                        disabled={disabled}
                      />
                    </Field>

                    <Field label="Published date">
                      <Input
                        type="date"
                        value={draft.publishedAt}
                        onChange={(e) => updateDraft(index, "publishedAt", e.target.value)}
                        disabled={disabled}
                      />
                    </Field>

                    <Field label="Description">
                      <Textarea
                        value={draft.description}
                        onChange={(e) => updateDraft(index, "description", e.target.value)}
                        disabled={disabled}
                        rows={2}
                      />
                    </Field>

                    <Field label="Image URL">
                      <Input
                        value={draft.imageUrl}
                        onChange={(e) => updateDraft(index, "imageUrl", e.target.value)}
                        disabled={disabled}
                      />
                    </Field>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeDraft(index)}
                      disabled={disabled}
                      className="gap-1.5"
                    >
                      <X className="h-4 w-4" />
                      Discard
                    </Button>

                    <Button
                      type="button"
                      onClick={() => commitDraft(index)}
                      disabled={disabled}
                      className="gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      Commit
                    </Button>
                  </div>
                </div>
              )}

              {!draft && (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-(--admin-text-muted)">
                    Auto-filled details
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => reviewCommitted(index)}
                    disabled={disabled}
                    className="gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Review / Edit
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Controller
                  control={control}
                  name={`mediumPosts.${index}.title`}
                  render={({ field }) => (
                    <Field label="Post title (auto-filled)">
                      <Input value={field.value ?? ""} disabled readOnly />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name={`mediumPosts.${index}.publishedAt`}
                  render={({ field }) => (
                    <Field label="Published date (auto-filled)">
                      <Input type="date" value={field.value ?? ""} disabled readOnly />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name={`mediumPosts.${index}.description`}
                  render={({ field }) => (
                    <Field label="Description (auto-filled)">
                      <Textarea value={field.value ?? ""} disabled readOnly rows={2} />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name={`mediumPosts.${index}.imageUrl`}
                  render={({ field }) => (
                    <Field label="Image URL (auto-filled)">
                      <Input value={field.value ?? ""} disabled readOnly />
                    </Field>
                  )}
                />
              </div>

              <div className="flex w-full items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => index > 0 && handleMove(index, index - 1)}
                  disabled={disabled || index === 0}
                  className="h-10 w-10"
                  aria-label={`Move post ${index + 1} up`}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => index < posts.fields.length - 1 && handleMove(index, index + 1)}
                  disabled={disabled || index === posts.fields.length - 1}
                  className="h-10 w-10"
                  aria-label={`Move post ${index + 1} down`}
                >
                  <ArrowDown className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  className="h-10 w-10"
                  aria-label={`Remove post ${index + 1}`}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </FormSection>
  );
}
