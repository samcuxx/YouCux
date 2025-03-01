import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Search, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-bold tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Optimize Your <span className="text-primary">YouTube Content</span>{" "}
            with AI
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Analyze and optimize your YouTube videos with advanced AI. Get
            instant insights, SEO recommendations, and content optimization
            suggestions.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/metadata">
                Extract Metadata
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/analysis">
                Analyze Content
                <BarChart className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full flex items-center justify-center bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="container max-w-[85rem] space-y-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              Features
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Powerful tools to help you understand and improve your YouTube
              content
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem]">
            {/* Metadata Feature */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Search className="h-4 w-4" />
                    <Link
                      href="/metadata"
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      Try Now
                    </Link>
                  </div>
                  <h3 className="font-bold">Metadata Extraction</h3>
                  <p className="text-sm text-muted-foreground">
                    Extract and analyze video metadata including title,
                    description, tags, and statistics.
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis Feature */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Zap className="h-4 w-4" />
                    <Link
                      href="/analysis"
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      Try Now
                    </Link>
                  </div>
                  <h3 className="font-bold">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered insights, SEO recommendations, and content
                    optimization suggestions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full flex items-center justify-center py-8 md:py-12 lg:py-24">
        <div className="container max-w-[85rem]">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              Ready to optimize your content?
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Start analyzing your YouTube videos today and get actionable
              insights.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/metadata">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
