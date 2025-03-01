import { NextResponse } from "next/server";
import { extractVideoId, isValidYouTubeUrl } from "@/lib/youtube";
import { openai, extractJsonFromMarkdown } from "@/lib/openai";
import type { AIAnalysis } from "@/types/analysis";

interface APIError {
  status?: number;
  message?: string;
  code?: string;
}

export async function POST(req: Request) {
  try {
    // Check GitHub token first
    if (!process.env.GITHUB_TOKEN) {
      console.error("Missing GitHub token");
      return NextResponse.json(
        { error: "GitHub token not configured" },
        { status: 500 }
      );
    }

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

    // First, get the video data from YouTube API
    const ytResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
    );

    const ytData = await ytResponse.json();

    if (!ytData.items?.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const video = ytData.items[0];
    const videoData = {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnails: video.snippet.thumbnails,
      tags: video.snippet.tags || [],
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      commentCount: video.statistics.commentCount,
      publishedAt: video.snippet.publishedAt,
    };

    // Then, analyze the video data using Azure OpenAI
    const prompt = `You are a YouTube content analysis expert. Analyze this video data and provide detailed insights:
      
    Title: ${videoData.title}
    Description: ${videoData.description}
    Tags: ${videoData.tags.join(", ")}
    Views: ${videoData.viewCount}
    Likes: ${videoData.likeCount}
    Comments: ${videoData.commentCount}
    
    Provide analysis in this exact JSON format:
    {
      "summary": {
        "strengths": ["strength1", "strength2", ...],
        "weaknesses": ["weakness1", "weakness2", ...],
        "score": number (0-100)
      },
      "seo": {
        "titleSuggestions": ["better title 1", "better title 2", ...],
        "descriptionSuggestions": ["suggestion1", "suggestion2", ...],
        "tagsToRemove": ["tag1", "tag2", ...],
        "tagsToAdd": ["tag1", "tag2", ...],
        "keywordDensity": [{"keyword": "word", "count": number, "density": number}, ...]
      },
      "engagement": {
        "rating": "poor" | "fair" | "good" | "excellent",
        "viewsPerDay": number,
        "engagementRate": number,
        "suggestions": ["suggestion1", "suggestion2", ...]
      },
      "content": {
        "topics": ["topic1", "topic2", ...],
        "sentiment": "negative" | "neutral" | "positive",
        "suggestions": ["suggestion1", "suggestion2", ...]
      }
    }`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a YouTube content analysis expert. Provide your analysis in valid JSON format without any markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    try {
      const jsonContent = extractJsonFromMarkdown(
        aiResponse.choices[0].message.content
      );
      const analysis: AIAnalysis = JSON.parse(jsonContent);

      return NextResponse.json({
        original: videoData,
        analysis,
      });
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw AI response:", aiResponse.choices[0].message.content);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Error analyzing video:", error);

    const apiError = error as APIError;

    if (apiError?.status === 401) {
      return NextResponse.json(
        { error: "Authentication failed with AI service" },
        { status: 500 }
      );
    }

    if (apiError?.status === 429) {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze video" },
      { status: 500 }
    );
  }
}
