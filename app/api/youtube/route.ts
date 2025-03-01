import { NextResponse } from "next/server";
import { extractVideoId, isValidYouTubeUrl } from "@/lib/youtube";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
    );

    const data = await response.json();

    if (!data.items?.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const video = data.items[0];

    return NextResponse.json({
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnails: video.snippet.thumbnails,
      tags: video.snippet.tags || [],
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      commentCount: video.statistics.commentCount,
      publishedAt: video.snippet.publishedAt,
    });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return NextResponse.json(
      { error: "Failed to fetch video data" },
      { status: 500 }
    );
  }
}
