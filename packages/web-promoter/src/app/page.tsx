export default function PromoterHomePage() {
  return (
    <main className="min-h-screen p-phi-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-phi-4">
          Promoter Dashboard
        </h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-phi-4 mb-phi-6">
          <div className="bg-card border border-border rounded-lg p-phi-4">
            <p className="text-sm text-muted-foreground mb-phi-2">Total Clicks</p>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-phi-4">
            <p className="text-sm text-muted-foreground mb-phi-2">Conversions</p>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-phi-4">
            <p className="text-sm text-muted-foreground mb-phi-2">Revenue Generated</p>
            <p className="text-3xl font-bold">$0.00</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-phi-4">
            <p className="text-sm text-muted-foreground mb-phi-2">Total Earnings</p>
            <p className="text-3xl font-bold text-primary">$0.00</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-phi-5">
          {/* Affiliate Links */}
          <div className="bg-card border border-border rounded-lg p-phi-5">
            <h2 className="text-xl font-semibold mb-phi-4">
              Active Links
            </h2>

            <p className="text-muted-foreground mb-phi-4">
              Create and manage your affiliate links for upcoming events
            </p>

            <button className="w-full bg-primary text-primary-foreground py-phi-3 px-phi-4 rounded-md hover:opacity-90 transition-opacity">
              Generate New Link
            </button>

            <div className="mt-phi-4 p-phi-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                No active links yet. Generate your first link to start earning commissions!
              </p>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-card border border-border rounded-lg p-phi-5">
            <h2 className="text-xl font-semibold mb-phi-4">
              Performance Analytics
            </h2>

            <div className="h-64 flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">
                Analytics charts will appear here
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-phi-6 grid grid-cols-1 md:grid-cols-3 gap-phi-4">
          <div className="border border-border rounded-md p-phi-4">
            <h3 className="font-semibold mb-phi-2">📊 Real-time Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor clicks and conversions as they happen
            </p>
          </div>

          <div className="border border-border rounded-md p-phi-4">
            <h3 className="font-semibold mb-phi-2">💰 Instant Commissions</h3>
            <p className="text-sm text-muted-foreground">
              Earn commission on every ticket sold through your links
            </p>
          </div>

          <div className="border border-border rounded-md p-phi-4">
            <h3 className="font-semibold mb-phi-2">📱 Mobile Optimized</h3>
            <p className="text-sm text-muted-foreground">
              Share links easily across all platforms
            </p>
          </div>
        </div>

        <div className="mt-phi-6 p-phi-4 bg-accent/10 border border-accent rounded-md">
          <h3 className="font-semibold mb-phi-2">Setup Required</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Configure Stack Auth for promoter authentication</li>
            <li>Connect to backend API for analytics data</li>
            <li>Set up real-time notifications for conversions</li>
            <li>Add promoter-specific features as needed</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
