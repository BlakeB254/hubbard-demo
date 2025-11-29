import { Skeleton } from '@hubbard-inn/shared/components';

export default function EventLoading() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Event Header Skeleton */}
      <section className="relative h-[40vh] min-h-[300px] bg-muted animate-pulse">
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-phi-4 pb-phi-5 w-full">
            <Skeleton className="h-12 w-2/3 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Event Content Skeleton */}
      <section className="max-w-7xl mx-auto px-phi-4 py-phi-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-phi-5">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-phi-4 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
