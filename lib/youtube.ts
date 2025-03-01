export function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v')
    } else if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1)
    }
  } catch {
    // Ignore parsing errors and return null
    return null
  }
  return null
}

export function isValidYouTubeUrl(url: string): boolean {
  const videoId = extractVideoId(url)
  return videoId !== null && videoId.length === 11
}