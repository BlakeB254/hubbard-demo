'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@hubbard-inn/shared/components';
import { User, Lock, TrendingUp, ArrowRight, DollarSign, Star, Award } from 'lucide-react';

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  new: {
    email: 'newpromoter@demo.hubbardinn.com',
    password: 'demo123',
    name: 'New Promoter',
    level: 'Starter',
    earnings: '$0',
  },
  active: {
    email: 'promoter@demo.hubbardinn.com',
    password: 'demo123',
    name: 'Active Promoter',
    level: 'Silver',
    earnings: '$2,500',
  },
  top: {
    email: 'toppromoter@demo.hubbardinn.com',
    password: 'demo123',
    name: 'Top Promoter',
    level: 'Gold',
    earnings: '$15,000',
  },
};

export default function PromoterLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo, accept any credentials
    if (email && password) {
      localStorage.setItem('promoter_demo_user', JSON.stringify({ email, role: 'promoter' }));
      router.push('/dashboard');
    } else {
      setError('Please enter email and password');
    }
    setLoading(false);
  };

  const useCredentials = (type: 'new' | 'active' | 'top') => {
    const creds = DEMO_CREDENTIALS[type];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 via-primary to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
          <div className="mb-2">
            <h1 className="font-heading text-3xl text-primary">Hubbard Inn</h1>
            <p className="text-muted-foreground text-sm">Promoter Portal</p>
          </div>
          <CardTitle className="text-xl">Promoter Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Demo Credentials (Click to fill)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => useCredentials('new')}
                className="flex flex-col h-auto py-3"
              >
                <Star className="w-4 h-4 mb-1 text-muted-foreground" />
                <span className="font-semibold text-xs">New</span>
                <span className="text-[10px] text-muted-foreground">$0</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => useCredentials('active')}
                className="flex flex-col h-auto py-3"
              >
                <DollarSign className="w-4 h-4 mb-1 text-accent" />
                <span className="font-semibold text-xs">Silver</span>
                <span className="text-[10px] text-muted-foreground">$2.5k</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => useCredentials('top')}
                className="flex flex-col h-auto py-3"
              >
                <Award className="w-4 h-4 mb-1 text-yellow-500" />
                <span className="font-semibold text-xs">Gold</span>
                <span className="text-[10px] text-muted-foreground">$15k</span>
              </Button>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Password for all demo accounts:</strong> demo123
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Want to become a promoter?{' '}
            <a href="#" className="text-primary hover:underline">
              Apply Now
            </a>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
