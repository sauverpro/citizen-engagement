import React from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  const color = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600';
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${color}`}>
      <span>{message}</span>
      {onClose && (
        <button className="ml-4 text-white font-bold" onClick={onClose}>&times;</button>
      )}
    </div>
  );
}
