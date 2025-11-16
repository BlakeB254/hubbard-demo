import { StackHandlerClient } from './client';

export async function generateStaticParams() {
  return [
    { stack: ['sign-in'] },
    { stack: ['sign-up'] },
    { stack: ['forgot-password'] },
    { stack: ['account-settings'] },
  ];
}

export default function Handler() {
  return <StackHandlerClient />;
}
