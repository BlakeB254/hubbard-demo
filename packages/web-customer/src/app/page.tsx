export default function CustomerHomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-phi-7 px-phi-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-phi-3">
            Hubbard Inn Events
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Experience unforgettable nights across three floors of Chicago's premier venue
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-phi-5 py-phi-6">
        <h2 className="text-2xl font-semibold mb-phi-4">
          Upcoming Events
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-phi-4">
          <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-muted"></div>
            <div className="p-phi-4">
              <h3 className="font-semibold mb-phi-2">Sample Event</h3>
              <p className="text-sm text-muted-foreground mb-phi-3">
                Coming soon - Events will appear here once configured
              </p>
              <button className="w-full bg-primary text-primary-foreground py-phi-2 px-phi-4 rounded-md hover:opacity-90 transition-opacity">
                Get Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-phi-6 grid grid-cols-1 md:grid-cols-3 gap-phi-4">
          <div className="text-center p-phi-5">
            <div className="text-4xl mb-phi-3">🎫</div>
            <h3 className="font-semibold mb-phi-2">Easy Ticketing</h3>
            <p className="text-sm text-muted-foreground">
              Purchase tickets instantly with Apple Pay or Google Pay
            </p>
          </div>

          <div className="text-center p-phi-5">
            <div className="text-4xl mb-phi-3">📱</div>
            <h3 className="font-semibold mb-phi-2">Mobile QR Codes</h3>
            <p className="text-sm text-muted-foreground">
              Tickets delivered instantly to your phone
            </p>
          </div>

          <div className="text-center p-phi-5">
            <div className="text-4xl mb-phi-3">🍾</div>
            <h3 className="font-semibold mb-phi-2">VIP Sections</h3>
            <p className="text-sm text-muted-foreground">
              Reserve bottle service sections with easy deposits
            </p>
          </div>
        </div>

        <div className="mt-phi-6 p-phi-4 bg-accent/10 border border-accent rounded-md">
          <h3 className="font-semibold mb-phi-2">Setup Required</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Configure Stack Auth for user authentication</li>
            <li>Set up Stripe Payment Element with mobile optimization</li>
            <li>Connect to backend API for event data</li>
            <li>Add customer-specific features as needed</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
