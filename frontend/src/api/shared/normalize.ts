const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

export const normalizeArray = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];

  if (
    isRecord(data) &&
    Array.isArray((data as Record<string, unknown>).content)
  ) {
    return (data as Record<string, unknown>).content as T[];
  }

  if (isRecord(data) && Array.isArray((data as Record<string, unknown>).data)) {
    return (data as Record<string, unknown>).data as T[];
  }

  return [];
};