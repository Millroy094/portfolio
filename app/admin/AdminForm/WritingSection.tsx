"use client";

import { ArrowDown, ArrowUp, ChevronDown, Sparkles, TriangleAlert, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Control, Controller, useFormContext, useWatch } from "react-hook-form";

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
  disabled: boolean;
  posts: {
    fields: { id: string }[];
    append: (v: MediumPostRecord) => void;
    remove: (index: number) => void;
    move: (from: number, to: number) => void;
  };
}

export default function WritingSection({ control, disabled, posts }: WritingSectionProps) {
  const { getValues, setValue, setError, clearErrors } = useFormContext<ProfileSchemaType>();
  const [fetchingIndex, setFetchingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const watchedPosts = useWatch({ control, name: "mediumPosts" });
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchDetails = async (index: number) => {
    const link = getValues(`mediumPosts.${index}.link`);
    if (!link || !isMountedRef.current) return;

    if (isMountedRef.current) {
      setFetchingIndex(index);
    }

    abortControllerRef.current = new AbortController();

    try {
      const meta = await fetchMediumPostMeta(link);
      if (isMountedRef.current) {
        clearErrors(`mediumPosts.${index}.link`);
        setValue(`mediumPosts.${index}.title`, meta.title, { shouldDirty: true });
        setValue(`mediumPosts.${index}.description`, meta.description, { shouldDirty: true });
        setValue(`mediumPosts.${index}.imageUrl`, meta.imageUrl, { shouldDirty: true });
        setValue(`mediumPosts.${index}.publishedAt`, meta.publishedAt, { shouldDirty: true });
      }
    } catch (error) {
      if (isMountedRef.current && error instanceof Error && error.name !== "AbortError") {
        const errorMessage = error.message || "Couldn't retrieve post details from that link.";
        setError(`mediumPosts.${index}.link`, {
          type: "manual",
          message: errorMessage,
        });
      }
    } finally {
      if (isMountedRef.current) {
        setFetchingIndex(null);
      }
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

              <div className="flex flex-col gap-3 lg:grid lg:grid-cols-12 lg:gap-3 lg:items-start min-w-0">
                <div className="w-full lg:col-span-10 min-w-0">
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
                        errorText={fieldState.error?.message}
                        disabled={disabled}
                        endAdornment={
                          <Button
                            type="button"
                            variant={watchedPost?.title ? "default" : "outline"}
                            size="icon"
                            onClick={() => void fetchDetails(index)}
                            disabled={disabled || fetchingIndex !== null || !field.value}
                            className="h-8 w-8"
                            aria-label={`Fetch details for post ${index + 1}`}
                            title={
                              watchedPost?.title
                                ? "Post validated"
                                : "Fetch title, description, image and date from this link"
                            }
                          >
                            <Sparkles
                              className={`h-4 w-4 ${fetchingIndex === index ? "animate-spin" : ""}`}
                            />
                          </Button>
                        }
                      />
                    )}
                  />
                </div>

                <div className="hidden w-full items-end justify-end gap-2 lg:col-span-2 lg:flex">
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

              {watchedPost?.title && (
                <div className="flex flex-col gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="flex min-w-0 items-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-surface-muted) px-4 py-3 text-left hover:bg-(--admin-border) transition-colors"
                  >
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-(--admin-text-muted) transition-transform ${
                        expandedIndex === index ? "rotate-180" : ""
                      }`}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-(--admin-text)">
                      {watchedPost.title}
                    </span>
                  </button>

                  {expandedIndex === index && (
                    <div className="overflow-hidden rounded-lg border border-(--admin-border) bg-linear-to-br from-(--admin-surface-muted) to-transparent p-4 min-w-0 relative before:absolute before:inset-0 before:left-0 before:w-1 before:bg-linear-to-b before:from-blue-500 before:to-transparent before:opacity-40">
                      <div className="relative z-10 min-w-0">
                        <h4 className="mb-4 text-sm font-semibold text-(--admin-text)">
                          Post Details
                        </h4>
                        <div className="space-y-3 text-sm min-w-0">
                          <div className="min-w-0">
                            <span className="text-xs font-medium uppercase tracking-wider text-(--admin-text-muted)">
                              Title
                            </span>
                            <p className="mt-1.5 text-(--admin-text)">{watchedPost.title}</p>
                          </div>

                          {watchedPost.publishedAt && (
                            <div className="min-w-0">
                              <span className="text-xs font-medium uppercase tracking-wider text-(--admin-text-muted)">
                                Published
                              </span>
                              <p className="mt-1.5 text-(--admin-text)">
                                {watchedPost.publishedAt}
                              </p>
                            </div>
                          )}

                          {watchedPost.description && (
                            <div className="min-w-0">
                              <span className="text-xs font-medium uppercase tracking-wider text-(--admin-text-muted)">
                                Description
                              </span>
                              <p className="mt-1.5 line-clamp-3 text-(--admin-text)">
                                {watchedPost.description}
                              </p>
                            </div>
                          )}

                          {watchedPost.imageUrl && (
                            <div className="min-w-0">
                              <span className="text-xs font-medium uppercase tracking-wider text-(--admin-text-muted)">
                                Image URL
                              </span>
                              <p className="mt-1.5 break-all text-(--admin-text)">
                                {watchedPost.imageUrl}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:hidden">
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
