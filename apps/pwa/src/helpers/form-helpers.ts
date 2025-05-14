/* eslint-disable @typescript-eslint/no-explicit-any */
export const setNestedValue = (obj: any, path: string[], value: any): any => {
  if (path.length === 1) {
    return { ...obj, [path[0]]: value };
  }
  const [head, ...rest] = path;
  return {
    ...obj,
    [head]: setNestedValue(obj?.[head] ?? {}, rest, value),
  };
};
