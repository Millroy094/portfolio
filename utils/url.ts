export const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

export const addHttps = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};
