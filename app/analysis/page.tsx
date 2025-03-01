import { Metadata } from "next";
import { VideoAnalysis } from "@/components/features/analysis/video-analysis";
import { PageLayout } from "@/components/page-layout";

export const metadata: Metadata = {
  title: "Video Analysis - YouCux",
  description: "AI-powered YouTube video content analysis and optimization",
};

export default function AnalysisPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
         
          <VideoAnalysis />
        </div>
      </div>
    </PageLayout>
  );
}
