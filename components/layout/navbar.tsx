"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Youtube } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navigation = [
  { name: "Metadata", href: "/metadata" },
  { name: "Analysis", href: "/analysis" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <nav className="flex h-14 items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold hover:opacity-90 transition"
          >
            <Youtube className="h-5 w-5 text-primary" />
            <span>YouCux</span>
          </Link>

          <div className="hidden md:flex md:gap-x-8 items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground font-medium"
                    : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
