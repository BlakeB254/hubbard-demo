import { StackHandler } from '@stackframe/stack';
import { stackServerApp, hasStackAuth } from '@/lib/stack';

export default function AuthPage() {
  if (!hasStackAuth || !stackServerApp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-phi-4">
          <h1 className="text-2xl font-bold text-foreground mb-phi-3">
            Authentication Not Configured
          </h1>
          <p className="text-muted-foreground mb-phi-4">
            Stack Auth has not been set up. Configure the Stack Auth environment variables to enable authentication.
          </p>
          <a href="/" className="text-primary hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return <StackHandler app={stackServerApp} fullPage />;
}
