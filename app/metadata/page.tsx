import { Metadata } from "next";
import { VideoMetadata } from "@/components/features/metadata/video-metadata";
import { PageLayout } from "@/components/page-layout";

export const metadata: Metadata = {
  title: "Video Metadata - YouCux",
  description: "Extract and download YouTube video metadata",
};

export default function MetadataPage() {
  return (
    <PageLayout>
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center">
        <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <VideoMetadata />
        </div>
      </div>
    </PageLayout>
  );
}
