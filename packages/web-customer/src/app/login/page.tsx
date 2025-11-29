'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@hubbard-inn/shared/components';
import { User, Lock, ArrowRight } from 'lucide-react';

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  customer: {
    email: 'customer@demo.hubbardinn.com',
    password: 'demo123',
    name: 'Demo Customer',
  },
  vip: {
    email: 'vip@demo.hubbardinn.com',
    password: 'demo123',
    name: 'VIP Guest',
  },
};

export default function CustomerLoginPage() {
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
      localStorage.setItem('customer_demo_user', JSON.stringify({ email, role: 'customer' }));
      router.push('/');
    } else {
      setError('Please enter email and password');
    }
    setLoading(false);
  };

  const useCredentials = (type: 'customer' | 'vip') => {
    const creds = DEMO_CREDENTIALS[type];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <h1 className="font-heading text-3xl text-primary">Hubbard Inn</h1>
            <p className="text-muted-foreground text-sm">Customer Portal</p>
          </div>
          <CardTitle className="text-xl">Welcome Back</CardTitle>
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
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => useCredentials('customer')}
                className="flex flex-col h-auto py-3"
              >
                <span className="font-semibold">Customer</span>
                <span className="text-xs text-muted-foreground mt-1">Regular User</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => useCredentials('vip')}
                className="flex flex-col h-auto py-3"
              >
                <span className="font-semibold">VIP Guest</span>
                <span className="text-xs text-muted-foreground mt-1">Premium Access</span>
              </Button>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Password for all demo accounts:</strong> demo123
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/events" className="text-primary hover:underline">
              Browse as Guest
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
