"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Copy, ArrowRight, Plus, Minus } from "lucide-react";
import type { AnalysisData } from "@/types/analysis";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface VideoAnalysisDisplayProps {
  data: AnalysisData;
}

export function VideoAnalysisDisplay({ data }: VideoAnalysisDisplayProps) {
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Progressive loading of sections
  useEffect(() => {
    const sections = ["summary", "seo", "tags", "content"];
    let currentIndex = 0;

    const showNextSection = () => {
      if (currentIndex < sections.length) {
        setVisibleSections((prev) => [...prev, sections[currentIndex]]);
        currentIndex++;
      }
    };

    // Show first section immediately
    showNextSection();

    // Show subsequent sections with delay
    const interval = setInterval(showNextSection, 1000);

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderSection = (name: string, content: React.ReactNode) => {
    const isVisible = visibleSections.includes(name);

    return (
      <div
        className={cn(
          "transition-all duration-500",
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-4"
        )}
      >
        {isVisible && content}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="rounded-xl border bg-card shadow-sm min-h-[600px] h-[calc(100vh-14rem)]">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Original Video Section */}
          <div className="lg:w-2/5 p-4 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-r lg:overflow-y-auto thin-scrollbar">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 max-w-xl mx-auto lg:max-w-none">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={
                    data.original.thumbnails.maxres?.url ||
                    data.original.thumbnails.high.url
                  }
                  alt={data.original.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>

              {/* Overall Score */}
              <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Overall Score
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {data.analysis.summary.score}%
                    </span>
                    <span className="text-xs text-muted-foreground">100%</span>
                  </div>
                  <Progress
                    value={data.analysis.summary.score}
                    className="h-2"
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-semibold tracking-tight">
                    {parseInt(data.original.viewCount).toLocaleString()}
                  </p>
                  <h4 className="text-xs font-medium text-muted-foreground mt-1">
                    Views
                  </h4>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-semibold tracking-tight">
                    {data.analysis.engagement.viewsPerDay.toLocaleString()}
                  </p>
                  <h4 className="text-xs font-medium text-muted-foreground mt-1">
                    Views/Day
                  </h4>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-semibold tracking-tight">
                    {(data.analysis.engagement.engagementRate * 100).toFixed(1)}
                    %
                  </p>
                  <h4 className="text-xs font-medium text-muted-foreground mt-1">
                    Engagement
                  </h4>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-lg font-semibold tracking-tight capitalize">
                    {data.analysis.engagement.rating}
                  </p>
                  <h4 className="text-xs font-medium text-muted-foreground mt-1">
                    Rating
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="flex-1 p-4 sm:p-5 lg:p-6 lg:overflow-y-auto thin-scrollbar">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 max-w-xl mx-auto lg:max-w-none">
              {/* Summary Card */}
              {renderSection(
                "summary",
                <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Analysis Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Strengths</h4>
                      <ul className="space-y-1.5">
                        {data.analysis.summary.strengths.map((strength, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <Plus className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span className="flex-1">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1.5">
                        {data.analysis.summary.weaknesses.map((weakness, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <Minus className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <span className="flex-1">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Optimization */}
              {renderSection(
                "seo",
                <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    SEO Optimization
                  </h3>
                  <div className="space-y-4">
                    {/* Title Suggestions */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Title Suggestions</h4>
                      <ul className="space-y-2">
                        {data.analysis.seo.titleSuggestions.map((title, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between gap-4 group"
                          >
                            <span className="text-sm text-muted-foreground">
                              {title}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                copyToClipboard(title, `title-${i}`)
                              }
                            >
                              {copiedField === `title-${i}` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags Analysis */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Tags Optimization</h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-xs font-medium text-red-500 mb-2">
                            Tags to Remove
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {data.analysis.seo.tagsToRemove.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-xs font-medium text-green-500 mb-2">
                            Tags to Add
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {data.analysis.seo.tagsToAdd.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Analysis */}
              {renderSection(
                "content",
                <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Content Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Topics Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.analysis.content.topics.map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Content Suggestions
                      </h4>
                      <ul className="space-y-1.5">
                        {data.analysis.content.suggestions.map(
                          (suggestion, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" />
                              <span className="flex-1">{suggestion}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
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
