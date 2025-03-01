import { Metadata } from "next";
import ScriptChat from "@/components/features/script/script-chat";
import { PageLayout } from "@/components/page-layout";

export const metadata: Metadata = {
  title: "AI Script Assistant | YouCux",
  description:
    "Get professional help with your YouTube video scripts using AI assistance",
};

export default function ScriptPage() {
  return (
    <PageLayout className="p-0">
      {/* <div className="h-[4rem] px-4 flex items-center border-b bg-background">
        <div className="max-w-3xl mx-auto w-full">
          <h1 className="text-2xl font-semibold">AI Script Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Create engaging YouTube video scripts with AI assistance
          </p>
        </div>
      </div> */}
      <ScriptChat />
    </PageLayout>
  );
}
