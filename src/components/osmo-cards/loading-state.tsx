import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading Osmo Cards..." }: LoadingStateProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{message}</span>
      </div>
    </div>
  );
}
