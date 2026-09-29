"use client";

import { ArrowDown, ArrowUp, Sparkles, TriangleAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import { Control, Controller, FieldErrors, useFormContext, useWatch } from "react-hook-form";

import { fetchMediumPostMeta } from "@/app/admin/AdminForm/actions/fetchMediumPostMeta";
import { ProfileSchemaType } from "@/app/admin/AdminForm/schema";
import LinkTextField from "@/components/controls/LinkTextField";
import { FormSection } from "@/components/FormSection";
import { Button } from "@/components/ui/button";

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
  const { getValues, setValue, setError, clearErrors } = useFormContext<ProfileSchemaType>();
  const [fetchingIndex, setFetchingIndex] = useState<number | null>(null);
  const watchedPosts = useWatch({ control, name: "mediumPosts" });

  const fetchDetails = async (index: number) => {
    const link = getValues(`mediumPosts.${index}.link`);
    if (!link) return;

    setFetchingIndex(index);
    try {
      const meta = await fetchMediumPostMeta(link);
      clearErrors(`mediumPosts.${index}.link`);
      setValue(`mediumPosts.${index}.title`, meta.title, { shouldDirty: true });
      setValue(`mediumPosts.${index}.description`, meta.description, { shouldDirty: true });
      setValue(`mediumPosts.${index}.imageUrl`, meta.imageUrl, { shouldDirty: true });
      setValue(`mediumPosts.${index}.publishedAt`, meta.publishedAt, { shouldDirty: true });
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
      description="Paste a Medium post link (friend links supported) and its details will be filled in automatically."
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
          const watchedPost = watchedPosts?.[index];
          const notFetched = !!watchedPost?.link && !watchedPost?.title;

          return (
            <div
              key={post.id}
              className="flex flex-col gap-3 rounded-lg border border-(--admin-border) p-4"
            >
              {notFetched && (
                <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-500">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Not fetched yet — this post won&apos;t appear on the site until you click the
                    sparkle button to pull in its details.
                  </span>
                </div>
              )}

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

              <div className="flex w-full items-center justify-end gap-2">
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
          );
        })}
      </div>
    </FormSection>
  );
}
