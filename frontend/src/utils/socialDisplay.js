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