import { Spinner } from '@hubbard-inn/shared/components';

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
