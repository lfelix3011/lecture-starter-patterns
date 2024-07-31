const isNullOrUndefined = <T>(value: T | null | undefined): value is null | undefined =>
  value === undefined || value === null;

const isStringNullOrEmpty = (value: string | null | undefined): value is null | undefined =>
  isNullOrUndefined<string>(value) || (value as string).trim().length === 0;

export { isStringNullOrEmpty, isNullOrUndefined };
