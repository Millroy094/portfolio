import { z } from "zod";

function isQuillEmpty(html: string) {
  return (
    html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim().length === 0
  );
}
function transformUrl(url: string | undefined) {
  if (!url) return;
  const cleaned = url.trim();
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    return `https://${cleaned}`;
  }
  return cleaned;
}
const SkillsArrayGeneric = z
  .array(z.string().min(1, "Skill id cannot be empty"))
  .default([]);
const currentYear = new Date().getFullYear();
const isBrowserFile = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File;

export const ProfileSchema = z.object({
  avatar: z
    .union([
      z.custom<File>(v => isBrowserFile(v), { message: "Invalid file" }),
      z
        .string()
        .min(1)
        .regex(/^avatars\//, "Invalid avatar key"),
      z.string().url()
    ])
    .optional(),
  fullName: z
    .string()
    .max(50, { message: "Full name must be maximum of 50 characters" })
    .nonempty("Please enter a full name"),
  roles: z.array(
    z.object({ value: z.string().min(1, "Please enter a role name") })
  ),
  badges: z.array(
    z.object({
      value: z.union([
        z.string().url(),
        z.custom<File>(v => v instanceof File),
        z
          .string()
          .min(1)
          .regex(/^badges\//, "Invalid badge key")
      ])
    })
  ),
  punchLine: z
    .string()
    .max(100, { message: "punch line must be maximum of 100 characters" })
    .nonempty("Please enter a punch line"),
  linkedIn: z
    .string()
    .optional()
    .transform(transformUrl)
    .pipe(
      z
        .string()
        .url()
        .optional()
    ),
  github: z
    .string()
    .optional()
    .transform(transformUrl)
    .pipe(
      z
        .string()
        .url()
        .optional()
    ),
  stackOverflow: z
    .string()
    .optional()
    .transform(transformUrl)
    .pipe(
      z
        .string()
        .url()
        .optional()
    ),
  resume: z
    .string()
    .optional()
    .transform(transformUrl)
    .pipe(
      z
        .string()
        .url()
        .optional()
    ),
  aboutMe: z
    .string()
    .trim()
    .max(500, { message: "About me must be a maximum of 500 characters" })
    .refine(val => !isQuillEmpty(val), {
      message: "Please tell us a bit about yourself"
    }),
  experiences: z
    .array(
      z.object({
        organization: z.string().nonempty(),
        title: z.string().nonempty(),
        year: z.coerce
          .number({
            required_error: "Year is required",
            invalid_type_error: "Year must be a number"
          })
          .int()
          .gte(1900, { message: "Year must be 1900 or later" })
          .lte(currentYear, { message: `Year cannot be after ${currentYear}` })
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        institute: z.string().nonempty(),
        qualification: z.string().nonempty(),
        year: z.coerce
          .number({
            required_error: "Year is required",
            invalid_type_error: "Year must be a number"
          })
          .int()
          .gte(1900, { message: "Year must be 1900 or later" })
          .lte(currentYear, { message: `Year cannot be after ${currentYear}` })
      })
    )
    .optional(),
  projects: z.array(
    z.object({
      name: z.string().nonempty(),
      description: z.string().nonempty(),
      url: z
        .string()
        .url()
        .nonempty()
    })
  ),
  skills: SkillsArrayGeneric
});

export type ProfileSchemaType = z.input<typeof ProfileSchema>;
