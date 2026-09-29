"use client";

import { ArrowDown, ArrowUp, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Control, Controller, FieldErrors, useFormContext } from "react-hook-form";

import { fetchMediumPostMeta } from "@/app/admin/AdminForm/actions/fetchMediumPostMeta";
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

  const autofill = async (index: number) => {
    const link = getValues(`mediumPosts.${index}.link`);
    if (!link) return;

    setFetchingIndex(index);
    try {
      const meta = await fetchMediumPostMeta(link);

      setValue(`mediumPosts.${index}.title`, meta.title, { shouldDirty: true });
      setValue(`mediumPosts.${index}.description`, meta.description, { shouldDirty: true });
      setValue(`mediumPosts.${index}.imageUrl`, meta.imageUrl, { shouldDirty: true });
      setValue(`mediumPosts.${index}.publishedAt`, meta.publishedAt, { shouldDirty: true });
      clearErrors(`mediumPosts.${index}.link`);
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

  return (
    <FormSection
      title="Writing"
      description="Paste a Medium post link (friend links supported) — details are fetched automatically."
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
        {posts.fields.map((post, index) => (
          <div
            key={post.id}
            className="flex flex-col gap-3 rounded-lg border border-(--admin-border) p-4"
          >
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-3 lg:items-start">
              <div className="w-full lg:col-span-8">
                <Controller
                  control={control}
                  name={`mediumPosts.${index}.link`}
                  render={({ field, fieldState }) => (
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <LinkTextField
                          label="Post link (friend link supported)"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={() => {
                            field.onBlur();
                            void autofill(index);
                          }}
                          error={!!fieldState.error}
                          errorText={errors.mediumPosts?.[index]?.link?.message}
                          disabled={disabled}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => void autofill(index)}
                        disabled={disabled || fetchingIndex !== null || !field.value}
                        className="h-10 w-10 shrink-0"
                        aria-label={`Refresh details for post ${index + 1}`}
                        title="Fetch title, description, image and date from this link"
                      >
                        <Sparkles
                          className={`h-5 w-5 ${fetchingIndex === index ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>
                  )}
                />
              </div>

              <div className="flex w-full items-center justify-center gap-2 lg:col-span-4 lg:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => index > 0 && posts.move(index, index - 1)}
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
                  onClick={() => index < posts.fields.length - 1 && posts.move(index, index + 1)}
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
                  onClick={() => posts.remove(index)}
                  disabled={disabled}
                  className="h-10 w-10"
                  aria-label={`Remove post ${index + 1}`}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
          </div>
        ))}
      </div>
    </FormSection>
  );
}
