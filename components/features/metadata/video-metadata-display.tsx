"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download, Share2 } from "lucide-react";
import type { YouTubeVideoData } from "@/types/youtube";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      if (isNaN(date.getTime())) {
        return "Not available";
      }
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
    <TooltipProvider>
      <div className="rounded-xl border bg-card shadow-sm min-h-[600px] h-[calc(100vh-14rem)]">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Thumbnail Section - Fixed */}
          <div className="lg:w-2/5 p-4 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-r lg:overflow-y-auto thin-scrollbar">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 max-w-xl mx-auto lg:max-w-none">
              <div className="relative aspect-video rounded-lg overflow-hidden group">
                <Image
                  src={data.thumbnails.maxres?.url || data.thumbnails.high.url}
                  alt={data.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={downloadThumbnail}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Thumbnail
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={downloadThumbnail}
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="sm:hidden">Download Thumbnail</span>
                  <span className="hidden sm:inline">Download JSON</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => copyToClipboard(`https://youtube.com/watch?v=${data.videoId}`, "url")}
                >
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  {copiedField === "url" ? "Copied!" : "Share"}
                </Button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-semibold tracking-tight">
                    {parseInt(data.viewCount).toLocaleString()}
                  </p>
                  <h4 className="text-xs font-medium text-muted-foreground mt-1">
                    Views
                  </h4>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-semibold tracking-tight">
                    {parseInt(data.likeCount).toLocaleString()}
                  </p>
                  <h4 className="text-xs font-medium text-muted-foreground mt-1">
                    Likes
                  </h4>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-semibold tracking-tight">
                    {parseInt(data.commentCount).toLocaleString()}
                  </p>
                  <h4 className="text-xs font-medium text-muted-foreground mt-1">
                    Comments
                  </h4>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-semibold tracking-tight">
                    {formatDate(data.publishedAt)}
                  </p>
                  <h4 className="text-xs font-medium text-muted-foreground mt-1">
                    Published
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Section - Scrollable */}
          <div className="flex-1 p-4 sm:p-5 lg:p-6 lg:overflow-y-auto thin-scrollbar">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 max-w-xl mx-auto lg:max-w-none">
              {/* Title Card */}
              <div className="rounded-lg border bg-card/50 p-3 sm:p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Title
                  </h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(data.title, "title")}
                      >
                        {copiedField === "title" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy title</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-lg font-medium leading-relaxed">
                  {data.title}
                </p>
              </div>

              {/* Description Card */}
              <div className="rounded-lg border bg-card/50 p-3 sm:p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Description
                  </h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy description</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{data.description}</p>
                </div>
              </div>

              {/* Tags Card */}
              {data.tags && data.tags.length > 0 && (
                <div className="rounded-lg border bg-card/50 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Tags
                    </h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy all tags</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
