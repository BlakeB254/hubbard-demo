import Link from 'next/link';
import { Button } from '@hubbard-inn/shared/components';
import { Home, Search } from 'lucide-react';

/**
 * Next.js 16: 404 Not Found Page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-heading text-primary mb-4">404</h1>
        <h2 className="text-2xl font-heading font-normal text-primary-dark mb-3">
          Page not found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="default">
              <Home className="w-4 h-4 mr-2" />
              Go home
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Browse events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
