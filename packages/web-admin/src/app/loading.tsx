import { Spinner } from '@hubbard-inn/shared/components';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Spinner size="lg" />
    </div>
  );
}
