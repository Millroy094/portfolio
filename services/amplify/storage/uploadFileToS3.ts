import { uploadData } from "aws-amplify/storage";

export async function uploadFileToS3(prefix: string, value: unknown): Promise<string | undefined> {
  if (typeof File !== "undefined" && value instanceof File) {
    const f = value;
    const path = `${prefix}/${Date.now()}-${f.name}`;
    await uploadData({ path, data: f, options: { contentType: f.type } }).result;
    return path;
  }
  if (typeof value === "string") return value;
  return undefined;
}
