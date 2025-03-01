export function VideoAnalysisSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm animate-pulse min-h-[600px] h-[calc(100vh-14rem)]">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Original Video Section */}
        <div className="lg:w-2/5 p-4 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-r lg:overflow-y-auto thin-scrollbar">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Thumbnail Skeleton */}
            <div className="relative aspect-video rounded-lg bg-muted" />

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2 sm:gap-3">
              <div className="h-9 flex-1 rounded-md bg-muted" />
              <div className="h-9 flex-1 rounded-md bg-muted" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg bg-muted p-3">
                  <div className="h-5 w-12 bg-muted-foreground/20 rounded mb-1 mx-auto" />
                  <div className="h-3 w-10 bg-muted-foreground/20 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="flex-1 p-4 sm:p-5 lg:p-6 lg:overflow-y-auto thin-scrollbar">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Summary Card Skeleton */}
            <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
              <div className="h-6 w-24 bg-muted rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </div>
            </div>

            {/* SEO Analysis Skeleton */}
            <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
              <div className="h-6 w-32 bg-muted rounded mb-4" />
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-1/4 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Analysis Skeleton */}
            <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
              <div className="h-6 w-28 bg-muted rounded mb-4" />
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-6 w-16 bg-muted rounded-full" />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-6 w-20 bg-muted rounded-full" />
                  ))}
                </div>
              </div>
            </div>

            {/* Engagement Analysis Skeleton */}
            <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
              <div className="h-6 w-36 bg-muted rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
                <div className="h-4 w-4/5 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
