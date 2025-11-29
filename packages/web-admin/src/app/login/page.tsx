'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@hubbard-inn/shared/components';
import { User, Lock, Shield, ArrowRight } from 'lucide-react';

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@demo.hubbardinn.com',
    password: 'demo123',
    name: 'Demo Admin',
    role: 'Full Access',
  },
  manager: {
    email: 'manager@demo.hubbardinn.com',
    password: 'demo123',
    name: 'Event Manager',
    role: 'Events Only',
  },
  checkin: {
    email: 'checkin@demo.hubbardinn.com',
    password: 'demo123',
    name: 'Check-In Staff',
    role: 'Check-In Only',
  },
};

export default function AdminLoginPage() {
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
      localStorage.setItem('admin_demo_user', JSON.stringify({ email, role: 'admin' }));
      router.push('/dashboard');
    } else {
      setError('Please enter email and password');
    }
    setLoading(false);
  };

  const useCredentials = (type: 'admin' | 'manager' | 'checkin') => {
    const creds = DEMO_CREDENTIALS[type];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="mb-2">
            <h1 className="font-heading text-3xl text-primary">Hubbard Inn</h1>
            <p className="text-muted-foreground text-sm">Admin Portal</p>
          </div>
          <CardTitle className="text-xl">Administrator Login</CardTitle>
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
                  placeholder="Enter admin email"
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
              Sign In to Admin
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
                onClick={() => useCredentials('admin')}
                className="flex flex-col h-auto py-3"
              >
                <Shield className="w-4 h-4 mb-1 text-primary" />
                <span className="font-semibold text-xs">Admin</span>
                <span className="text-[10px] text-muted-foreground">Full Access</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => useCredentials('manager')}
                className="flex flex-col h-auto py-3"
              >
                <User className="w-4 h-4 mb-1 text-accent" />
                <span className="font-semibold text-xs">Manager</span>
                <span className="text-[10px] text-muted-foreground">Events</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => useCredentials('checkin')}
                className="flex flex-col h-auto py-3"
              >
                <User className="w-4 h-4 mb-1 text-success" />
                <span className="font-semibold text-xs">Staff</span>
                <span className="text-[10px] text-muted-foreground">Check-In</span>
              </Button>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Password for all demo accounts:</strong> demo123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
