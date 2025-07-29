import { Timestamp } from "firebase/firestore";

export function cleanObject<T>(obj: T): Partial<T> | undefined {
  if (Array.isArray(obj)) {
    const cleanedArray = obj
      .map(cleanObject)
      .filter(
        (item) =>
          item !== undefined &&
          item !== null &&
          !(typeof item === "string" && `${item}`.trim() === "") &&
          !(Array.isArray(item) && item.length === 0) &&
          !(isPlainObject(item) && Object.keys(item).length === 0),
      );

    return cleanedArray.length > 0 ? (cleanedArray as T) : undefined;
  }

  if (obj !== null && typeof obj === "object") {
    if (obj instanceof Timestamp) {
      return obj;
    }

    const cleanedObj: any = {};

    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = cleanObject(value);

      const isEmpty =
        cleanedValue === undefined ||
        cleanedValue === null ||
        (typeof cleanedValue === "string" && `${cleanedValue}`.trim() === "") ||
        (Array.isArray(cleanedValue) && cleanedValue.length === 0) ||
        (isPlainObject(cleanedValue) && Object.keys(cleanedValue).length === 0);

      if (!isEmpty) {
        cleanedObj[key] = cleanedValue;
      }
    }

    return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
  }

  return obj;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}
