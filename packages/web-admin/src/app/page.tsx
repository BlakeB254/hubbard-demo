export default function AdminHomePage() {
  return (
    <main className="min-h-screen p-phi-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-phi-4">
          Hubbard Inn Admin Portal
        </h1>

        <div className="bg-card border border-border rounded-lg p-phi-5">
          <h2 className="text-2xl font-semibold mb-phi-3">
            Welcome to the Admin Dashboard
          </h2>

          <p className="text-muted-foreground mb-phi-4">
            This is the administration portal for managing events, tickets, promoters, and analytics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-4">
            <div className="border border-border rounded-md p-phi-4 hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-phi-2">Events</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage events across all floors
              </p>
            </div>

            <div className="border border-border rounded-md p-phi-4 hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-phi-2">Tickets</h3>
              <p className="text-sm text-muted-foreground">
                Monitor ticket sales and validate QR codes
              </p>
            </div>

            <div className="border border-border rounded-md p-phi-4 hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-phi-2">Promoters</h3>
              <p className="text-sm text-muted-foreground">
                Manage promoter accounts and commissions
              </p>
            </div>

            <div className="border border-border rounded-md p-phi-4 hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-phi-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">
                View performance metrics and insights
              </p>
            </div>

            <div className="border border-border rounded-md p-phi-4 hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-phi-2">Sections</h3>
              <p className="text-sm text-muted-foreground">
                Manage VIP sections and bottle service
              </p>
            </div>

            <div className="border border-border rounded-md p-phi-4 hover:bg-muted transition-colors">
              <h3 className="font-semibold mb-phi-2">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure system preferences
              </p>
            </div>
          </div>
        </div>

        <div className="mt-phi-5 p-phi-4 bg-accent/10 border border-accent rounded-md">
          <h3 className="font-semibold mb-phi-2">Setup Required</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Configure Stack Auth (Neon Auth) for authentication</li>
            <li>Set up Neon database and run migrations</li>
            <li>Configure Stripe for payment processing</li>
            <li>Add portal-specific features as needed</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
