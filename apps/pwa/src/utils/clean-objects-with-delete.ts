
import { Timestamp, deleteField, FieldValue } from "firebase/firestore";

type FirestoreCompatible =
  | string
  | number
  | boolean
  | null
  | Timestamp
  | FieldValue;

export function cleanObjectWithDeletes<T>(
  obj: T
): Record<string, FirestoreCompatible | object> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj ?? {})) {
    const cleaned = handleValue(value);

    if (cleaned !== undefined) {
      result[key] = cleaned;
    } else {
      result[key] = deleteField();
    }
  }

  return result;
}

function handleValue(value: any): any {
  if (value instanceof Timestamp) return value;

  if (Array.isArray(value)) {
    const cleanedArray = value
      .map((item) => handleValue(item))
      .filter((item) => !isValueEmpty(item));
    return cleanedArray.length > 0 ? cleanedArray : undefined;
  }

  if (isPlainObject(value)) {
    const cleanedObj = cleanObjectWithDeletes(value);
    return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
  }

  return isValueEmpty(value) ? undefined : value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && value.constructor === Object
  );
}

function isValueEmpty(value: any): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ||
    (isPlainObject(value) && Object.keys(value).length === 0)
  );
}
