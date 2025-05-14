export const extractCountryList = (list: { name: string; code: string }[]) => {
  return list.map((country) => {
    return country.name;
  });
};
