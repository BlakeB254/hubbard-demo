import { Sparkles, TrendingUp, Link as LinkIcon } from 'lucide-react';

export default function PromoterHomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-7xl mx-auto px-phi-5 py-phi-7">
        {/* Hero Section */}
        <div className="text-center mb-phi-7">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-phi-4">
            <span className="text-primary-foreground font-bold text-2xl">H</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-phi-4">
            Hubbard Inn Promoter Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn commissions by promoting events. Track your links, monitor performance, and get paid for every ticket sold.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-phi-5 mb-phi-7">
          <div className="bg-card border border-border rounded-lg p-phi-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-phi-3">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-phi-2 text-lg">Real-time Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Monitor clicks, conversions, and earnings as they happen with live updates every 30 seconds
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-phi-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-phi-3">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-phi-2 text-lg">Competitive Commissions</h3>
            <p className="text-sm text-muted-foreground">
              Earn 10-15% commission on every ticket sold through your unique affiliate links
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-phi-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-phi-3">
              <LinkIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-phi-2 text-lg">Easy Sharing</h3>
            <p className="text-sm text-muted-foreground">
              Generate custom links with one click and share across all your social platforms
            </p>
          </div>
        </div>

        {/* Setup Notice */}
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-phi-6">
          <h2 className="text-2xl font-bold mb-phi-4 text-center">Authentication Setup Required</h2>
          <p className="text-center text-muted-foreground mb-phi-3">
            This portal requires Stack Auth (Neon Auth) to be configured for promoter authentication.
          </p>
          <p className="text-sm text-center text-muted-foreground">
            Please configure authentication to enable sign-in and access the promoter dashboard.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-phi-7 text-center text-sm text-muted-foreground">
          <p>© 2025 Hubbard Inn. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
