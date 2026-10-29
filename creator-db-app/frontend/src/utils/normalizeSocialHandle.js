export function normalizeInstagram(value) {
  if (!value) return null;

  const input = value.trim();

  if (
    input.startsWith("http://") ||
    input.startsWith("https://")
  ) {
    const match = input.match(
      /instagram\.com\/([^/?#]+)/i
    );

    if (!match) {
      return input;
    }

    return `https://www.instagram.com/${match[1]}/`;
  }

  const handle = input.startsWith("@")
    ? input.substring(1)
    : input;

  return `https://www.instagram.com/${handle}/`;
}

export function normalizeFacebook(value) {
  if (!value) return null;

  const input = value.trim();

  if (
    input.startsWith("http://") ||
    input.startsWith("https://")
  ) {
    const match = input.match(
      /facebook\.com\/([^/?#]+)/i
    );

    if (!match) {
      return input;
    }

    return `https://www.facebook.com/${match[1]}/`;
  }

  const handle = input.startsWith("@")
    ? input.substring(1)
    : input;

  return `https://www.facebook.com/${handle}/`;
}

export function normalizeTikTok(value) {
  if (!value) return null;

  const input = value.trim();

  if (
    input.startsWith("http://") ||
    input.startsWith("https://")
  ) {
    const match = input.match(
      /tiktok\.com\/@?([^/?#]+)/i
    );

    if (!match) {
      return input;
    }

    return `https://www.tiktok.com/@${match[1]}/`;
  }

  const handle = input.startsWith("@")
    ? input.substring(1)
    : input;

  return `https://www.tiktok.com/@${handle}/`;
}