"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Globe, Clock, Eye, ThumbsUp, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelData {
  name: string;
  subscribers: string;
  totalViews: string;
  description: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  bannerUrl?: string;
  publishedAt: string;
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

function ChannelSkeleton() {
  return (
    <div className="space-y-6">
      {/* Banner Skeleton */}
      <div className="relative w-full h-[200px] overflow-hidden rounded-lg">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Channel Header Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>

        {/* Content Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>

        {/* Stats Skeleton */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChannelOverview() {
  const [channelUrl, setChannelUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!channelUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube channel URL",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/youtube/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze channel");
      }

      const data = await response.json();
      setChannelData(data);
      toast({
        title: "Channel analyzed successfully",
        description: "Your channel overview is ready.",
      });
    } catch (error) {
      console.error("Error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to analyze channel";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Channel Overview</h1>
        <p className="text-muted-foreground">
          Enter your YouTube channel URL to get detailed insights and
          optimization recommendations.
        </p>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                placeholder="www.youtube.com/@channelname"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Analyze"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <ChannelSkeleton />
      ) : (
        channelData && (
          <div className="space-y-6">
            {/* Channel Banner */}
            <div className="relative w-full h-[200px] overflow-hidden rounded-lg bg-muted">
              {channelData.bannerUrl ? (
                <Image
                  src={channelData.bannerUrl}
                  alt={`${channelData.name} banner`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    // Hide the image on error
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <p className="text-muted-foreground">No banner available</p>
                </div>
              )}
            </div>

            {/* Channel Header */}
            <Card className="-mt-16 relative z-10 mx-4">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20">
                    <Image
                      src={
                        channelData.thumbnails.medium ||
                        channelData.thumbnails.default
                      }
                      alt={channelData.name}
                      width={80}
                      height={80}
                      className="rounded-full ring-4 ring-background object-cover"
                      onError={(e) => {
                        // Replace with placeholder on error
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/80x80/gray/white?text=Channel";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">
                      {channelData.name}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {channelData.subscribers} Subscribers |{" "}
                      {channelData.totalViews} Total Views
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created {channelData.publishedAt}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="shrink-0"
                  >
                    <a
                      href={`https://youtube.com/${channelData.customUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      View Channel
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Main Content */}
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="videos">Top Videos</TabsTrigger>
                <TabsTrigger value="topics">Topics & Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Channel Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {channelData.description ? (
                      <p className="whitespace-pre-wrap text-muted-foreground">
                        {channelData.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No channel description available
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Total Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {channelData.totalViews}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Subscribers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {channelData.subscribers}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Channel Age
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {channelData.publishedAt}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                {/* Top Videos */}
                {channelData.topVideos.length > 0 ? (
                  <div className="grid gap-4">
                    {channelData.topVideos.map((video, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative aspect-video w-full sm:w-40 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 160px"
                                loading={index < 3 ? "eager" : "lazy"}
                                onError={(e) => {
                                  // Replace with placeholder on error
                                  (e.target as HTMLImageElement).src =
                                    "https://placehold.co/320x180/gray/white?text=Video";
                                }}
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <h3 className="font-semibold line-clamp-2">
                                {video.title}
                              </h3>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {video.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {video.views} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  {video.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {video.comments}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Published {video.publishedAt}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">
                        No videos found for this channel
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="topics" className="space-y-6">
                {/* Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {channelData.topics.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {channelData.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No topics available
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {channelData.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {channelData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No tags available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )
      )}
    </div>
  );
}
