export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false;

  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/i,
  ];

  return patterns.some((pattern) => pattern.test(url));
}

export function extractVideoId(url: string): string | null {
  if (!url) return null;

  // Clean the URL
  url = url.trim();

  // Regular expressions for different YouTube URL formats
  const patterns = {
    standard: /(?:youtube\.com\/watch\?v=)([\w-]+)/i,
    shortened: /(?:youtu\.be\/)([\w-]+)/i,
    embed: /(?:youtube\.com\/embed\/)([\w-]+)/i,
    shorts: /(?:youtube\.com\/shorts\/)([\w-]+)/i,
    v: /[?&]v=([\w-]+)/i,
  };

  for (const [, pattern] of Object.entries(patterns)) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
