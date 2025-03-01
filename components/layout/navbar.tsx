"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Youtube,
  FileText,
  BarChart,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";

const navigation = {
  main: [
    {
      title: "Channel",
      href: "/channel",
      description: "Get AI-powered insights about your YouTube channel",
      icon: Youtube,
    },
    {
      title: "Script",
      href: "/script",
      description: "Create engaging YouTube video scripts with AI assistance",
      icon: FileText,
    },
    {
      title: "Metadata",
      href: "/metadata",
      description: "Optimize your video metadata for better visibility",
      icon: Sparkles,
    },
    {
      title: "Analysis",
      href: "/analysis",
      description: "Get detailed insights about your content",
      icon: BarChart,
    },
  ],
  secondary: [
    {
      title: "Features",
      href: "/features",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
  ],
};

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 lg:px-8 mx-auto">
        <nav className="h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link
              href="/"
              className="flex items-center space-x-2 font-bold hover:opacity-90 transition"
            >
              <Youtube className="h-5 w-5 text-primary" />
              <span>YouCux</span>
            </Link>

            {/* Desktop Main Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-6">
              {navigation.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group inline-flex items-center px-3 py-1 text-sm font-medium transition-colors hover:text-foreground/80 rounded-md",
                    pathname === item.href
                      ? "text-foreground bg-muted"
                      : "text-foreground/60 hover:bg-muted/50"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Secondary Navigation & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-4">
              {navigation.secondary.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {item.title}
                </Link>
              ))}
              <Button asChild>
                <Link href="/pricing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </div>

            <ThemeToggle />
            <MobileNav items={[...navigation.main, ...navigation.secondary]} />
          </div>
        </nav>
      </div>
    </header>
  );
}
