import React from "react";
import { Link } from "react-router-dom";

const AccessDeniedPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="mb-4 text-4xl font-bold text-red-600">Access Denied</h1>
      <p className="mb-8 text-lg text-gray-700">
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default AccessDeniedPage;
