import { Spinner } from '@hubbard-inn/shared/components';

/**
 * Next.js 16: Loading UI with Suspense
 * This component is shown while the page content is loading
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
