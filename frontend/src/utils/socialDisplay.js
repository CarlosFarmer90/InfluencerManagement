export function getInstagramDisplay(url) {
    if (!url) return "";

    const match =
        url.match(
            /instagram\.com\/([^/?#]+)/i
        );

    if (!match) return url;

    return `@${match[1]}`;
}

export function getFacebookDisplay(url) {
    if (!url) return "";

    const match =
        url.match(
            /facebook\.com\/([^/?#]+)/i
        );

    if (!match) return url;

    return match[1];
}

export function getTikTokDisplay(url) {
    if (!url) return "";

    const match =
        url.match(
            /tiktok\.com\/@([^/?#]+)/i
        );

    if (!match) return url;

    return `@${match[1]}`;
}
export function getInstagramEditValue(url) {
  if (!url) return "";

  const match =
    url.match(
      /instagram\.com\/([^/?#]+)/i
    );

  return match
    ? match[1]
    : url;
}

export function getFacebookEditValue(url) {
  if (!url) return "";

  const match =
    url.match(
      /facebook\.com\/([^/?#]+)/i
    );

  return match
    ? match[1]
    : url;
}

export function getTikTokEditValue(url) {
  if (!url) return "";

  const match =
    url.match(
      /tiktok\.com\/@?([^/?#]+)/i
    );

  return match
    ? match[1]
    : url;
}