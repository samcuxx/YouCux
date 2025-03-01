export interface YouTubeVideoData {
  videoId: string
  title: string
  description: string
  thumbnails: {
    default: { url: string }
    medium: { url: string }
    high: { url: string }
    maxres?: { url: string }
  }
  tags: string[]
  viewCount: string
  likeCount: string
  commentCount: string
  publishedAt: string
} 