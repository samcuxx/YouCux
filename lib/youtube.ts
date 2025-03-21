import { google } from "googleapis";

const youtube = google.youtube("v3");

export interface YouTubeChannelData {
  name: string;
  subscribers: string;
  totalViews: string;
  description: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  bannerUrl: string;
  publishedAt: string;
  country: string;
  customUrl: string;
  topVideos: {
    title: string;
    views: string;
    likes: string;
    comments: string;
    thumbnail: string;
    publishedAt: string;
    duration: string;
  }[];
  tags: string[];
  topics: string[];
}

export async function getChannelData(
  channelUrl: string
): Promise<YouTubeChannelData> {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YouTube API key is not configured");
  }

  // Extract channel ID or handle from URL
  const channelIdentifier = extractChannelIdentifier(channelUrl);

  if (!channelIdentifier) {
    throw new Error("Invalid YouTube channel URL");
  }

  try {
    // Get channel details using the most efficient method
    const channel = await findChannel(channelIdentifier);

    if (!channel) {
      throw new Error(`Channel not found: ${channelIdentifier}`);
    }

    // Get channel's top videos (limit to 5 for faster loading)
    const topVideos = await getTopVideos(channel.id!, 5);

    // Extract topics from topicDetails
    const topics =
      channel.topicDetails?.topicCategories
        ?.map((topic) => topic.split("/").pop()?.replace(/_/g, " ") || "")
        .filter(Boolean) || [];

    // Extract tags from channel keywords
    const tags =
      channel.brandingSettings?.channel?.keywords
        ?.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0) || [];

    return {
      name: channel.snippet?.title || "",
      subscribers: formatNumber(channel.statistics?.subscriberCount || "0"),
      totalViews: formatNumber(channel.statistics?.viewCount || "0"),
      description: channel.snippet?.description || "",
      thumbnails: {
        default: channel.snippet?.thumbnails?.default?.url || "",
        medium: channel.snippet?.thumbnails?.medium?.url || "",
        high: channel.snippet?.thumbnails?.high?.url || "",
      },
      bannerUrl: channel.brandingSettings?.image?.bannerExternalUrl || "",
      publishedAt: formatDate(channel.snippet?.publishedAt || ""),
      country: channel.snippet?.country || "",
      customUrl: channel.snippet?.customUrl || `@${channelIdentifier}`,
      topVideos,
      tags,
      topics,
    };
  } catch (error) {
    console.error("YouTube API Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch channel data"
    );
  }
}

// Helper function to find a channel using multiple methods
async function findChannel(identifier: string) {
  // Try different methods to find the channel
  const methods = [
    // Method 1: Try by channel ID if it looks like a channel ID
    ...(identifier.startsWith("UC")
      ? [
          () =>
            youtube.channels.list({
              key: process.env.YOUTUBE_API_KEY,
              part: [
                "snippet",
                "statistics",
                "topicDetails",
                "brandingSettings",
              ],
              id: [identifier],
            }),
        ]
      : []),

    // Method 2: Try by username
    () =>
      youtube.channels.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ["snippet", "statistics", "topicDetails", "brandingSettings"],
        forUsername: identifier,
      }),

    // Method 3: Search for the channel
    async () => {
      const searchResponse = await youtube.search.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ["snippet"],
        q: identifier,
        type: ["channel"],
        maxResults: 1,
      });

      if (!searchResponse.data.items?.length) {
        return { data: { items: [] } };
      }

      const channelId = searchResponse.data.items[0].id?.channelId;
      if (!channelId) {
        return { data: { items: [] } };
      }

      return youtube.channels.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ["snippet", "statistics", "topicDetails", "brandingSettings"],
        id: [channelId],
      });
    },
  ];

  // Try each method until we find the channel
  for (const method of methods) {
    const response = await method();
    if (response.data.items?.length) {
      return response.data.items[0];
    }
  }

  return null;
}

// Helper function to get top videos for a channel
async function getTopVideos(channelId: string, maxResults: number = 10) {
  try {
    // Get channel's top videos
    const videosResponse = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ["snippet"],
      channelId: channelId,
      order: "viewCount",
      maxResults: maxResults,
      type: ["video"],
    });

    if (!videosResponse.data.items?.length) {
      return [];
    }

    // Get detailed video statistics in a single batch request
    const videoIds = videosResponse.data.items
      .map((item) => item.id?.videoId)
      .filter(Boolean) as string[];

    if (!videoIds.length) {
      return [];
    }

    const videoStatsResponse = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ["statistics", "contentDetails"],
      id: videoIds,
    });

    // Map video data with stats
    return (
      videosResponse.data.items?.map((video) => {
        const stats = videoStatsResponse.data.items?.find(
          (item) => item.id === video.id?.videoId
        );

        return {
          title: video.snippet?.title || "",
          views: formatNumber(stats?.statistics?.viewCount || "0"),
          likes: formatNumber(stats?.statistics?.likeCount || "0"),
          comments: formatNumber(stats?.statistics?.commentCount || "0"),
          thumbnail: video.snippet?.thumbnails?.high?.url || "",
          publishedAt: formatDate(video.snippet?.publishedAt || ""),
          duration: formatDuration(stats?.contentDetails?.duration || ""),
        };
      }) || []
    );
  } catch (error) {
    console.error("Error fetching top videos:", error);
    return []; // Return empty array instead of failing
  }
}

function extractChannelIdentifier(url: string): string {
  url = url.trim().toLowerCase();
  const patterns = {
    handle: /@([^/?]+)/,
    channelId: /channel\/(UC[\w-]+)/,
    user: /user\/([^/?]+)/,
    customUrl: /youtube\.com\/([^/?]+)/,
  };

  const patternEntries = Object.entries(patterns);
  for (let i = 0; i < patternEntries.length; i++) {
    const pattern = patternEntries[i][1];
    const match = url.match(pattern);
    if (match) return match[1].replace("@", "");
  }

  return url.replace(/^@/, "").split("/").pop() || url;
}

function formatNumber(num: string): string {
  const n = parseInt(num);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";

  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "").replace("S", "");

  const parts = [];
  if (hours) parts.push(hours);
  parts.push(minutes || "0");
  parts.push(seconds.padStart(2, "0") || "00");

  return parts.join(":");
}

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

  for (const [_, pattern] of Object.entries(patterns)) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
