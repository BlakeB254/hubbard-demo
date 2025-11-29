import { MobileNavigation } from '@/components/customer/organisms/MobileNavigation';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MobileNavigation />
    </>
  );
}
