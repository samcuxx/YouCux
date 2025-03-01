interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className={`w-full ${className}`}>{children}</main>
    </div>
  );
}
