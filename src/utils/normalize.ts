export const normalize = (s?: string): string =>
  s?.trim().toLowerCase().replace(/\s+/g, "-") || "";
