import { NextResponse } from "next/server";
import { getChannelData } from "@/lib/youtube";

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// Simple in-memory cache with 1-hour expiration
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

    console.log("Fetching fresh data for:", channelUrl);
    const channelData = await getChannelData(channelUrl);

    // Store in cache
    cache.set(cacheKey, {
      data: channelData,
      timestamp: Date.now(),
    });

    return NextResponse.json(channelData);
  } catch (error) {
    console.error("Channel analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to analyze channel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
