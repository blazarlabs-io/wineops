/* eslint-disable @typescript-eslint/no-explicit-any */

export function cleanUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined).filter((value) => value !== undefined);
  } else if (obj !== null && typeof obj === "object") {
    const cleaned: any = {};
    Object.keys(obj).forEach((key) => {
      if (key !== "executionDate" && key !== "date") {
        const value = cleanUndefined(obj[key]);
        if (value !== undefined) {
          cleaned[key] = value;
        }
      } else {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  } else {
    return obj;
  }
}
