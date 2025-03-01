import { google } from "googleapis";
import { NextResponse } from "next/server";

const youtube = google.youtube("v3");

// Simple in-memory cache with 1-hour expiration
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function POST(request: Request) {
  try {
    const { channelUrl } = await request.json();

    if (!channelUrl) {
      return NextResponse.json(
        { error: "Channel URL is required" },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = channelUrl.toLowerCase().trim();
    const cachedData = cache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log("Returning cached data for:", channelUrl);
      return NextResponse.json(cachedData.data);
    }

    // Extract channel ID or handle from URL
    const channelIdentifier = extractChannelIdentifier(channelUrl);

    if (!channelIdentifier) {
      return NextResponse.json(
        { error: "Invalid YouTube channel URL" },
        { status: 400 }
      );
    }

    // Get channel details
    const channel = await findChannel(channelIdentifier);

    if (!channel) {
      return NextResponse.json(
        { error: `Channel not found: ${channelIdentifier}` },
        { status: 404 }
      );
    }

    // Get channel's top videos
    const topVideos = await getTopVideos(channel.id!, 5);

    // Extract topics and tags
    const topics =
      channel.topicDetails?.topicCategories
        ?.map((topic) => topic.split("/").pop()?.replace(/_/g, " ") || "")
        .filter(Boolean) || [];

    const tags =
      channel.brandingSettings?.channel?.keywords
        ?.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0) || [];

    // Format the response
    const channelData = {
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
      customUrl: channel.snippet?.customUrl || `@${channelIdentifier}`,
      topVideos,
      tags,
      topics,
    };

    // Store in cache
    cache.set(cacheKey, {
      data: channelData,
      timestamp: Date.now(),
    });

    return NextResponse.json(channelData);
  } catch (error) {
    console.error("YouTube API Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch channel data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Helper functions
function extractChannelIdentifier(url: string): string {
  url = url.trim().toLowerCase();
  const patterns = {
    handle: /@([^/?]+)/,
    channelId: /channel\/(UC[\w-]+)/,
    user: /user\/([^/?]+)/,
    customUrl: /youtube\.com\/([^/?]+)/,
  };

  for (const [, pattern] of Object.entries(patterns)) {
    const match = url.match(pattern);
    if (match) return match[1].replace("@", "");
  }

  return url.replace(/^@/, "").split("/").pop() || url;
}

async function findChannel(identifier: string) {
  const methods = [
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
    () =>
      youtube.channels.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ["snippet", "statistics", "topicDetails", "brandingSettings"],
        forUsername: identifier,
      }),
    async () => {
      const searchResponse = await youtube.search.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ["snippet"],
        q: identifier,
        type: ["channel"],
        maxResults: 1,
      });

      if (!searchResponse.data.items?.length) return { data: { items: [] } };

      const channelId = searchResponse.data.items[0].id?.channelId;
      if (!channelId) return { data: { items: [] } };

      return youtube.channels.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ["snippet", "statistics", "topicDetails", "brandingSettings"],
        id: [channelId],
      });
    },
  ];

  for (const method of methods) {
    const response = await method();
    if (response.data.items?.length) return response.data.items[0];
  }

  return null;
}

async function getTopVideos(channelId: string, maxResults: number = 5) {
  try {
    const videosResponse = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ["snippet"],
      channelId: channelId,
      order: "viewCount",
      maxResults: maxResults,
      type: ["video"],
    });

    if (!videosResponse.data.items?.length) return [];

    const videoIds = videosResponse.data.items
      .map((item) => item.id?.videoId)
      .filter(Boolean) as string[];

    if (!videoIds.length) return [];

    const videoStatsResponse = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ["statistics", "contentDetails"],
      id: videoIds,
    });

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
    return [];
  }
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
