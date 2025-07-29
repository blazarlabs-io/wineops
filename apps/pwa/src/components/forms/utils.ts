
export const hasKeyFromArray = (errorKeys: string[], errorsObj: any) =>
  errorKeys.some((element) => Object.keys(errorsObj).includes(element));
