import React from 'react';
import { Link } from 'react-router-dom';

const Error = ({ statusCode, message }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-6xl font-bold text-red-500">{statusCode}</h1>
        <p className="text-2xl font-semibold text-gray-800">Oops! Something went wrong.</p>
        <p className="text-gray-600">{message}</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Error;