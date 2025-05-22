import React from 'react';

export default function Loader() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
      <span className="ml-4 text-blue-700 dark:text-blue-300">Loading...</span>
    </div>
  );
}
