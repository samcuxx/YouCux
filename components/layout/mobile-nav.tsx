"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ChevronRight } from "lucide-react";

interface MobileNavProps {
  items: {
    title: string;
    href: string;
    description?: string;
  }[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md p-0">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="text-lg font-semibold">Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col py-6">
          <div className="px-6 space-y-1">
            {items.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-4 px-4 rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
