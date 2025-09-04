import React from 'react';

interface ErrorStateProps {
  error: Error | unknown;
}

export default function ErrorState({ error }: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Có lỗi xảy ra: {errorMessage}</p>
      </div>
    </div>
  );
}
