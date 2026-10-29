export function getTier(followers) {
  const count = Number(followers);

  if (!count || count < 1000) {
    return "";
  }

  if (count <= 10000) {
    return "Nano";
  }

  if (count <= 100000) {
    return "Micro";
  }

  if (count <= 500000) {
    return "Mid_Tier";
  }

  if (count <= 1000000) {
    return "Macro";
  }

  return "Mega";
}