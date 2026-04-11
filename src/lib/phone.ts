const DIGITS_ONLY_REGEX = /\D/g;

export const normalizeDominicanPhone = (value: string): string => {
  const rawDigits = value.replace(DIGITS_ONLY_REGEX, "");
  if (!rawDigits) {
    return "";
  }

  if (rawDigits.startsWith("1")) {
    return rawDigits.slice(0, 11);
  }

  return `1${rawDigits.slice(0, 10)}`;
};

export const formatDominicanPhoneInput = (value: string): string => {
  const normalized = normalizeDominicanPhone(value);
  if (!normalized) {
    return "";
  }

  const localDigits = normalized.slice(1);
  const area = localDigits.slice(0, 3);
  const exchange = localDigits.slice(3, 6);
  const line = localDigits.slice(6, 10);

  let formatted = "+1";

  if (area.length > 0) {
    formatted += ` (${area}`;
  }

  if (area.length === 3) {
    formatted += ")";
  }

  if (exchange.length > 0) {
    formatted += ` ${exchange}`;
  }

  if (line.length > 0) {
    formatted += `-${line}`;
  }

  return formatted;
};

export const isValidDominicanPhone = (value: string): boolean => {
  const normalized = normalizeDominicanPhone(value);
  return normalized.length === 11 && normalized.startsWith("1");
};
