import React from 'react';
import LoadingGif from '@/components/ui/loading-gif';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading Osmo Cards..." }: LoadingStateProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-8">
        <LoadingGif size="xl" />
      </div>
    </div>
  );
}
