/* eslint-disable @typescript-eslint/no-explicit-any */
import { UNITS } from "@/data/constants";

export const hasKeyFromArray = (errorKeys: string[], errorsObj: any) =>
  errorKeys.some((element) => Object.keys(errorsObj).includes(element));

export const getResultsWithUnits = (results: any) =>
  Object.entries(results).reduce(
    (acc, [key, value]) => {
      const unit = UNITS[key as keyof typeof UNITS];

      if (typeof value === "number" && value > 0) {
        acc[key] = { value, ...(unit && { unit }) };
      } else if (
        value &&
        typeof value === "object" &&
        "value" in value &&
        typeof (value as { value: unknown }).value === "number" &&
        (value as { value: number }).value > 0
      ) {
        const val = (value as { value: number }).value;
        acc[key] = { value: val, ...(unit && { unit }) };
      }

      return acc;
    },
    {} as Record<string, { value: number; unit?: string }>,
  );
