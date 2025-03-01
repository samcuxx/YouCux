import { Metadata } from "next"
import { VideoAnalysis } from "@/components/features/analysis/video-analysis"
import { PageLayout } from "@/components/page-layout"

export const metadata: Metadata = {
  title: "Video Analysis - YouCux",
  description: "AI-powered YouTube video content analysis and optimization",
}

export default function AnalysisPage() {
  return (
    <PageLayout>
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center">
        <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <VideoAnalysis />
        </div>
      </div>
    </PageLayout>
  )
} 