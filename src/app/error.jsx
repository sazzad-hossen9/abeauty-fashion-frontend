'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/common/Button';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application runtime error:', error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center bg-white">
      <div className="w-16 h-16 rounded-full bg-brand-roseLight flex items-center justify-center text-brand-rose text-2xl font-bold">
        !
      </div>
      <div className="flex flex-col gap-2 max-w-md">
        <h2 className="d text-2xl text-brand-dark m-0">Something went wrong</h2>
        <p className="text-brand-muted text-sm m-0">
          An unexpected error occurred while loading this page. Please try refreshing or return to the home page.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => reset()} variant="primary">
          Try again
        </Button>
        <Button to="/" variant="ghost">
          Back to Home
        </Button>
      </div>
    </div>
  );
}

