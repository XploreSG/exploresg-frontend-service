import React from "react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="rounded-xl bg-white p-8 text-center shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          Something Went Wrong
        </h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={onRetry}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
