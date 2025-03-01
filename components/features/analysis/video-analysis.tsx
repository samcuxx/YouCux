"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoAnalysisDisplay } from "@/components/features/analysis/video-analysis-display";
import { VideoAnalysisSkeleton } from "@/components/features/analysis/video-analysis-skeleton";
import { isValidYouTubeUrl } from "@/lib/youtube-utils";
import type { AnalysisData } from "@/types/analysis";
import { motion, AnimatePresence } from "framer-motion";

export function VideoAnalysis() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowForm(false);

    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze video");
      }

      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setUrl("");
      setShowForm(true);
    } finally {
      setIsLoading(false);
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
                Video Analysis
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Get AI-powered insights and optimization suggestions
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
                {isLoading ? "Analyzing..." : "Analyze Video"}
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
            <VideoAnalysisSkeleton />
          </motion.div>
        )}

        {!isLoading && data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <VideoAnalysisDisplay data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
