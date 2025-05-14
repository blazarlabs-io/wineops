export const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }

  return years;
};

export const convertIsoToShortDate = (isoString: string, locale = undefined) => {
  const date = new Date(isoString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' } as const;
  return date.toLocaleDateString(locale, options);
};
