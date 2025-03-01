import Link from "next/link";
import { Youtube } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Script", href: "/script" },
    { name: "Metadata", href: "/metadata" },
    { name: "Analysis", href: "/analysis" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Blog", href: "/blog" },
    { name: "Support", href: "/support" },
    { name: "API", href: "/api-docs" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
    { name: "Contact", href: "/contact" },
  ],
  social: [
    { name: "Twitter", href: "https://twitter.com/youcux" },
    { name: "GitHub", href: "https://github.com/youcux" },
    { name: "Discord", href: "https://discord.gg/youcux" },
    { name: "YouTube", href: "https://youtube.com/@youcux" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="grid gap-8 py-8 md:py-12 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Youtube className="h-6 w-6" />
              <span>YouCux</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-[20rem]">
              Optimize your YouTube content with AI-powered insights, SEO
              recommendations, and content optimization suggestions.
            </p>
          </div>

          {/* Links Sections */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2.5">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="space-y-2.5">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} YouCux. All rights reserved.
          </p>
          <div className="flex gap-4">
            {footerLinks.social.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
