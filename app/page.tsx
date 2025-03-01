import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart,
  FileText,
  MessageSquare,
  Sparkles,
  Youtube,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex items-center justify-center pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="mb-2">
            Introducing AI Script Assistant
          </Badge>
          <h1 className="font-bold tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Create Engaging{" "}
            <span className="text-primary">YouTube Scripts</span> with AI
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Transform your video ideas into professional scripts with our AI
            assistant. Get instant feedback, suggestions, and optimize your
            content for maximum engagement.
          </p>
          <div className="space-x-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              <Link href="/script">
                Start Writing
                <MessageSquare className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/features">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
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
              All-in-One YouTube Toolkit
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to create, optimize, and analyze your YouTube
              content
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-4 md:max-w-[85rem]">
            {/* Script Feature */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FileText className="h-4 w-4" />
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <h3 className="font-bold">AI Script Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Create professional video scripts with AI guidance and
                    real-time suggestions.
                  </p>
                  <Link
                    href="/script"
                    className="absolute inset-0 rounded-lg ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <span className="sr-only">Go to AI Script Assistant</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Channel Feature */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Youtube className="h-4 w-4" />
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <h3 className="font-bold">Channel Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get detailed insights about any YouTube channel, including
                    stats, top videos, and more.
                  </p>
                  <Link
                    href="/channel"
                    className="absolute inset-0 rounded-lg ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <span className="sr-only">Go to Channel Analysis</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Metadata Feature */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Sparkles className="h-4 w-4" />
                    <Link
                      href="/metadata"
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      Try Now
                    </Link>
                  </div>
                  <h3 className="font-bold">Metadata Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimize your titles, descriptions, and tags for better
                    visibility and engagement.
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis Feature */}
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <BarChart className="h-4 w-4" />
                    <Link
                      href="/analysis"
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      Try Now
                    </Link>
                  </div>
                  <h3 className="font-bold">Content Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered insights and performance analytics for your
                    videos.
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
              Ready to create better content?
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Start with our AI Script Assistant and transform your video ideas
              into engaging content.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <Link href="/script">Get Started with AI Script Assistant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
