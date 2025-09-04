import React from 'react';

interface ErrorStateProps {
  error: Error;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Có lỗi xảy ra: {error?.message}</p>
      </div>
    </div>
  );
}
