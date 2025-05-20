/* eslint-disable @typescript-eslint/no-explicit-any */
export const normalizeToFlatStringArray = (input: any): string[] => {
  const result: string[] = [];

  function recurse(value: any): void {
    if (typeof value === "string") {
      result.push(value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        recurse(item);
      }
    } else if (typeof value === "object" && value !== null) {
      for (const key in value) {
        recurse(key); // if keys are strings, include them too
        recurse(value[key]);
      }
    }
  }

  recurse(input);
  return result;
};
