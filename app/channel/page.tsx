import { Metadata } from "next";
import { PageLayout } from "@/components/page-layout";
import { ChannelOverview } from "@/components/features/channel/channel-overview";

export const metadata: Metadata = {
  title: "Channel Overview - YouCux",
  description:
    "Analyze and optimize your YouTube channel with AI-powered insights",
};

export default function ChannelPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ChannelOverview />
      </div>
    </PageLayout>
  );
}
