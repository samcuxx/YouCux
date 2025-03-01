export function VideoMetadataSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm animate-pulse h-[calc(100vh-12rem)]">
      <div className="flex flex-col md:flex-row h-full">
        {/* Thumbnail Section */}
        <div className="md:w-2/5 p-6 border-b md:border-b-0 md:border-r">
          <div className="space-y-6">
            <div className="relative aspect-video rounded-lg bg-muted" />
            
            <div className="flex gap-3">
              <div className="h-9 flex-1 rounded-md bg-muted" />
              <div className="h-9 flex-1 rounded-md bg-muted" />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg bg-muted p-3">
                  <div className="h-5 w-12 bg-muted-foreground/20 rounded mb-1 mx-auto" />
                  <div className="h-3 w-10 bg-muted-foreground/20 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {/* Title Card Skeleton */}
            <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
              <div className="h-6 w-full bg-muted rounded" />
            </div>

            {/* Description Card Skeleton */}
            <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </div>

            {/* Tags Card Skeleton */}
            <div className="rounded-lg border bg-card/50 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-muted rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 