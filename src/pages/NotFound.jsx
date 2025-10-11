import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundIcon = () => (
  <svg className="w-40 h-40 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4">
      <div className="text-center">
        <div className="relative inline-block">
           <NotFoundIcon />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-slate-800 tracking-tighter mt-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mt-2">
          Page Not Found
        </h2>
        
        <p className="text-slate-500 mt-4 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or maybe you just mistyped the URL.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            &larr; Go to Homepage
          </Link>
          <button 
             onClick={() => window.history.back()}
             className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;