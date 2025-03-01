"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download, Share2, ExternalLink } from "lucide-react";
import type { YouTubeVideoData } from "@/types/youtube";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VideoMetadataDisplayProps {
  data: YouTubeVideoData;
}

export function VideoMetadataDisplay({ data }: VideoMetadataDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadThumbnail = async () => {
    const response = await fetch(
      data.thumbnails.maxres?.url || data.thumbnails.high.url
    );
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.videoId}-thumbnail.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Not available";
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return "Not available";
    }
  };

  return (
    <div className="grid gap-4 md:gap-6 lg:gap-8">
      {/* Main Content Card */}
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full">
            <Image
              src={data.thumbnails.maxres?.url || data.thumbnails.high.url}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                {data.title}
              </h1>
              <div className="flex items-center gap-3 text-white/90">
                <span className="text-sm">
                  {parseInt(data.viewCount).toLocaleString()} views
                </span>
                <span className="text-sm">•</span>
                <span className="text-sm">{formatDate(data.publishedAt)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadThumbnail}
              className="flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Thumbnail
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `https://youtube.com/watch?v=${data.videoId}`,
                  "url"
                )
              }
              className="flex-1 sm:flex-none"
            >
              {copiedField === "url" ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              {copiedField === "url" ? "Copied!" : "Share Link"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 sm:flex-none"
            >
              <a
                href={`https://youtube.com/watch?v=${data.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in YouTube
              </a>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <CardDescription>Views</CardDescription>
                <CardTitle className="text-xl">
                  {parseInt(data.viewCount).toLocaleString()}
                </CardTitle>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <CardDescription>Likes</CardDescription>
                <CardTitle className="text-xl">
                  {parseInt(data.likeCount).toLocaleString()}
                </CardTitle>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <CardDescription>Comments</CardDescription>
                <CardTitle className="text-xl">
                  {parseInt(data.commentCount).toLocaleString()}
                </CardTitle>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <CardDescription>Published</CardDescription>
                <CardTitle className="text-xl">
                  {formatDate(data.publishedAt)}
                </CardTitle>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="mb-6">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Description</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(data.description, "description")
                  }
                >
                  {copiedField === "description" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {data.description}
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <Card>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Tags</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(data.tags.join(", "), "tags")
                    }
                  >
                    {copiedField === "tags" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
