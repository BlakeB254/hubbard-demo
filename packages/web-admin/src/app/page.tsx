import { redirect } from 'next/navigation';

/**
 * Root page redirects to dashboard
 */
export default function AdminRootPage() {
  redirect('/dashboard');
}
