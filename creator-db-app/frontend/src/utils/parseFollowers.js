export const parseFollowers = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  let str = String(value)
    .trim()
    .replace(/,/g, "");

  const lower = str.toLowerCase();

  if (lower.endsWith("k")) {
    return Math.round(
      parseFloat(lower.replace("k", "")) * 1000
    );
  }

  if (lower.endsWith("m")) {
    return Math.round(
      parseFloat(lower.replace("m", "")) * 1000000
    );
  }

  const parsed = Number(str);

  return isNaN(parsed) ? null : parsed;
};