'use client';

import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/customer/atoms/Button';
import { User, Mail, Award, LogOut } from 'lucide-react';
import { hasStackAuth } from '@/lib/stack';

export default function ProfilePage() {
  const user = hasStackAuth ? useUser() : null;
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (user === null) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  if (!user) {
    return (
      <main className="min-h-screen pb-20 md:pb-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-phi-6 px-phi-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-phi-3">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-phi-2">
            {user.displayName || 'Your Profile'}
          </h1>
          <p className="text-muted-foreground">{user.primaryEmail}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-phi-4 py-phi-6 space-y-phi-5">
        {/* Account Information */}
        <div className="bg-card border border-border rounded-phi-4 p-phi-5">
          <h2 className="text-xl font-semibold text-foreground mb-phi-4">Account Information</h2>
          <div className="space-y-phi-3">
            <div className="flex items-center gap-phi-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.primaryEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-phi-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Display Name</p>
                <p className="font-medium">{user.displayName || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Points (Placeholder) */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-phi-4 p-phi-5">
          <div className="flex items-center gap-phi-3 mb-phi-3">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Loyalty Rewards</h2>
          </div>
          <p className="text-3xl font-bold text-foreground mb-phi-2">0 Points</p>
          <p className="text-sm text-muted-foreground">
            Earn points with every ticket purchase and redeem for exclusive rewards
          </p>
        </div>

        {/* Order History (Placeholder) */}
        <div className="bg-card border border-border rounded-phi-4 p-phi-5">
          <h2 className="text-xl font-semibold text-foreground mb-phi-4">Order History</h2>
          <div className="text-center py-phi-5 text-muted-foreground">
            <p>No orders yet</p>
            <p className="text-sm mt-phi-2">Your past orders will appear here</p>
          </div>
        </div>

        {/* Sign Out */}
        <div className="text-center">
          <Button
            variant="outline"
            size="md"
            className="min-h-[44px]"
            onClick={() => user.signOut()}
          >
            <LogOut className="w-5 h-5 mr-phi-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </main>
  );
}
