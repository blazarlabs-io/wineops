export function formatNumber(
  value: number | null | undefined,
  decimals?: number,
  fallback: string = "0"
): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  const num = Number(value);

  if (num % 1 === 0) {
    return num.toString();
  }

  if (decimals === undefined) {
    return num.toFixed(2);
  }

  if (decimals === 0) {
    return Math.floor(num).toString();
  }

  const formatted = num.toFixed(decimals);

  if (parseFloat(formatted) === Math.floor(num)) {
    return Math.floor(num).toString();
  }

  return formatted;
}

export function formatNumberWithUnit(
  value: number | null | undefined,
  unit: string,
  decimals?: number,
  fallback: string = "0"
): string {
  const formattedValue = formatNumber(value, decimals, fallback);
  return `${formattedValue}${unit}`;
}

export function formatNumberWithLowerCaseUnitAndSpace(
  value: number | null | undefined,
  unit: string,
  decimals?: number,
  fallback: string = "0"
): string {
  const formattedValue = formatNumber(value, decimals, fallback);
  return `${formattedValue} ${unit.toLowerCase()}`;
}

export function formatNumberWithUnitAndSpace(
  value: number | null | undefined,
  unit: string,
  decimals?: number,
  fallback: string = "0"
): string {
  const formattedValue = formatNumber(value, decimals, fallback);
  return `${formattedValue} ${unit}`;
}
