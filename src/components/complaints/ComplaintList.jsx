import React from 'react';

export default function ComplaintList({ complaints }) {
  return (
    <div className="complaint-list-container max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">My Complaints</h2>
      <ul className="space-y-4">
        {complaints && complaints.length > 0 ? (
          complaints.map((c) => (
            <li key={c.id} className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 border-l-4 border-blue-500 dark:border-blue-400">
              <div className="flex justify-between items-center mb-2">
                <strong className="text-lg">{c.title}</strong>
                <span
                  className={(() => {
                    if (c.status === 'resolved') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-semibold';
                    if (c.status === 'in_progress') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs font-semibold';
                    if (c.status === 'assigned') return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold';
                    return 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded text-xs font-semibold';
                  })()}
                >
                  {c.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className="mb-2 text-gray-700 dark:text-gray-200">{c.description}</div>
              {c.response && <div className="text-blue-700 dark:text-blue-300"><b>Response:</b> {c.response}</div>}
            </li>
          ))
        ) : (
          <li className="text-gray-500 dark:text-gray-400">No complaints found.</li>
        )}
      </ul>
    </div>
  );
}
