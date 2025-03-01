"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoMetadataDisplay } from "@/components/features/metadata/video-metadata-display";
import { VideoMetadataSkeleton } from "@/components/features/metadata/video-metadata-skeleton";
import { isValidYouTubeUrl } from "@/lib/youtube-utils";
import type { YouTubeVideoData } from "@/types/youtube";
import { motion, AnimatePresence } from "framer-motion";

export function VideoMetadata() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<YouTubeVideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const extractMetadata = async (urlToExtract: string) => {
    setIsLoading(true);
    setError(null);

    // Start hiding the form with animation
    setShowForm(false);

    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToExtract }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch video data");
      }

      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setUrl(""); // Clear the input on error
      setShowForm(true); // Show form again on error
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-extract when valid URL is detected
  useEffect(() => {
    const timer = setTimeout(() => {
      if (url && isValidYouTubeUrl(url)) {
        extractMetadata(url);
      }
    }, 500); // Add a small delay to prevent too many requests while typing

    return () => clearTimeout(timer);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && isValidYouTubeUrl(url)) {
      extractMetadata(url);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-xl mx-auto space-y-8"
          >
            <div className="space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Video Metadata
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Extract detailed information about any YouTube video
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 items-center"
            >
              <Input
                type="url"
                placeholder="Enter YouTube URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full text-center text-sm sm:text-base h-12"
                required
              />
              <Button
                type="submit"
                disabled={isLoading || !isValidYouTubeUrl(url)}
                size="lg"
                className="w-full sm:w-auto min-w-[200px] h-12"
              >
                {isLoading ? "Loading..." : "Extract Metadata"}
              </Button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-lg bg-destructive/15 p-4 text-sm text-destructive text-center"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <VideoMetadataSkeleton />
          </motion.div>
        )}

        {!isLoading && data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <VideoMetadataDisplay data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
